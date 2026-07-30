"use client";

import { ChangeEvent, useState } from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label = "Upload Berkas",
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  onChange,
  error,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFileError(null);

    if (!selectedFile) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Validasi Ukuran File
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setFileError(`Ukuran file maksimal ${maxSizeMB}MB`);
      onChange(null);
      return;
    }

    // Generate preview jika berupa gambar
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }

    onChange(selectedFile);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-taupe">{label}</label>}

      <div className="relative border border-dashed border-sand rounded-lg p-4 text-center hover:bg-cream/20 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="flex items-center justify-between gap-3">
            <img
              src={preview}
              alt="Preview"
              className="w-12 h-12 object-cover rounded-md border border-sand"
            />
            <span className="text-xs text-taupe truncate flex-1 text-left">
              File terpilih
            </span>
            <button
              type="button"
              onClick={() => handleFileChange({ target: { files: null } } as any)}
              className="text-xs text-red-500 underline z-10"
            >
              Hapus
            </button>
          </div>
        ) : (
          <div className="text-xs text-taupe">
            <span className="font-medium text-terracotta">Pilih file</span> atau
            drag & drop di sini
            <p className="text-[10px] text-taupe/70 mt-1">
              Maksimal {maxSizeMB}MB ({accept})
            </p>
          </div>
        )}
      </div>

      {(error || fileError) && (
        <p className="text-xs text-red-500 mt-0.5">{error || fileError}</p>
      )}
    </div>
  );
}