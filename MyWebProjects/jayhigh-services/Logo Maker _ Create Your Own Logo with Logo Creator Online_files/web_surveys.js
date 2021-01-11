var _sTrackingAlreadyPresent = (typeof window._svd !== 'undefined' && typeof window._svc !== 'undefined');var _svc = window._svc || {};var _svd = window._svd || {};_svc.workspaceKey = _svc.workspaceKey || 'c943b378118aec6e802f4fa2b14e1e5c';_svd.surveys = _svd.surveys || [];_svd.audiences = _svd.audiences || [];_svd.themes = _svd.themes || [];_svd.integrations = _svd.integrations || [{"provider":"google_analytics","tracker":false,"enabled":true}];_svd.installing = _svd.installing || false;// Generated at: 2020\u002D09\u002D28\u002007\u003A02\u003A34
(function () {
  if (_sTrackingAlreadyPresent) {
    return;
  }
  var isIE = window.navigator.userAgent.indexOf('MSIE') !== -1 || window.navigator.userAgent.match(/Trident.*rv\:11\./);
  var isSafari = window.navigator.vendor && window.navigator.vendor.indexOf('Apple') > -1 && window.navigator.userAgent && window.navigator.userAgent.indexOf('CriOS') == -1 && window.navigator.userAgent.indexOf('FxiOS') == -1;
  var isOldSafari = isSafari && window.navigator.userAgent && window.navigator.userAgent.match(/Version.([0-9]+)\./).length == 2 && parseInt(window.navigator.userAgent.match(/Version.([0-9]+)\./)[1]) < 11;
  var isOldEdge = window.navigator.userAgent.match(/Edge\/(15\.15|18\.18)/);

  var coreUrls = [''];
  if (isIE || isOldSafari || isOldEdge) {
    coreUrls = coreUrls.map(function (url) {
      if (url.indexOf('preview') !== -1) {
        return url.replace(/preview-/, 'preview_babel-');
      }
      return url.replace(/core-/, 'core_babel-');
    })
  }
  if ("function" == typeof require && "function" == typeof define && define.amd) {
    // if loaded, load modules with the explicit require(), which loads the UMD modules correctly
    if (coreUrls.length && coreUrls[0] !== "") {
      require(coreUrls);
    }
  } else {
    //if no requireJS, load the survicate modules with <script>, and the UMD module will be loaded to browser globals.
    for (var i = 0; i < coreUrls.length; i++) {
      var s = document.createElement('script');
      s.setAttribute('crossorigin', 'anonymous');
      s.src = coreUrls[i];
      s.async = true;
      var e = document.getElementsByTagName('script')[0];
      e.parentNode.insertBefore(s, e);
    }
  }
})();
