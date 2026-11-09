'use client'
import { useEffect, useState, FormEvent } from 'react'
import { sb, configured, CATS, SERVICES } from '@/lib/supabase'

const PHONE = '09068638775', WA = 'https://wa.me/2349068638775', MAIL = '123asbsadiq@gmail.com'
const WHY = [['Built around your business', 'We start with the problem you need solved, not a template.'], ['Visible progress', 'You see working software in small steps, not a big reveal at the end.'], ['Support after launch', 'We maintain and improve what we build.'], ['Clear communication', 'Reach us by phone, WhatsApp or email and get a straight answer.']]

function Form({ kind }: { kind: 'enquiries' | 'reviews' }) {
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null), [busy, setBusy] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fm = e.currentTarget, d = Object.fromEntries(new FormData(fm)) as Record<string, any>
    const row: any = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v || '').trim().replace(/[<>]/g, '')]))
    if (row.name.length < 2) return setMsg({ ok: false, t: 'Enter your name.' })
    if (kind === 'enquiries' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) return setMsg({ ok: false, t: 'Enter a valid email address.' })
    if ((row.message || row.comment).length < 10) return setMsg({ ok: false, t: 'Write at least 10 characters.' })
    if (kind === 'reviews') row.rating = Number(row.rating)
    if (!configured) return setMsg({ ok: false, t: 'The database is not connected yet. Use WhatsApp or email instead.' })
    setBusy(true); const { error } = await sb.from(kind).insert(row); setBusy(false)
    if (error) return setMsg({ ok: false, t: 'Could not send. Check your connection and try again.' })
    fm.reset(); setMsg({ ok: true, t: kind === 'reviews' ? 'Thank you. Your review will appear after approval.' : 'Enquiry sent. We will reply soon.' })
  }
  const enq = kind === 'enquiries'
  return <form onSubmit={submit} className="grid gap-3" noValidate>
    <label className="text-sm">Name<input name="name" className="inp mt-1" required maxLength={100} /></label>
    {enq ? <>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Email<input name="email" type="email" className="inp mt-1" required /></label>
        <label className="text-sm">Phone<input name="phone" className="inp mt-1" maxLength={30} /></label></div>
      <label className="text-sm">Service<select name="service" className="inp mt-1">{SERVICES.map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="text-sm">Subject<input name="subject" className="inp mt-1" maxLength={150} /></label>
    </> : <label className="text-sm">Rating<select name="rating" className="inp mt-1" defaultValue="5">{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star{n > 1 && 's'}</option>)}</select></label>}
    <label className="text-sm">{enq ? 'Message' : 'Your review'}<textarea name={enq ? 'message' : 'comment'} rows={4} className="inp mt-1" required maxLength={3000} /></label>
    <button className="btn" disabled={busy}>{busy ? 'Sending…' : enq ? 'Send enquiry' : 'Submit review'}</button>
    {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.t}</p>}
  </form>
}

