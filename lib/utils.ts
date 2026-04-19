export function formatDate(dateString: string, style: 'long' | 'short' = 'long'): string {
  const date = new Date(dateString)
  if (style === 'short') return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = { score: 'score', composer: 'composer', soundtrack: 'soundtrack', essay: 'essay' }
  return map[category] ?? category
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
