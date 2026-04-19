import Link from 'next/link'

const SITE_NAME = '24 Frames Under'

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-name">{SITE_NAME}</Link>
      <div className="nav-links">
        <Link href="/">writing</Link>
        <Link href="/topics">topics</Link>
        <Link href="/about">about</Link>
      </div>
    </nav>
  )
}
