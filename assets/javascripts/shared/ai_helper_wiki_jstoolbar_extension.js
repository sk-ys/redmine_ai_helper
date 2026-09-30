document.addEventListener("DOMContentLoaded", function () {
  // Run after jstoolbar.js has been loaded.
  if (typeof window.jsToolBar === "undefined") {
    return;
  }

  const JSToolBar = window.jsToolBar;

  /**
   * Sets z-index for the given element when it exists.
   * @param {Element | null | undefined} element Target element.
   * @returns {void}
   */
  function setZIndexIfExists(element) {
    if (element) {
      element.style.zIndex = "11";
    }
  }

  /**
   * Raises z-index for the latest jQuery UI menu appended to body.
   * @returns {void}
   */
  function setLatestUiMenuZIndex() {
    const menus = document.querySelectorAll("body > .ui-menu");
    setZIndexIfExists(menus[menus.length - 1]);
  }

  /**
   * Wraps a JSToolbar menu method and runs a callback after menu creation.
   * @param {string} methodName Method name to patch.
   * @param {() => void} afterMenuCreated Callback invoked after menu creation.
   * @returns {void}
   */
  function patchToolbarMenu(methodName, afterMenuCreated) {
    const originalMethod = JSToolBar.prototype[methodName];
    if (typeof originalMethod !== "function") {
      return;
    }

    JSToolBar.prototype[methodName] = function (fn) {
      const result = originalMethod.call(this, fn);
      afterMenuCreated();
      return result;
    };
  }

  // Patch for JSToolbar menu creation timing.
  // These menus are appended under body on demand, so we raise z-index immediately after each menu is created.
  patchToolbarMenu("precodeMenu", setLatestUiMenuZIndex);
  patchToolbarMenu("tableMenu", function () {
    setZIndexIfExists(document.querySelector("body > .table-generator"));
  });
});
