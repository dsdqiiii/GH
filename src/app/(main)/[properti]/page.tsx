export default async function PropertiPage({ params }: { params: Promise<{ properti: string }> }) {
  const { properti } = await params
  return (
    <main>
      <h1>Detail Properti</h1>
      <p>Properti: <code>{properti}</code></p>
    </main>
  )
}