-- =============================================
-- STOCK MOVEMENTS — Supabase SQL Editor'da çalıştır
-- =============================================

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out', 'set')),
  quantity INT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at DESC);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access stock_movements" ON stock_movements FOR ALL USING (auth.role() = 'service_role');
