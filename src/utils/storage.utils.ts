export function generatePaymentProofPath(
  file: File
) {
  const folder = crypto.randomUUID().slice(0, 8)
  const random = crypto.randomUUID().slice(0, 6)

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'

  return `${folder}/payment-${random}.${extension}`
}