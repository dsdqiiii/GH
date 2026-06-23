export default async function BookingIdPage({ params }: { params: Promise<{ properti: string; unit: string }> }) {
  const { properti, unit } = await params
  return (
    <main>
      <h1>Detail Booking</h1>
      <p>Properti: <code>{properti}</code></p>
      <p>Unit: <code>{unit}</code></p>
    </main>
  )
}