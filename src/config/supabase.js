import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
)

async function uploadFile(file, folder) {
    const filePath = `${folder}/${crypto.randomUUID()}-${file.name}`

    // رفع الملف
    const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) throw error

    // إنشاء رابط مؤقت صالح لمدة ساعة
    const { data: signedData, error: signedError } = await supabase.storage
        .from('posts')
        .createSignedUrl(filePath, 60 * 60 * 24 * 30 * 12) // 1 ساعة
    if (signedError) throw signedError
    const nameFile = await supabase.storage.from('posts').getPublicUrl(filePath)
        .data.publicUrl
    console.log('File uploaded to:', signedData.signedUrl)
    return { nameFile, imageUrl: signedData.signedUrl }
}
async function deleteFile(filePath) {
    const { error } = await supabase.storage.from('posts').remove([filePath]) // يجب أن يكون مصفوفة حتى لو ملف واحد

    if (error) {
        console.error('Error deleting file:', error)
        throw error
    }

    console.log('File deleted successfully:', filePath)
}
export { supabase, uploadFile, deleteFile }
