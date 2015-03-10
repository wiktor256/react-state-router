var safeAccess = require('safe-access');
var urllite = require('urllite/lib/core');
var Base64 = require('./utils/Base64');


var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

var hasPushState = (
  canUseDOM &&
  window.history &&
  'pushState' in window.history
);

var useHistory = hasPushState;
var currentState = {};
var rootComponent;

var onPopState = function(event) {
  var url = urllite(window.location.href);
  var hash = url.hash || '';

  if (event && event.state) {
    currentState = event.state;
  }
  else {
    var b64Str = decodeURIComponent(hash.slice(2));
    var jsonStr = Base64.toUTF8(b64Str);
    currentState = (jsonStr ? JSON.parse(jsonStr) : {});
  }

  setTimeout(function() {
    rootComponent.forceUpdate();
  }, 0);

};

var updateHash = function() {
  var jsonStr = JSON.stringify(currentState);
  var b64Str = Base64.fromUTF8(jsonStr);

  if (useHistory) {
      window.history.pushState(currentState, '', '#!' + b64Str);
  } else {
      window.location.hash = '!' + b64Str;
  }
};

var StateRouter = {

  getState: function(routerContext) {
    return safeAccess(currentState, routerContext || '') || {};
  },

  setState: function(state, routerContext) {

    if (!routerContext) {
      currentState = state || {};
    }
    else {
      var parts = (routerContext || '').split('.');
      var contextPart = parts[parts.length - 1];
      var contextState = currentState;

      for (var i = 0; i < parts.length - 1; i++) {
        if (typeof contextState[parts[i]] === 'undefined') {
          contextState[parts[i]] = {};
        }
        contextState = contextState[parts[i]];
      }

      contextState[contextPart] = state || {};
    }

    updateHash();

    setTimeout(function() {
      rootComponent.forceUpdate();
    }, 0);
  },

  init: function(options) {
    rootComponent = options.rootComponent;

    if (useHistory) {
      window.addEventListener('popstate', onPopState, false);
    } else {
      if (window.location.hash.indexOf('#!') === -1) {
        window.location.hash = '#!';
      }

      window.addEventListener('hashchange', onPopState, false);
    }

    onPopState();
  }

};

module.exports = StateRouter;