import './globals.css'
import { Sora } from 'next/font/google'
const f = Sora({ subsets: ['latin'], variable: '--f' })
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ARCH Softwares | Software development company in Nigeria',
  description: 'ARCH Softwares builds websites, web and mobile apps and custom software for Nigerian businesses. Innovate. Build. Grow.',
  icons: { icon: '/logo.png' }, openGraph: { images: ['/logo.png'] },
}
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={`${f.variable} font-sans text-ink bg-white antialiased`}>{children}</body></html>
}
