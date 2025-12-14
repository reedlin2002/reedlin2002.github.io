/*
 * Project Shoka-Cactus
 * 互動特效腳本：Parallax Hero, Sticky Navbar
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const herobg = document.getElementById('hero-bg');
    const heroContent = document.getElementById('hero-content');

    // Sticky Navbar Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hero Parallax
        if (herobg && heroContent) {
            let scroll = window.scrollY;
            if (scroll < 1000) { // Optimize: stop calc if far down
                herobg.style.transform = `translateY(${scroll * 0.5}px)`;
                heroContent.style.opacity = 1 - scroll / 700;
                heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
            }
        }
    });

    // Smooth Scroll for "Scroll Down" button
    const scrollBtn = document.getElementById('scroll-down');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});
