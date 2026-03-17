export async function uploadToCloudinary(blob) {
  const formData = new FormData()
  formData.append('file', blob)
  formData.append('upload_preset', 'prueba')

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dns1xuugx/image/upload',
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  return data.secure_url
}