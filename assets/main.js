(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (!toggle || !menu) return;

  const header = toggle.closest('.site-header');
  const behindMenu = document.querySelectorAll('main, .site-footer');
  let pageScroll = 0;
  function setMenu(open, restoreFocus = false) {
    if (open) pageScroll = window.scrollY;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    menu.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    behindMenu.forEach(element => { element.inert = open; });
    if (open) {
      menu.scrollTop = 0;
      menu.querySelector('a').focus({preventScroll:true});
    } else if (restoreFocus) {
      toggle.focus({preventScroll:true});
      if (window.scrollY !== pageScroll) window.scrollTo({top:pageScroll,behavior:'instant'});
    }
  }

  toggle.addEventListener('click', () => setMenu(menu.hidden, !menu.hidden));
  header.addEventListener('click', event => {
    if (!menu.hidden && event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      setMenu(false, true);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...header.querySelectorAll('a, button')]
      .filter(element => element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) setMenu(false);
  });
})();

(function(){var f=document.getElementById('wa-form');if(f){f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f);var hz=d.getAll('hizmet').join(', ');var parts=['Merhaba, Güngör Digital ile keşif görüşmesi talep ediyorum.'];
if(d.get('ad'))parts.push('Ad Soyad: '+d.get('ad'));if(d.get('telefon'))parts.push('Telefon: '+d.get('telefon'));if(d.get('sirket'))parts.push('Şirket: '+d.get('sirket'));if(d.get('eposta'))parts.push('E-posta: '+d.get('eposta'));if(hz)parts.push('İlgilenilen hizmetler: '+hz);if(d.get('zaman'))parts.push('Zamanlama: '+d.get('zaman'));if(d.get('ozet'))parts.push('Proje özeti: '+d.get('ozet'));
window.open('https://wa.me/905444518759?text='+encodeURIComponent(parts.join('\n')),'_blank','noopener');});}})();
/* Çerez tercihi ve Google Tag Manager */
(function () {
  const consentKey = 'gd_cookie_consent_gtm_v1';
  const template = document.getElementById('gd-gtm-source');
  const tagSource = template?.content.querySelector('script[src]')?.src
    || 'https://www.googletagmanager.com/gtm.js?id=GTM-NLWD7CCN';
  let preference = null;
  try {
    preference = localStorage.getItem(consentKey);
    if (!preference && localStorage.getItem('gd_cookie_consent') === 'rejected') preference = 'rejected';
  } catch {}

  window.dataLayer = window.dataLayer || [];
  const needsInitialization = typeof window.gtag !== 'function';
  if (needsInitialization) window.gtag = function () { window.dataLayer.push(arguments); };

  function signalConsent(command, value) {
    window.gtag('consent', command, {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value
    });
  }
  signalConsent('default', 'denied');
  if (needsInitialization) window.gtag('js', new Date());
  window.gdConsent = () => preference === 'accepted';

  let tagLoaded = false;
  function loadTagManager() {
    if (tagLoaded || !window.gdConsent()) return;
    signalConsent('update', 'granted');
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = tagSource;
    tagLoaded = true;
    document.head.appendChild(script);
  }

  function showPreferences() {
    if (document.getElementById('cc-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.className = 'cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Çerez tercihleri');
    banner.innerHTML = '<p><strong>Çerez tercihiniz</strong>Onay verirseniz analiz ve reklam etiketlerini yönetmek için Google Tag Manager yüklenir. Ayrıntılar için <a href="/cerez-politikasi.html">Çerez Politikası</a>.</p><div class="cc-btns"><button type="button" class="btn btn-outline btn-sm" data-cc="rejected">Reddet</button><button type="button" class="btn btn-outline btn-sm" data-cc="accepted">Kabul et</button></div>';
    banner.addEventListener('click', event => {
      const value = event.target.closest('button[data-cc]')?.dataset.cc;
      if (!value) return;
      preference = value;
      try {
        localStorage.setItem(consentKey, value);
      } catch {}
      banner.remove();
      document.body.classList.remove('has-cc');
      if (window.gdConsent()) {
        loadTagManager();
      } else if (tagLoaded) {
        signalConsent('update', 'denied');
        window.location.reload();
      }
    });
    document.body.appendChild(banner);
    document.body.classList.add('has-cc');
  }

  if (window.gdConsent()) loadTagManager();
  if (!preference) showPreferences();
  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      showPreferences();
    });
  });
})();
