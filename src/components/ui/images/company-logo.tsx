import Image from "next/image";

export function CompanyLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo_lpi.jpg"
      alt="Logo LPI"
      fill
      sizes="(max-width: 640px) 32px, (max-width: 1024px) 64px, 128px"
      className={`object-cover ${className}`}
      priority // 💡 Tambahkan ini jika logo berada di atas folder/header agar langsung dimuat
    />
  );
}