window.base64Loader = (function(window) {
  'use strict';
  let func = function(content) {
    this.cacheable && this.cacheable();
    return 'module.exports = "' + content.toString('base64') + '"';
  };
  func.raw = true;
  return func;
})(window);
