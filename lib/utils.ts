export function formatDate(dateString: string, style: 'long' | 'short' = 'long'): string {
  const date = new Date(dateString)
  if (style === 'short') return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^(www\.|m\.)/, '')
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    if (host === 'youtube.com') {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] === 'shorts' || parts[0] === 'embed') return parts[1] || null
    }
    return null
  } catch {
    return null
  }
}

// Estimate reading time from Portable Text blocks. ~220 wpm.
export function readingTimeMinutes(body: any[] | undefined | null): number {
  if (!body || !Array.isArray(body)) return 0
  let words = 0
  for (const block of body) {
    if (block?._type !== 'block' || !Array.isArray(block.children)) continue
    for (const child of block.children) {
      if (typeof child?.text === 'string') {
        words += child.text.trim().split(/\s+/).filter(Boolean).length
      }
    }
  }
  return Math.max(1, Math.round(words / 220))
}
