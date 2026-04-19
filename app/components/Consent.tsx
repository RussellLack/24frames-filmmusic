'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

type Choice = 'accepted' | 'declined' | null

const STORAGE_KEY = 'consent'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export default function Consent() {
  const [choice, setChoice] = useState<Choice>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Choice
    setChoice(stored === 'accepted' || stored === 'declined' ? stored : null)
    setHydrated(true)
  }, [])

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
    setChoice('accepted')
  }

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, 'declined')
    setChoice('declined')
  }

  const revoke = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    // Reload so any previously-loaded GTM/GA is evicted from memory.
    window.location.reload()
  }

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!hydrated) return null

  return (
    <>
      {choice === 'accepted' && gtmId && (
        <>
          <Script id="gtm-datalayer" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:'consent_accepted'});`}
          </Script>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        </>
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
            We use Google Analytics to understand how visitors use this site. Analytics
            only loads if you accept.
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
