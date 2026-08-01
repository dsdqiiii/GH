"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function FileUpload({
  label = "Upload Berkas",
  accept = "image/*,.pdf",
  maxSizeMB = 5,
  value,
  onChange,
  error,
  disabled = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bersihkan object URL lama setiap kali preview berganti/unmount,
  // supaya tidak bocor memori.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Kalau value dikosongkan dari parent (mis. setelah submit sukses),
  // ikut bersihkan input & preview di sini.
  useEffect(() => {
    if (!value) {
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [value]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFileError(null);

    if (!selectedFile) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Validasi ukuran file
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

  function handleRemove() {
    setFileError(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-taupe">{label}</label>}

      <div className="relative border border-dashed border-sand rounded-lg p-4 text-center hover:bg-cream/20 transition-colors">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {value ? (
          <div className="flex items-center justify-between gap-3">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-md border border-sand"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-md border border-sand text-[10px] text-taupe">
                PDF
              </div>
            )}
            <span className="text-xs text-taupe truncate flex-1 text-left">
              {value.name}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="text-xs text-red-500 underline z-10 disabled:opacity-50"
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