(function () {
  var STORAGE_KEY = 'hwf_cookie_consent';
  var GA_ID = 'G-P6SJPMXTRV';
  var CONSENT_ACCEPTED = 'accepted';
  var CONSENT_DECLINED = 'declined';

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* localStorage unavailable */
    }
  }

  function loadGoogleAnalytics() {
    if (window.__hwfGaLoaded) {
      return;
    }
    window.__hwfGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  function setBannerVisible(visible) {
    document.body.classList.toggle('hwf-cookie-banner-visible', visible);
  }

  function hideBanner(banner) {
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
    if (!document.querySelector('.hwf-cookie-banner')) {
      setBannerVisible(false);
    }
  }

  function focusAcceptButton(banner) {
    var acceptButton = banner.querySelector('.hwf-cookie-banner__btn--accept');
    if (acceptButton) {
      acceptButton.focus();
    }
  }

  function createBanner() {
    var banner = document.createElement('div');
    banner.className = 'hwf-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML =
      '<div class="hwf-cookie-banner__inner">' +
        '<p class="hwf-cookie-banner__text">' +
          'Wir setzen Google Analytics nur nach Ihrer Einwilligung ein, um die Nutzung dieser Website statistisch auszuwerten. ' +
          '<a href="datenschutz.html" class="hwf-cookie-banner__link">Datenschutzerklärung</a>' +
        '</p>' +
        '<div class="hwf-cookie-banner__actions">' +
          '<button type="button" class="hwf-cookie-banner__btn hwf-cookie-banner__btn--decline">Ablehnen</button>' +
          '<button type="button" class="hwf-cookie-banner__btn hwf-cookie-banner__btn--accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    banner.querySelector('.hwf-cookie-banner__btn--accept').addEventListener('click', function () {
      setConsent(CONSENT_ACCEPTED);
      loadGoogleAnalytics();
      hideBanner(banner);
    });

    banner.querySelector('.hwf-cookie-banner__btn--decline').addEventListener('click', function () {
      setConsent(CONSENT_DECLINED);
      hideBanner(banner);
    });

    return banner;
  }

  function showBanner() {
    var existing = document.querySelector('.hwf-cookie-banner');
    if (existing) {
      hideBanner(existing);
    }

    var banner = createBanner();
    document.body.appendChild(banner);
    setBannerVisible(true);
    focusAcceptButton(banner);
  }

  function resetConsent() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* localStorage unavailable */
    }
    showBanner();
  }

  function init() {
    var consent = getConsent();

    if (consent === CONSENT_ACCEPTED) {
      loadGoogleAnalytics();
      return;
    }

    if (consent === CONSENT_DECLINED) {
      return;
    }

    showBanner();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-hwf-cookie-settings]');
    if (!trigger) {
      return;
    }
    event.preventDefault();
    resetConsent();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
