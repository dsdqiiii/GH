export default async function UnitPage({ params }: { params: Promise<{ properti: string; unit: string }> }) {
  const { properti, unit } = await params
  return (
    <main>
      <h1>Detail Unit</h1>
      <p>Properti: <code>{properti}</code></p>
      <p>Unit: <code>{unit}</code></p>
    </main>
  )
}