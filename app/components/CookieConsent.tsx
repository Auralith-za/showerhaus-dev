import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem('showerhaus_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // If consent exists, trigger the tracking scripts if marketing was accepted
      try {
        const parsed = JSON.parse(consent);
        if (parsed.marketing) {
          triggerTrackingScripts();
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = { analytics: true, marketing: true, necessary: true };
    localStorage.setItem('showerhaus_cookie_consent', JSON.stringify(consent));
    setShowBanner(false);
    triggerTrackingScripts();
  };

  const handleDecline = () => {
    const consent = { analytics: false, marketing: false, necessary: true };
    localStorage.setItem('showerhaus_cookie_consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const triggerTrackingScripts = () => {
    // GA is already loaded unconditionally in root.tsx <head>
    // Only load optional/consent-gated pixels here

    // Meta (Facebook) Pixel Code
    const fbScript = document.createElement('script');
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1701792694446502');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animation-slide-up pointer-events-none">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pointer-events-auto">
          
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-primary mb-2">We value your privacy</h3>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
              Read more in our <Link to="/legal/cookies" className="text-secondary hover:underline">Cookies Policy</Link> and <Link to="/legal/privacy" className="text-secondary hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <button 
              onClick={handleDecline}
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-sans text-sm font-medium hover:bg-gray-50 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Decline Optional
            </button>
            <button 
              onClick={handleAcceptAll}
              className="px-8 py-3 rounded-full bg-primary text-white font-sans text-sm font-medium hover:bg-[#1e3b6e] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-md hover:shadow-lg"
            >
              Accept All
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
