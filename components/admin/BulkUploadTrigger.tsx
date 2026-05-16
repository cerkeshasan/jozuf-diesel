"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import BulkUpload from "@/components/admin/BulkUpload";

export default function BulkUploadTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
      >
        <Upload size={16} />
        Toplu Yükle
      </button>
      {open && <BulkUpload onClose={() => setOpen(false)} />}
    </>
  );
}
