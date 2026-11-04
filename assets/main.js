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
window.open('https://wa.me/905444518759?text='+encodeURIComponent(parts.join('\n')),'_blank','noopener');});}})();/* Çerez onayı */
(function(){var K='gd_cookie_consent';
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}}
window.gdConsent=function(){return get()==='accepted'};
function hide(b){if(b&&b.parentNode)b.parentNode.removeChild(b);document.body.classList.remove('has-cc')}
function show(){if(document.getElementById('cc-banner'))return;var b=document.createElement('div');b.id='cc-banner';b.className='cc';b.setAttribute('role','dialog');b.setAttribute('aria-live','polite');b.setAttribute('aria-label','Çerez tercihleri');
b.innerHTML='<p><strong>Çerez tercihiniz</strong>Bu sitede şu an analiz veya reklam çerezi kullanılmıyor. İleride eklenirse yalnızca onay verirseniz çalışır. Ayrıntılar için <a href="/cerez-politikasi.html">Çerez Politikası</a>.</p><div class="cc-btns"><button type="button" class="btn btn-outline btn-sm" data-cc="rejected">Reddet</button><button type="button" class="btn btn-outline btn-sm" data-cc="accepted">Kabul et</button></div>';
b.addEventListener('click',function(e){var v=e.target.getAttribute&&e.target.getAttribute('data-cc');if(v){set(v);hide(b)}});
document.body.appendChild(b);document.body.classList.add('has-cc')}
function init(){if(!get())show();document.querySelectorAll('[data-cookie-settings]').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();show()})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();
