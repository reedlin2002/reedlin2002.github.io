/* 全站共用：使用者是否要求減少動效 */
window.prefersReducedMotion = function() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
};

window.initMainJS = function() {
  /**
   * Sets up Justified Gallery.
   */
  if (!!$.prototype.justifiedGallery) {
    var options = {
      rowHeight: 140,
      margins: 4,
      lastRow: "justify"
    };
    $(".article-gallery").justifiedGallery(options);
  }

  /**
   * Dark / Light theme toggle.
   */
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle && !themeToggle.hasAttribute('data-theme-bound')) {
    themeToggle.setAttribute('data-theme-bound', '1');
    themeToggle.addEventListener('click', function() {
      var html = document.documentElement;
      var current = html.dataset.theme || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';

      // 減少動效：直接切換，不做閃光過場
      if (window.prefersReducedMotion()) {
        html.dataset.theme = next;
        localStorage.setItem('theme', next);
        return;
      }

      // 品牌藍 flash overlay
      var overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9998', 'pointer-events:none',
        'background:rgba(59,130,246,0.14)', 'opacity:0',
        'transition:opacity 0.22s ease', 'mix-blend-mode:screen'
      ].join(';');
      document.body.appendChild(overlay);

      // Enable cross-fade transitions on all elements
      html.classList.add('theme-transitioning');

      requestAnimationFrame(function() {
        overlay.style.opacity = '1';
        setTimeout(function() {
          html.dataset.theme = next;
          localStorage.setItem('theme', next);
          overlay.style.opacity = '0';
          setTimeout(function() {
            overlay.remove();
            html.classList.remove('theme-transitioning');
          }, 500);
        }, 180);
      });
    });
  }

  /**
   * Shows the responsive navigation menu on mobile.
   */
  // 觸發連結是 href="#"，不擋預設行為會把網址變成 /# 並多一筆瀏覽紀錄
  $("#header > #nav > ul > .icon").off('click').on('click', function(event) {
    event.preventDefault();
    var list = $("#header > #nav > ul");
    list.toggleClass("responsive");
    $(this).children("a").attr("aria-expanded", list.hasClass("responsive") ? "true" : "false");
  });

  /**
   * Controls the different versions of the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {
    var menu = $("#menu");
    var nav = $("#menu > #nav");
    var menuIcon = $("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 1440) {
      menu.show();
      menuIcon.addClass("active");
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.off('click').on('click', function() {
      if (menu.is(":hidden")) {
        menu.show();
        menuIcon.addClass("active");
      } else {
        menu.hide();
        menuIcon.removeClass("active");
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).off("scroll.menu").on("scroll.menu", function() {
        var topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(":visible") && topDistance < 50) {
          nav.show();
        } else if (nav.is(":visible") && topDistance > 100) {
          nav.hide();
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top icon" instead
        if ( ! $("#menu-icon").is(":visible") && topDistance < 50 ) {
          $("#menu-icon-tablet").show();
          $("#top-icon-tablet").hide();
        } else if (! $("#menu-icon").is(":visible") && topDistance > 100) {
          $("#menu-icon-tablet").hide();
          $("#top-icon-tablet").show();
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($("#footer-post").length) {
      var lastScrollTop = 0;
      var footerPost = document.getElementById("footer-post");
      // 用 class 讓工具列滑入滑出；body.footer-post-on 讓右下的回頂部往上讓位
      var setFooterVisible = function(visible) {
        footerPost.classList.toggle("is-hidden", !visible);
        document.body.classList.toggle("footer-post-on", visible);
      };
      setFooterVisible(true);

      $(window).off("scroll.footer").on("scroll.footer", function() {
        var topDistance = $(window).scrollTop();

        // 往下捲收起、往上捲出現；iOS 回彈的負值不算
        if (topDistance > lastScrollTop && topDistance > 0) {
          setFooterVisible(false);
        } else if (topDistance < lastScrollTop) {
          setFooterVisible(true);
        }
        lastScrollTop = topDistance;

        // close all submenu's on scroll
        $("#nav-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
  }
};

$(document).ready(function() {
  window.initMainJS();
});
