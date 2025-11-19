import { useState } from 'react'

function LinkForm({ onAdded }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [labels, setLabels] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        title,
        url,
        labels: labels.split(',').map(l => l.trim()).filter(Boolean),
        added_by: addedBy || 'anonymous',
        description: description || undefined,
      }
      const res = await fetch(`${baseUrl}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to add link')
      const data = await res.json()
      onAdded?.(data)
      setTitle('')
      setUrl('')
      setLabels('')
      setAddedBy('')
      setDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="e.g. SVGOMG" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} required type="url" className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="https://..." />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Labels (comma-separated)</label>
          <input value={labels} onChange={e=>setLabels(e.target.value)} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="CSS, SVG, Backend" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Your name</label>
          <input value={addedBy} onChange={e=>setAddedBy(e.target.value)} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="Who added this?" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-blue-100 mb-1">Description (optional)</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={2} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-500/60" placeholder="Short note" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={loading} className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Adding...' : 'Add link'}
        </button>
        {error && <span className="text-red-300 text-sm">{error}</span>}
      </div>
    </form>
  )
}

export default LinkForm
