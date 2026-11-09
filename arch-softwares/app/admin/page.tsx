'use client'
import { useEffect, useState, FormEvent } from 'react'
import { sb, configured, CATS } from '@/lib/supabase'

type F = { k: string; l: string; t?: 'area' | 'select' | 'bool' | 'img' | 'list' }
const PROJECT: F[] = [{ k: 'title', l: 'Title' }, { k: 'category', l: 'Category', t: 'select' }, { k: 'description', l: 'Description', t: 'area' }, { k: 'tech', l: 'Technologies (comma separated)', t: 'list' }, { k: 'image_url', l: 'Image', t: 'img' }, { k: 'live_url', l: 'Live URL' }, { k: 'github_url', l: 'GitHub URL' }, { k: 'featured', l: 'Featured on homepage', t: 'bool' }, { k: 'is_demo', l: 'Demo project', t: 'bool' }]
const PRODUCT: F[] = [{ k: 'name', l: 'Name' }, { k: 'description', l: 'Description', t: 'area' }, { k: 'features', l: 'Features (comma separated)', t: 'list' }, { k: 'price', l: 'Price (optional, e.g. ₦50,000)' }, { k: 'image_url', l: 'Image', t: 'img' }]
const CONTENT: F[] = [{ k: 'value', l: 'Text', t: 'area' }]

function Manager({ table, fields, title, noAdd }: { table: string; fields: F[]; title: string; noAdd?: boolean }) {
  const [rows, setRows] = useState<any[]>([]), [form, setForm] = useState<any>(null), [msg, setMsg] = useState('')
  const load = async () => { const { data } = await sb.from(table).select('*').order(table === 'content' ? 'key' : 'created_at', { ascending: table === 'content' }); setRows(data || []) }
  useEffect(() => { load() }, [table])
  const set = (k: string, v: any) => setForm({ ...form, [k]: v })
  async function upload(f: File) {
    const name = `${Date.now()}-${f.name.replace(/[^\w.]/g, '_')}`; const { error } = await sb.storage.from('images').upload(name, f)
    if (error) return setMsg('Upload failed: ' + error.message); set('image_url', sb.storage.from('images').getPublicUrl(name).data.publicUrl)
  }
  async function save(e: FormEvent) {
    e.preventDefault(); const row: any = {}
    fields.forEach(f => { const v = form[f.k]; row[f.k] = f.t === 'list' ? (Array.isArray(v) ? v : String(v || '').split(',').map(s => s.trim()).filter(Boolean)) : f.t === 'bool' ? !!v : (v ?? null) })
    const { error } = form.id ? await sb.from(table).update(row).eq('id', form.id) : await sb.from(table).insert(row)
    if (error) return setMsg('Save failed: ' + error.message); setForm(null); setMsg('Saved.'); load()
  }
  async function del(id: string) { if (!confirm('Delete this item?')) return; const { error } = await sb.from(table).delete().eq('id', id); setMsg(error ? error.message : 'Deleted.'); load() }
  return <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2>{!noAdd && <button className="btn" onClick={() => setForm({})}>Add new</button>}</div>
    {msg && <p role="status" className="mb-3 text-sm">{msg}</p>}
    {form && <form onSubmit={save} className="mb-6 grid gap-3 rounded-xl border p-4">{fields.map(f => <label key={f.k} className="text-sm">{f.l}
      {f.t === 'area' ? <textarea className="inp mt-1" rows={3} value={form[f.k] || ''} onChange={e => set(f.k, e.target.value)} /> :
        f.t === 'select' ? <select className="inp mt-1" required value={form[f.k] || ''} onChange={e => set(f.k, e.target.value)}><option value="">Choose…</option>{CATS.map(c => <option key={c}>{c}</option>)}</select> :
        f.t === 'bool' ? <input type="checkbox" className="ml-2" checked={!!form[f.k]} onChange={e => set(f.k, e.target.checked)} /> :
        f.t === 'img' ? <><input type="file" accept="image/*" className="inp mt-1" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />{form[f.k] && <img src={form[f.k]} alt="" className="mt-2 h-20 rounded" />}</> :
        <input className="inp mt-1" value={f.t === 'list' ? (Array.isArray(form[f.k]) ? form[f.k].join(', ') : form[f.k] || '') : form[f.k] || ''} onChange={e => set(f.k, e.target.value)} required={f.k === 'title' || f.k === 'name'} />}</label>)}
      <div className="flex gap-2"><button className="btn">Save</button><button type="button" className="btn2" onClick={() => setForm(null)}>Cancel</button></div></form>}
    {rows.length === 0 ? <p className="text-slate-500">Nothing here yet.</p> : <ul className="divide-y rounded-xl border">{rows.map(r => <li key={r.id} className="flex items-center justify-between gap-3 p-3 text-sm">
      <span className="truncate">{r.title || r.name || r.key}{r.featured && ' ★'}{table === 'content' && <i className="block truncate text-slate-500">{r.value}</i>}</span>
      <span className="flex shrink-0 gap-3"><button className="text-brand" onClick={() => setForm(r)}>Edit</button>{table !== 'content' && <button className="text-red-600" onClick={() => del(r.id)}>Delete</button>}</span></li>)}</ul>}
  </section>
}

