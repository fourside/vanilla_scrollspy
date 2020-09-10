"use strict";

(function() {
  document.addEventListener("DOMContentLoaded", init);
})();


function init() {
  const menuElementCache = new Map();
  const openMenuOptions = {
    root: null,
    rootMargin: "16px",
    threshold: 0, 
  };
  const menuOpenObserver = observerFactory(openMenuOptions, menuElementCache, openMenu);
  ["#western", "#eastern"].forEach((id) => {
    const menuAnchor = document.querySelector(`a[href='${id}']`);
    menuElementCache.set(id.replace("#", ""), menuAnchor.parentElement.nextSibling.nextSibling);
    const target = document.querySelector(id);
    menuOpenObserver.observe(target);
  });

  const activeMenuOptions = {
    root: null,
    rootMargin: "16px",
    threshold: 0.5, 
  };
  const activateMenuObserver = observerFactory(activeMenuOptions, menuElementCache, activateMenu);
  document.querySelectorAll("section section").forEach((target) => {
    const id = target.getAttribute("id");
    const menuAnchor = document.querySelector(`a[href='#${id}']`);
    menuElementCache.set(id, menuAnchor.parentElement);
    activateMenuObserver.observe(target);
  });
}

/**
 * @param {Element} intersectingElement
 * @param {Map<string, Element>} cache 
 */
function openMenu(intersectingElement, cache) {
  Array.from(cache.values()).forEach(element => element.classList.remove("open"));
  const id = intersectingElement.getAttribute("id");
  const target = cache.get(id);
  target.classList.add("open");
}

/**
 * @param {Element} intersectingElement
 * @param {Map<string, Element>} cache 
 */
function activateMenu(intersectingElement, cache) {
  Array.from(cache.values()).forEach(element => element.classList.remove("active"));
  const id = intersectingElement.getAttribute("id");
  const target = cache.get(id);
  target.classList.add("active");
}

/**
 * 
 * @param {Object} options 
 * @param {Map<string, Element} cache 
 * @param {Function} callback 
 */
function observerFactory(options, cache, callback) {
  return new IntersectionObserver((entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, cache);
      }
    })
  }), options);
}
