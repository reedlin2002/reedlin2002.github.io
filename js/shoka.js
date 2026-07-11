/*
 * Project Shoka-Cactus
 * 互動特效腳本：Parallax Hero, Sticky Navbar
 */

window.initShokaJS = function() {
    const header = document.getElementById('header');
    const herobg = document.getElementById('hero-carousel') || document.getElementById('hero-bg');
    const heroContent = document.getElementById('hero-content');
    const heroIssueNum = document.getElementById('hero-issue-num');

    // 避免重複綁定 scroll 事件
    if (window._shokaScrollListener) {
        window.removeEventListener('scroll', window._shokaScrollListener);
    }

    window._shokaScrollListener = () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Hero Parallax — magazine-style multi-layer depth
        if (herobg && heroContent) {
            let scroll = window.scrollY;
            if (scroll < 1200) {
                herobg.style.transform = `translateY(${scroll * 0.5}px)`;
                heroContent.style.opacity = 1 - scroll / 600;
                heroContent.style.transform = `translateY(${scroll * 0.4}px)`;
                // Issue number moves slower = deeper parallax layer
                if (heroIssueNum) {
                    heroIssueNum.style.transform = `translateY(${scroll * 0.2}px)`;
                }
            }
        }
    };

    window.addEventListener('scroll', window._shokaScrollListener, { passive: true });
    window._shokaScrollListener(); // 執行一次初始狀態

    // Smooth Scroll for "Scroll Down" button
    // 避免重複綁定 click 事件
    const scrollBtn = document.getElementById('scroll-down');
    if (scrollBtn && !scrollBtn.hasAttribute('data-has-click')) {
        scrollBtn.setAttribute('data-has-click', 'true');
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initShokaJS();
});