function Queue({ table, statuses, title }: { table: string; statuses: string[]; title: string }) {
  const [rows, setRows] = useState<any[]>([]), [msg, setMsg] = useState('')
  const load = async () => { const { data } = await sb.from(table).select('*').order('created_at', { ascending: false }); setRows(data || []) }
  useEffect(() => { load() }, [table])
  async function setStatus(id: string, status: string) { const { error } = await sb.from(table).update({ status }).eq('id', id); setMsg(error ? error.message : 'Updated.'); load() }
  async function del(id: string) { if (!confirm('Delete permanently?')) return; await sb.from(table).delete().eq('id', id); load() }
  return <section><h2 className="mb-4 text-xl font-semibold">{title}</h2>{msg && <p role="status" className="mb-3 text-sm">{msg}</p>}
    {rows.length === 0 ? <p className="text-slate-500">Nothing here yet.</p> : <ul className="grid gap-3">{rows.map(r => <li key={r.id} className="rounded-xl border p-4 text-sm">
      <p className="font-semibold">{r.name}{r.rating && ` · ${r.rating}/5`} <span className="font-normal text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span></p>
      {r.email && <p><a className="text-brand" href={`mailto:${r.email}`}>{r.email}</a> {r.phone}</p>}
      {r.service && <p className="text-slate-500">{r.service}{r.subject && ' · ' + r.subject}</p>}
      <p className="mt-2 whitespace-pre-wrap">{r.message || r.comment}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {table === 'reviews' ? <><button className="btn" onClick={() => setStatus(r.id, 'approved')}>Approve</button><button className="btn2" onClick={() => setStatus(r.id, 'rejected')}>Reject</button><span>Status: {r.status}</span></> :
          <select aria-label="Status" className="inp w-auto" value={r.status} onChange={e => setStatus(r.id, e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select>}
        <button className="text-red-600" onClick={() => del(r.id)}>Delete</button></div></li>)}</ul>}
  </section>
}

function Stats() {
  const [n, setN] = useState<Record<string, string>>({})
  useEffect(() => { ['projects', 'products', 'enquiries', 'reviews'].forEach(async t => { const { count } = await sb.from(t).select('*', { count: 'exact', head: true }); setN(o => ({ ...o, [t]: String(count ?? 0) })) }) }, [])
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{['projects', 'products', 'enquiries', 'reviews'].map(t => <div key={t} className="rounded-xl border p-5"><p className="text-3xl font-bold text-brand">{n[t] ?? '…'}</p><p className="text-sm capitalize">{t}</p></div>)}</div>
}

export default function Admin() {
  const [user, setUser] = useState<any>(undefined), [tab, setTab] = useState('Overview'), [err, setErr] = useState('')
  useEffect(() => { if (!configured) return setUser(null); sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)); const { data } = sb.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null)); return () => data.subscription.unsubscribe() }, [])
  async function login(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const d = new FormData(e.currentTarget); const { error } = await sb.auth.signInWithPassword({ email: String(d.get('email')), password: String(d.get('password')) }); setErr(error ? 'Login failed. Check your email and password.' : '') }
  if (user === undefined) return <p className="p-8">Loading…</p>
  if (!user) return <main className="mx-auto max-w-sm p-8"><img src="/logo.png" alt="ARCH Softwares" className="mb-6 h-14" /><h1 className="mb-4 text-xl font-semibold">Admin login</h1>
    {!configured && <p className="mb-3 text-sm text-red-600">Supabase is not configured. Add the environment variables first.</p>}
    <form onSubmit={login} className="grid gap-3"><input name="email" type="email" required placeholder="Email" className="inp" autoComplete="username" /><input name="password" type="password" required placeholder="Password" className="inp" autoComplete="current-password" /><button className="btn">Log in</button>{err && <p role="alert" className="text-sm text-red-600">{err}</p>}</form></main>
  const tabs: Record<string, JSX.Element> = {
    Overview: <Stats />, Projects: <Manager table="projects" fields={PROJECT} title="Projects" />, Products: <Manager table="products" fields={PRODUCT} title="Products" />,
    Enquiries: <Queue table="enquiries" statuses={['new', 'in progress', 'resolved', 'closed']} title="Enquiries" />, Reviews: <Queue table="reviews" statuses={[]} title="Reviews" />,
    'Site text': <Manager table="content" fields={CONTENT} title="Site text (hero_title, hero_text, about)" noAdd />,
  }
  return <main className="mx-auto max-w-5xl p-5"><header className="mb-6 flex items-center justify-between"><img src="/logo.png" alt="ARCH Softwares" className="h-12" /><button className="btn2" onClick={() => sb.auth.signOut()}>Log out</button></header>
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Admin">{Object.keys(tabs).map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === t ? 'bg-brand text-white' : ''}`}>{t}</button>)}</nav>{tabs[tab]}</main>
}
