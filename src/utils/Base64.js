
var Base64 = {
  fromUTF8: function(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  },

  toUTF8: function(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }
};

module.exports = Base64;
