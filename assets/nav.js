/* Mobile menu + back-to-top. Without JS the page still works (menu and button stay hidden). */
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.hidden = false;
    var links = menu.querySelectorAll('a');
    var open = function () {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('span').textContent = 'Close';
      if (links[0]) links[0].focus();
    };
    var close = function (returnFocus) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('span').textContent = 'Menu';
      if (returnFocus) btn.focus();
    };
    btn.addEventListener('click', function () {
      if (menu.hidden) open(); else close(true);
    });
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener('click', function () { close(false); });
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && !menu.hidden) close(true);
    });
    // Close if focus leaves the header (e.g. Tab past the last link)
    document.addEventListener('focusin', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close(false);
    });
    // Close when switching to the desktop layout
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && !menu.hidden) close(false);
    });
  }

  var top = document.querySelector('.to-top');
  if (top) {
    var ticking = false;
    var update = function () {
      top.hidden = window.scrollY < 600;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
