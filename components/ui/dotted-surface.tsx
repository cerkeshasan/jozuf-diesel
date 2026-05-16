'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		animationId: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setClearColor(0x000000, 0);

		container.appendChild(renderer.domElement);

		const geometry = new THREE.BufferGeometry();
		const positions: number[] = [];
		const colors: number[] = [];

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
				positions.push(x, 0, z);
				// Beyaz noktalar — lacivert arka plan üzerinde görünür
				colors.push(1, 1, 1);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 6,
			vertexColors: true,
			transparent: true,
			opacity: 0.4,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const pos = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					pos[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}

			positionAttribute.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		window.addEventListener('resize', handleResize);
		animate();

		sceneRef.current = { scene, camera, renderer, animationId };

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
			scene.traverse((obj) => {
				if (obj instanceof THREE.Points) {
					obj.geometry.dispose();
					(obj.material as THREE.Material).dispose();
				}
			});
			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
			{...props}
		/>
	);
}
