import Link from 'next/link'
import { countryLabel } from '@/lib/countries'

type Composer = { _id: string; name: string; slug: string }
type Title = { _id: string; name: string; kind?: string; slug: string }

export default function CrossRefs({
  composers,
  titles,
  years,
  countries,
  excludeYear,
  excludeCountry,
  title = 'Related',
}: {
  composers?: Composer[]
  titles?: Title[]
  years?: number[]
  countries?: string[]
  excludeYear?: number
  excludeCountry?: string
  title?: string
}) {
  const hasAny =
    (composers && composers.length > 0) ||
    (titles && titles.length > 0) ||
    (years && years.filter((y) => y !== excludeYear).length > 0) ||
    (countries && countries.filter((c) => c !== excludeCountry).length > 0)

  if (!hasAny) return null

  return (
    <aside className="cross-refs">
      <div className="mono-label">{title}</div>
      <div className="cross-groups">
        {composers && composers.length > 0 && (
          <div className="cross-group">
            <h3 className="cross-group-heading">Composers</h3>
            <div className="tag-row">
              {composers.map((c) => (
                <Link key={c._id} href={`/composer/${c.slug}`} className="tag">{c.name}</Link>
              ))}
            </div>
          </div>
        )}
        {titles && titles.length > 0 && (
          <div className="cross-group">
            <h3 className="cross-group-heading">Films & TV</h3>
            <div className="tag-row">
              {titles.map((t) => (
                <Link key={t._id} href={`/title/${t.slug}`} className="tag">{t.name}</Link>
              ))}
            </div>
          </div>
        )}
        {years && years.filter((y) => y !== excludeYear).length > 0 && (
          <div className="cross-group">
            <h3 className="cross-group-heading">Years</h3>
            <div className="tag-row">
              {years
                .filter((y) => y !== excludeYear)
                .sort((a, b) => b - a)
                .map((y) => (
                  <Link key={y} href={`/year/${y}`} className="tag">{y}</Link>
                ))}
            </div>
          </div>
        )}
        {countries && countries.filter((c) => c !== excludeCountry).length > 0 && (
          <div className="cross-group">
            <h3 className="cross-group-heading">Countries</h3>
            <div className="tag-row">
              {countries
                .filter((c) => c !== excludeCountry)
                .map((c) => (
                  <Link key={c} href={`/country/${c}`} className="tag">{countryLabel(c)}</Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
