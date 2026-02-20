const navMenuToggleHandle = function (event) {
  if (event) event.preventDefault();

  const nav = $('#nav');
  if (!nav) return;

  const opened = nav.hasClass('open');
  nav.toggleClass('open', !opened);
  menuToggle.toggleClass('close', !opened);

  if (!opened && sideBar && sideBar.hasClass('on')) {
    sideBarToggleHandle(null, 1);
  }
}

const navMenuCloseHandle = function () {
  const nav = $('#nav');
  if (!nav) return;
  nav.removeClass('open');
  menuToggle && menuToggle.removeClass('close');
}

window.addEventListener('DOMContentLoaded', function () {
  const nav = $('#nav');
  if (!nav) return;

  nav.addEventListener('click', function (event) {
    const target = event.target;
    if (target && target.closest && target.closest('a')) {
      navMenuCloseHandle();
    }
  });

  document.addEventListener('click', function (event) {
    if (!nav.hasClass('open')) return;
    const toggle = nav.child('.toggle');
    if (toggle && (toggle === event.target || toggle.contains(event.target))) return;
    if (nav.contains(event.target)) return;
    navMenuCloseHandle();
  });

  window.addEventListener('pjax:success', navMenuCloseHandle);
});
