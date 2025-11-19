import { useEffect, useState } from 'react'

function Account({ onChange }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar_url, setAvatarUrl] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('devlinks:user')
      if (raw) {
        const u = JSON.parse(raw)
        setName(u.name || '')
        setEmail(u.email || '')
        setAvatarUrl(u.avatar_url || '')
      }
    } catch {}
  }, [])

  const save = () => {
    const user = { name: name.trim(), email: email.trim() || undefined, avatar_url: avatar_url.trim() || undefined }
    localStorage.setItem('devlinks:user', JSON.stringify(user))
    onChange?.(user)
  }

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-900/70 border border-white/10 overflow-hidden flex items-center justify-center text-blue-200">
          {avatar_url ? <img src={avatar_url} alt="avatar" className="w-full h-full object-cover"/> : (name?.[0]?.toUpperCase() || 'U')}
        </div>
        <div>
          <div className="text-sm text-blue-100">Signed in as</div>
          <div className="font-medium">{name || 'Anonymous'}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Email (optional)</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="you@dev.com" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Avatar URL (optional)</label>
          <input value={avatar_url} onChange={e=>setAvatarUrl(e.target.value)} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="https://..." />
        </div>
      </div>
      <div>
        <button onClick={save} className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-100 text-sm">Save</button>
      </div>
      <p className="text-xs text-blue-200/70">Your name is attached to links you add. Changes are saved locally.</p>
    </div>
  )
}

export default Account
