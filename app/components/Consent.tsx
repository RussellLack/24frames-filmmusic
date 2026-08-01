'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

type Choice = 'accepted' | 'declined' | null

const STORAGE_KEY = 'consent'
const gtmId = process.env.NEXT_PUBLIC_GTM_ID

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * GTM with Google Consent Mode v2 — loads on every visit.
 *
 * A consent default is set before GTM fires: first-party analytics granted
 * (legitimate interest) unless the visitor explicitly Declines; ad storage
 * denied until they explicitly Accept. The banner's buttons send a
 * gtag('consent','update',...) so tags respond without a reload.
 *
 * The GA4 tag in GTM (GTM-PVQX4SX2 -> G-548NDBH1F3) must fire on
 * "Initialization - All Pages" for this to collect from everyone.
 */
const inlineInit = (id: string) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;

var stored = null;
try { stored = localStorage.getItem('${STORAGE_KEY}'); } catch (e) {}
var accepted = stored === 'accepted';
var declined = stored === 'declined';

var analyticsState = declined ? 'denied' : 'granted';
var adState = accepted ? 'granted' : 'denied';

gtag('consent', 'default', {
  ad_storage: adState,
  ad_user_data: adState,
  ad_personalization: adState,
  analytics_storage: analyticsState,
  functionality_storage: adState,
  personalization_storage: adState,
  security_storage: 'granted',
  wait_for_update: 500
});

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');
`

export default function Consent() {
  const [choice, setChoice] = useState<Choice>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Choice
    setChoice(stored === 'accepted' || stored === 'declined' ? stored : null)
    setHydrated(true)
  }, [])

  const update = (analytics: 'granted' | 'denied', ads: 'granted' | 'denied') => {
    window.gtag?.('consent', 'update', {
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
      analytics_storage: analytics,
      functionality_storage: ads,
      personalization_storage: ads,
    })
  }

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
    setChoice('accepted')
    update('granted', 'granted')
  }

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, 'declined')
    setChoice('declined')
    // Explicit decline overrides the legitimate-interest default for analytics too.
    update('denied', 'denied')
  }

  const revoke = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    // Reload so consent state is re-evaluated from scratch.
    window.location.reload()
  }

  if (!hydrated) return null

  return (
    <>
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {inlineInit(gtmId)}
        </Script>
      )}

      {choice === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: '#111',
            color: '#fff',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            lineHeight: 1.4,
          }}
        >
          <span style={{ maxWidth: '60ch' }}>
            We use Google Analytics to understand how visitors use this site. Accept to
            also allow advertising and personalisation cookies, or decline non-essential
            cookies.
          </span>
          <span style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={decline}
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid #fff',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              Decline
            </button>
            <button
              onClick={accept}
              style={{
                background: '#fff',
                color: '#111',
                border: '1px solid #fff',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              Accept
            </button>
          </span>
        </div>
      )}

      {choice !== null && (
        <button
          onClick={revoke}
          aria-label="Change cookie settings"
          style={{
            position: 'fixed',
            left: '0.75rem',
            bottom: '0.75rem',
            zIndex: 999,
            background: 'rgba(17,17,17,0.85)',
            color: '#fff',
            border: 'none',
            padding: '0.35rem 0.6rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            font: 'inherit',
            borderRadius: 2,
          }}
        >
          Cookie settings
        </button>
      )}
    </>
  )
}
