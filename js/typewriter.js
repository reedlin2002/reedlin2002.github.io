/**
 * 打字機效果
 * Typewriter Effect
 * 為標題添加逐字顯示動畫
 */

class TypewriterEffect {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.config = {
            speed: options.speed || 80,
            deleteSpeed: options.deleteSpeed || 50,
            delay: options.delay || 1000,
            loop: options.loop || false,
            cursor: options.cursor !== false,
            cursorChar: options.cursorChar || '|'
        };

        this.init();
    }

    init() {
        this.elements.forEach((element, index) => {
            // 保存原始文字
            const text = element.textContent;
            element.setAttribute('data-original-text', text);
            element.textContent = '';

            // 延遲啟動，避免同時開始
            setTimeout(() => {
                this.typeText(element, text);
            }, index * 200);
        });
    }

    typeText(element, text, charIndex = 0) {
        if (charIndex < text.length) {
            element.textContent = text.substring(0, charIndex + 1);

            // 添加光標
            if (this.config.cursor && charIndex < text.length - 1) {
                element.textContent += this.config.cursorChar;
            }

            setTimeout(() => {
                // 移除光標再繼續
                if (this.config.cursor && charIndex < text.length - 1) {
                    element.textContent = text.substring(0, charIndex + 1);
                }
                this.typeText(element, text, charIndex + 1);
            }, this.config.speed);
        } else {
            // 完成
            if (this.config.cursor) {
                this.blinkCursor(element);
            }
        }
    }

    blinkCursor(element) {
        const text = element.getAttribute('data-original-text');
        let showCursor = true;

        setInterval(() => {
            if (showCursor) {
                element.textContent = text + this.config.cursorChar;
            } else {
                element.textContent = text;
            }
            showCursor = !showCursor;
        }, 530);
    }
}

// 滾動進入視窗時觸發打字機效果
class TypewriterOnScroll {
    constructor(selector, options = {}) {
        this.selector = selector;
        this.options = options;
        this.observer = null;
        this.typedElements = new Set();

        this.init();
    }

    init() {
        // 使用 Intersection Observer
        this.observer = new Intersection Observer((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.typedElements.has(entry.target)) {
                    this.typedElements.add(entry.target);
                    this.startTyping(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        // 觀察所有目標元素
        document.querySelectorAll(this.selector).forEach(el => {
            const text = el.textContent;
            el.setAttribute('data-original-text', text);
            el.textContent = '';
            el.style.opacity = '1';
            this.observer.observe(el);
        });
    }

    startTyping(element) {
        const text = element.getAttribute('data-original-text');
        let charIndex = 0;

        const type = () => {
            if (charIndex < text.length) {
                element.textContent = text.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(type, this.options.speed || 50);
            }
        };

        type();
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// 注入 CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    [data-typewriter] {
      display: inline-block;
      min-height: 1.2em;
    }
    
    [data-original-text] {
      font-family: inherit;
    }
  `;
    document.head.appendChild(style);

    // 導出到全局
    window.TypewriterEffect = TypewriterEffect;
    window.TypewriterOnScroll = TypewriterOnScroll;

    // 自動為特定元素啟用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTypewriter);
    } else {
        initTypewriter();
    }
}

function initTypewriter() {
    // 為網站標題和主標題添加打字機效果
    setTimeout(() => {
        // 網站標題
        const siteTitle = document.querySelector('#header h1');
        if (siteTitle && !siteTitle.hasAttribute('data-typewriter-init')) {
            siteTitle.setAttribute('data-typewriter-init', 'true');
            new TypewriterEffect('#header h1', { speed: 100, cursor: false });
        }

        // 文章標題（滾動觸發）
        const articleTitles = document.querySelectorAll('.post-item h2:first-child, article h1.title');
        if (articleTitles.length > 0) {
            articleTitles.forEach(el => {
                if (!el.hasAttribute('data-typewriter-scroll')) {
                    el.setAttribute('data-typewriter-scroll', 'true');
                }
            });
            new TypewriterOnScroll('[data-typewriter-scroll]', { speed: 30 });
        }
    }, 500);
}
