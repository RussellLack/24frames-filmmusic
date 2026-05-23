"use client";

import Script from "next/script";

/**
 * Google Tag Manager with Consent Mode v2.
 *
 * Loads GTM on every visit. A consent default is set before the container
 * fires: first-party analytics granted (legitimate interest), ad storage
 * denied. The GA4 Configuration tag lives INSIDE the GTM container
 * (GTM-M88MJ7PJ -> G-548NDBH1F3), so no GA4 measurement ID is set here.
 */

const GTM_ID = "GTM-M88MJ7PJ";

const inlineInit = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted'
});

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
`;

export default function Analytics() {
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {inlineInit}
    </Script>
  );
}