export default function Home() {
  const [projects, setP] = useState<any[]>([]), [products, setPr] = useState<any[]>([]), [reviews, setR] = useState<any[]>([])
  const [c, setC] = useState<Record<string, string>>({}), [cat, setCat] = useState('All Projects'), [state, setState] = useState('loading'), [open, setOpen] = useState(false)
  useEffect(() => {
    if (!configured) return setState('off')
    Promise.all([sb.from('projects').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false }), sb.from('products').select('*').order('created_at'),
      sb.from('reviews').select('*').eq('status', 'approved').order('created_at', { ascending: false }), sb.from('content').select('*')]).then(([a, b, r, k]) => {
      if (a.error || b.error) return setState('error')
      setP(a.data || []); setPr(b.data || []); setR(r.data || []); setC(Object.fromEntries((k.data || []).map((x: any) => [x.key, x.value]))); setState('ok')
    })
  }, [])
  const shown = projects.filter(p => cat === 'All Projects' || p.category === cat)
  const links = [['Work', '#work'], ['Services', '#services'], ['Products', '#products'], ['About', '#about'], ['Reviews', '#reviews'], ['Contact', '#contact']]
  const empty = (t: string) => <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{state === 'loading' ? 'Loading…' : state === 'ok' ? t : state === 'error' ? 'Could not load this content. Refresh the page.' : 'Content will appear here once the database is connected.'}</p>
  return <>
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2" aria-label="Main">
        <a href="#top"><img src="/logo.png" alt="ARCH Softwares" className="h-12 w-auto" /></a>
        <ul className="hidden gap-7 text-sm font-medium md:flex">{links.map(([l, h]) => <li key={h}><a className="hover:text-brand" href={h}>{l}</a></li>)}</ul>
        <button className="md:hidden rounded border px-3 py-1.5 text-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </nav>
      {open && <ul className="border-t px-5 py-3 md:hidden">{links.map(([l, h]) => <li key={h}><a className="block py-2" href={h} onClick={() => setOpen(false)}>{l}</a></li>)}</ul>}
    </header>
    <main id="top">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <div><h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">{c.hero_title || 'Software built in Nigeria, ready for the world.'}</h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">{c.hero_text || 'ARCH Softwares designs and builds websites, web and mobile apps and custom software that help businesses grow.'}</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#work" className="btn">Explore Our Work</a><a href="#contact" className="btn2">Contact Us</a></div></div>
        <img src="/logo.png" alt="" className="w-full" />
      </section>

      <section id="work" className="bg-slate-50 py-20"><div className="mx-auto max-w-6xl px-5">
        <h2 className="text-3xl font-bold">Our work</h2><p className="mt-2 text-slate-600">Projects marked Demo are demonstration builds, not client work.</p>
        <div className="my-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">{['All Projects', ...CATS].map(k => <button key={k} onClick={() => setCat(k)} aria-pressed={cat === k} className={`rounded-full border px-4 py-1.5 text-sm ${cat === k ? 'border-brand bg-brand text-white' : 'bg-white hover:border-brand'}`}>{k}</button>)}</div>
        {shown.length === 0 ? empty('No projects in this category yet.') : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map(p => <article key={p.id} className="overflow-hidden rounded-xl border bg-white">
          {p.image_url ? <img src={p.image_url} alt={p.title} loading="lazy" className="aspect-video w-full object-cover" /> : <div className="aspect-video bg-slate-100" />}
          <div className="p-5"><p className="text-xs text-brand">{p.category}{p.is_demo && ' · Demo project'}</p><h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{p.description}</p>
            <p className="mt-3 flex flex-wrap gap-1.5">{(p.tech || []).map((t: string) => <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs">{t}</span>)}</p>
            <div className="mt-4 flex gap-4 text-sm font-semibold">{p.live_url && <a className="text-brand" href={p.live_url} target="_blank" rel="noopener noreferrer">View Project</a>}{p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}</div></div></article>)}</div>}
      </div></section>

      <section id="services" className="mx-auto max-w-6xl px-5 py-20"><h2 className="text-3xl font-bold">Services</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{SERVICES.map(s => <a href="#contact" key={s} className="rounded-xl border p-5 font-semibold transition hover:border-brand hover:text-brand">{s}</a>)}</div></section>

      <section id="products" className="bg-slate-50 py-20"><div className="mx-auto max-w-6xl px-5"><h2 className="text-3xl font-bold">Products</h2>
        <div className="mt-8">{products.length === 0 ? empty('No products listed yet.') : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(p => <article key={p.id} className="overflow-hidden rounded-xl border bg-white">
          {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="aspect-video w-full object-cover" />}
          <div className="p-5"><h3 className="text-lg font-semibold">{p.name}</h3><p className="mt-2 text-sm text-slate-600">{p.description}</p>
            <ul className="mt-3 list-disc pl-5 text-sm">{(p.features || []).map((f: string) => <li key={f}>{f}</li>)}</ul>
            <div className="mt-4 flex items-center justify-between"><b>{p.price}</b><a className="btn" href={`${WA}?text=${encodeURIComponent('Hello ARCH Softwares, I would like to enquire about ' + p.name)}`} target="_blank" rel="noopener noreferrer">Enquire Now</a></div></div></article>)}</div>}</div></div></section>

      <section id="about" className="mx-auto max-w-6xl px-5 py-20"><h2 className="text-3xl font-bold">About ARCH Softwares</h2>
        <p className="mt-4 max-w-2xl text-slate-600">{c.about}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{WHY.map(([t, d]) => <div key={t} className="rounded-xl border-l-4 border-brand bg-slate-50 p-5"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></div>)}</div></section>

      <section id="reviews" className="bg-slate-50 py-20"><div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
        <div><h2 className="text-3xl font-bold">Customer reviews</h2><div className="mt-6 grid gap-4">{reviews.length === 0 ? empty('No reviews yet. Be the first to leave one.') : reviews.map(r => <blockquote key={r.id} className="rounded-xl border bg-white p-5"><p aria-label={`${r.rating} out of 5`} className="text-brand">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p><p className="mt-2 text-sm">{r.comment}</p><footer className="mt-2 text-sm font-semibold">{r.name}</footer></blockquote>)}</div></div>
        <div><h3 className="text-xl font-semibold">Leave a review</h3><p className="mb-4 text-sm text-slate-600">Reviews are published after approval.</p><Form kind="reviews" /></div></div></section>

      <section id="contact" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
        <div><h2 className="text-3xl font-bold">Contact us</h2><p className="mt-3 text-slate-600">Tell us what you want to build.</p>
          <ul className="mt-6 space-y-2"><li>Phone: <a className="text-brand" href={`tel:${PHONE}`}>{PHONE}</a></li><li>Email: <a className="text-brand" href={`mailto:${MAIL}`}>{MAIL}</a></li></ul>
          <a className="btn mt-6" href={WA} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></div>
        <Form kind="enquiries" /></section>
    </main>
    <footer className="border-t py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} ARCH Softwares · Innovate. Build. Grow.</footer>
  </>
}
