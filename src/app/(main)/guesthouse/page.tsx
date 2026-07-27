import FeaturedGuesthouses from "@/components/landing/FeaturedGuestHouse";

export default function GuestHousePage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      <FeaturedGuesthouses />
    </main>
  );
}