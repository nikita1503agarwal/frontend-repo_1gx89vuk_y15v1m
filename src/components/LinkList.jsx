import { useEffect, useMemo, useState } from 'react'
import { Star, MousePointerClick, Tag, Pencil, Trash2, Check, X } from 'lucide-react'

function Label({ text, active, onClick }) {
  return (
    <button onClick={() => onClick?.(text)} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${active ? 'bg-blue-500/20 border-blue-500/40 text-blue-200' : 'bg-slate-900/40 border-white/10 text-blue-100/80 hover:border-blue-400/40'}`}>
      #{text}
    </button>
  )
}

function LinkCard({ link, onClickLink, onUpdate, onDelete, isOwner }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(link.title)
  const [labels, setLabels] = useState((link.labels || []).join(', '))
  const [description, setDescription] = useState(link.description || '')

  useEffect(() => {
    setTitle(link.title)
    setLabels((link.labels || []).join(', '))
    setDescription(link.description || '')
  }, [link])

  const startEdit = () => setEditing(true)
  const cancelEdit = () => { setEditing(false); setTitle(link.title); setLabels((link.labels||[]).join(', ')); setDescription(link.description||'') }
  const saveEdit = () => {
    const payload = {
      title: title.trim() || undefined,
      labels: labels.split(',').map(l=>l.trim()).filter(Boolean),
      description: description.trim() || undefined
    }
    onUpdate?.(link.id, payload, () => setEditing(false))
  }

  return (
    <div className="group bg-slate-800/60 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-blue-400/40 transition-colors">
      <div className="min-w-0">
        {!editing ? (
          <a href={link.url} target="_blank" rel="noreferrer" onClick={(e)=>{e.preventDefault(); onClickLink?.(link)}} className="block">
            <h3 className="text-white font-semibold truncate group-hover:text-blue-200">{link.title}</h3>
          </a>
        ) : (
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-white/10 px-2 py-1 text-white outline-none" />
        )}
        {!editing ? (
          <>
            {link.description && <p className="text-blue-100/70 text-sm line-clamp-2 mt-1">{link.description}</p>}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {link.labels?.map(l => <span key={l} className="text-[11px] px-2 py-0.5 rounded bg-slate-900/60 border border-white/10 text-blue-100/80">#{l}</span>)}
            </div>
          </>
        ) : (
          <>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} className="w-full rounded-md bg-slate-900/60 border border-white/10 px-2 py-1 text-white outline-none mt-2" />
            <input value={labels} onChange={e=>setLabels(e.target.value)} className="w-full rounded-md bg-slate-900/60 border border-white/10 px-2 py-1 text-white outline-none mt-2" />
          </>
        )}
        <div className="text-[11px] text-blue-100/60 mt-2">Added by {link.added_by || 'anonymous'}</div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="inline-flex items-center gap-1 text-blue-200 bg-slate-900/60 border border-white/10 px-2 py-1 rounded">
          <MousePointerClick size={14} />
          <span className="text-xs tabular-nums">{link.clicks ?? 0}</span>
        </div>
        {!editing ? (
          <div className="flex items-center gap-2">
            <a href={link.url} target="_blank" rel="noreferrer" onClick={(e)=>{e.preventDefault(); onClickLink?.(link)}} className="text-xs text-blue-300 hover:text-blue-200">Open</a>
            {isOwner && <button onClick={startEdit} className="text-xs text-blue-300 hover:text-blue-200 inline-flex items-center gap-1"><Pencil size={14}/> Edit</button>}
            {isOwner && <button onClick={()=>onDelete?.(link.id)} className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"><Trash2 size={14}/> Delete</button>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={saveEdit} className="text-xs text-green-300 hover:text-green-200 inline-flex items-center gap-1"><Check size={14}/> Save</button>
            <button onClick={cancelEdit} className="text-xs text-blue-300 hover:text-blue-200 inline-flex items-center gap-1"><X size={14}/> Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

function LinkList({ refresh = 0 }) {
  const [links, setLinks] = useState([])
  const [labels, setLabels] = useState([])
  const [activeLabel, setActiveLabel] = useState('')
  const [sort, setSort] = useState('popular')
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    try {
      const raw = localStorage.getItem('devlinks:user')
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const fetchLabels = async () => {
    const res = await fetch(`${baseUrl}/labels`)
    const data = await res.json()
    setLabels(Array.isArray(data) ? data : [])
  }

  const fetchLinks = async () => {
    const params = new URLSearchParams()
    if (activeLabel) params.set('label', activeLabel)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    const res = await fetch(`${baseUrl}/links?${params.toString()}`)
    const data = await res.json()
    setLinks(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchLabels()
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [activeLabel, sort, search, refresh])

  const onClickLink = async (link) => {
    try {
      await fetch(`${baseUrl}/links/${link.id}/click`, { method: 'POST' })
    } catch {}
    window.open(link.url, '_blank', 'noopener,noreferrer')
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, clicks: (l.clicks||0)+1 } : l))
  }

  const onUpdate = async (id, payload, done) => {
    try {
      const res = await fetch(`${baseUrl}/links/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to update')
      const updated = await res.json()
      setLinks(prev => prev.map(l => l.id === id ? updated : l))
      done?.()
      fetchLabels()
    } catch (e) {
      console.error(e)
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this link?')) return
    try {
      const res = await fetch(`${baseUrl}/links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setLinks(prev => prev.filter(l => l.id !== id))
      fetchLabels()
    } catch (e) {
      console.error(e)
    }
  }

  const isOwner = (link) => {
    const who = link.added_by?.toLowerCase?.()
    const me = user?.name?.toLowerCase?.()
    if (!who || !me) return false
    return who === me || (user?.email && link.added_by?.toLowerCase?.() === user.email.toLowerCase())
  }

  const total = Array.isArray(links) ? links.length : 0

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={()=>setActiveLabel('')} className={`px-2.5 py-1 rounded-full text-xs border ${!activeLabel ? 'bg-blue-500/20 border-blue-500/40 text-blue-200' : 'bg-slate-900/40 border-white/10 text-blue-100/80 hover:border-blue-400/40'}`}>All</button>
          {labels.map(l => (
            <Label key={l.label} text={l.label} active={activeLabel===l.label} onClick={() => setActiveLabel(l.label)} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-white outline-none focus:border-blue-500/60" />
            <Tag className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-200" size={16} />
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-lg overflow-hidden flex">
            <button onClick={()=>setSort('popular')} className={`px-3 py-2 text-sm ${sort==='popular' ? 'bg-blue-500/20 text-blue-100' : 'text-blue-100/80 hover:bg-white/5'}`}>
              <div className="inline-flex items-center gap-1"><Star size={14}/> Popular</div>
            </button>
            <button onClick={()=>setSort('new')} className={`px-3 py-2 text-sm ${sort==='new' ? 'bg-blue-500/20 text-blue-100' : 'text-blue-100/80 hover:bg-white/5'}`}>New</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(links) ? links : []).map(link => (
          <LinkCard key={link.id} link={link} onClickLink={onClickLink} onUpdate={onUpdate} onDelete={onDelete} isOwner={isOwner(link)} />
        ))}
      </div>

      {total === 0 && (
        <div className="text-center text-blue-100/70 text-sm py-6">No links yet. Add your first one above!</div>
      )}
    </section>
  )
}

export default LinkList
