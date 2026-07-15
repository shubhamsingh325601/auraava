export async function uploadImage(file?: File | null): Promise<string> {
    if (!file) return ""

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "test-name") // Replace with your Cloudinary upload preset if needed

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dmfxly4bz/image/upload", {
            method: "POST",
            body: formData,
        })

        if (!res.ok) {
            throw new Error(`Upload failed with status ${res.status}`)
        }

        const data = await res.json()
        return data.secure_url || ""
    } catch (err) {
        console.error("Image upload error:", err)
        return ""
    }
}


