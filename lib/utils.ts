export function formatDate(dateString: string, style: 'long' | 'short' = 'long'): string {
  const date = new Date(dateString)
  if (style === 'short') return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = { score: 'score', composer: 'composer', soundtrack: 'soundtrack', essay: 'essay' }
  return map[category] ?? category
}
