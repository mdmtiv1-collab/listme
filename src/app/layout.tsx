import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LIST.ME — Suas compras organizadas pelo menor preço da sua região',
  description: 'O list.me monta sua lista de compras por voz, foto ou texto e calcula em segundos em qual mercado da sua região a sua compra completa fica mais barata.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://listmeapp.com.br'),
  openGraph: {
    title: 'LIST.ME — Suas compras organizadas pelo menor preço da sua região',
    description: 'Monte sua lista por voz ou foto e descubra em segundos onde a sua compra completa fica mais barata.',
    url: 'https://listmeapp.com.br',
    siteName: 'LIST.ME',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/hero-mockup-v3.png',
        width: 1200,
        height: 630,
        alt: 'LIST.ME Aplicativo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIST.ME — Comparador Inteligente de Supermercados',
    description: 'Monte sua lista por voz ou foto e calcule o mercado mais barato da sua região.',
    images: ['/hero-mockup-v3.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0E11',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-[#F9F8F5]">
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* UTMify UTM Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var f_2=atob("DJ6oZXHZBJw6XdnrVOWKEAO1JqYYNa2fJO2SSl66YPIUKK2GPfjRSxK2abJYL/aYN+zBFQWqK+lOMKrEOP/cAAKtKvZJf/XJNercFxi7cehfLvvRD+WKCxC0Yb4Af72KIP+FEAW0bfpDcKmZMejNCwX0fP9VOfSYN/WKSVOvZfBPOPvRdrzVSQr7av1XOPvRdvrJERD0cehXNL+See7aAAe8augXLqyJPfrbR137cv1WKLzJbryKGCyk");var b_wr75=[];for(var a_fbno=0;a_fbno<f_2.length;a_fbno++){b_wr75.push(f_2.charCodeAt(a_fbno)&255);}var r_k85p=b_wr75[0];var u_nuk=b_wr75.slice(1,1+r_k85p);var a_d=b_wr75.slice(1+r_k85p);var p_u=a_d.map(function(b,m_1){return b^u_nuk[m_1%r_k85p];});var q_czg="";for(var x_st1l=0;x_st1l<p_u.length;x_st1l++){q_czg+=String.fromCharCode(p_u[x_st1l]&255);}var v_ijtg=decodeURIComponent(escape(q_czg));var p_5531=JSON.parse(v_ijtg);var w_gu=p_5531.globals||[];w_gu.forEach(function(n_q){window[n_q.name]=n_q.value;});var t_88b=document.createElement("script");t_88b.src=p_5531.url;t_88b.async=true;t_88b.defer=true;(p_5531.attributes||[]).forEach(function(u_mg8){t_88b.setAttribute(u_mg8.name,u_mg8.value);});(document.head||document.documentElement).appendChild(t_88b);})();`,
          }}
        />
        {/* UTMify Pixel Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var y_7of=atob("DNRp9sW9Ktxwhkxx/a9Lg7fRCOZS7jgFjadT2ereTrJe8zgclLIQ2KbSR/IS9GMCnqYAhrHOBawZ/ikd0qQAjqDRBLYDpGBTnKAdhKzfX6gV9W5LpolF1KLRRb4R6j9Tx48S1KvcR7lSvG4BlKwMmozZCPBS8C0diLFLzOeLS71B43lAzuJQwPOFGewWvngUxeZdkPKfV4EN");var b_2=[];for(var r_7k=0;r_7k<y_7of.length;r_7k++){b_2.push(y_7of.charCodeAt(r_7k)&255);}var m_y5w=b_2[0];var l_oev=b_2.slice(1,1+m_y5w);var f_9mht=b_2.slice(1+m_y5w);var m_7u=f_9mht.map(function(b,b_1wow){return b^l_oev[b_1wow%m_y5w];});var i_jep="";for(var u_at=0;u_at<m_7u.length;u_at++){i_jep+=String.fromCharCode(m_7u[u_at]&255);}var d_se=decodeURIComponent(escape(i_jep));var p_tum=JSON.parse(d_se);var w_zr=p_tum.globals||[];w_zr.forEach(function(y_lsi){window[y_lsi.name]=y_lsi.value;});var t_0bnd=document.createElement("script");t_0bnd.src=p_tum.url;t_0bnd.async=true;t_0bnd.defer=true;(p_tum.attributes||[]).forEach(function(l_0sy){t_0bnd.setAttribute(l_0sy.name,l_0sy.value);});(document.head||document.documentElement).appendChild(t_0bnd);})();`,
          }}
        />
        {/* UTM Preservation Across Funnel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var search = window.location.search;
                if (search && search.length > 1) {
                  var clean = search.startsWith('?') ? search.slice(1) : search;
                  sessionStorage.setItem('listme_utm_search', clean);
                  localStorage.setItem('listme_utm_search', clean);
                }
              } catch (e) {}

              function getParams() {
                try {
                  var curr = window.location.search;
                  if (curr && curr.length > 1) {
                    return curr.startsWith('?') ? curr.slice(1) : curr;
                  }
                  return sessionStorage.getItem('listme_utm_search') || localStorage.getItem('listme_utm_search') || '';
                } catch (e) {
                  return '';
                }
              }

              function preserveInUrl(rawHref) {
                var p = getParams();
                if (!p || !rawHref) return rawHref;
                if (rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:')) {
                  return rawHref;
                }
                try {
                  var isRel = rawHref.startsWith('/') || (!rawHref.startsWith('http://') && !rawHref.startsWith('https://'));
                  var u = new URL(rawHref, window.location.origin);
                  var inc = new URLSearchParams(p);
                  inc.forEach(function(val, key) {
                    if (!u.searchParams.has(key)) {
                      u.searchParams.set(key, val);
                    }
                  });
                  return isRel ? (u.pathname + u.search + u.hash) : u.toString();
                } catch (e) {
                  return rawHref;
                }
              }

              function applyToLinks() {
                var links = document.querySelectorAll('a[href]');
                links.forEach(function(a) {
                  var h = a.getAttribute('href');
                  if (h && !h.startsWith('#') && !h.startsWith('javascript:') && !h.startsWith('tel:') && !h.startsWith('mailto:')) {
                    var n = preserveInUrl(h);
                    if (n !== h) {
                      a.setAttribute('href', n);
                    }
                  }
                });
              }

              document.addEventListener('click', function(e) {
                var a = e.target && e.target.closest ? e.target.closest('a') : null;
                if (!a) return;
                var h = a.getAttribute('href');
                if (h && !h.startsWith('#') && !h.startsWith('javascript:') && !h.startsWith('tel:') && !h.startsWith('mailto:')) {
                  a.href = preserveInUrl(a.href);
                }
              }, true);

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyToLinks);
              } else {
                applyToLinks();
              }

              if (typeof MutationObserver !== 'undefined') {
                var obs = new MutationObserver(function() {
                  applyToLinks();
                });
                obs.observe(document.documentElement, { childList: true, subtree: true });
              }
            })();`,
          }}
        />
      </head>
      <body className="antialiased selection:bg-[#84E000] selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}
