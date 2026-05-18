import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const store_name = formData.get('store_name') as string
    const store_description = formData.get('store_description') as string
    const messenger_link = formData.get('messenger_link') as string
    const gcash_qr_url = formData.get('gcash_qr_url') as string

    const { error } = await supabase
      .from('profiles')
      .update({
        store_name,
        store_description,
        messenger_link,
        gcash_qr_url,
        is_seller: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id)

    if (error) {
      console.error(error)
    }

    revalidatePath('/dashboard/settings')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted text-sm font-light">Manage your storefront identity and payment details.</p>
      </div>

      <form action={updateProfile} className="space-y-6">
        <div className="premium-card p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">Store Name</label>
              <input 
                name="store_name"
                defaultValue={profile?.store_name || ''}
                className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all"
                placeholder="e.g. Bohol Artisans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">Facebook Messenger Link</label>
              <input 
                name="messenger_link"
                defaultValue={profile?.messenger_link || ''}
                className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all"
                placeholder="e.g. https://m.me/username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">Store Description</label>
            <textarea 
              name="store_description"
              defaultValue={profile?.store_description || ''}
              rows={4}
              className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all resize-none"
              placeholder="Tell your story..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted font-bold ml-1">GCash QR Code URL (Image Link)</label>
            <input 
              name="gcash_qr_url"
              defaultValue={profile?.gcash_qr_url || ''}
              className="w-full bg-accent border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-white/30 transition-all"
              placeholder="Paste image URL here"
            />
            <p className="text-[10px] text-muted italic ml-1">Upload your QR to a service like Imgur or Supabase Storage and paste the link here.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
