/**
 * 光標跟隨效果系統
 * Cursor Follow Effects
 * 包含：光暈跟隨、點擊漣漪、粒子軌跡
 */

class CursorEffects {
    constructor(options = {}) {
        this.config = {
            glowSize: options.glowSize || 200,
            glowOpacity: options.glowOpacity || 0.3,
            glowColor: options.glowColor || '#06b6d4',
            rippleCount: options.rippleCount || 3,
            particleCount: options.particleCount || 5,
            trailLength: options.trailLength || 15
        };

        this.mouse = { x: 0, y: 0 };
        this.ripples = [];
        this.trailParticles = [];
        this.glow = null;

        this.init();
    }

    init() {
        this.createGlow();
        this.bindEvents();
    }

    createGlow() {
        // 創建光暈元素
        this.glow = document.createElement('div');
        this.glow.className = 'cursor-glow';
        this.glow.style.cssText = `
      position: fixed;
      width: ${this.config.glowSize}px;
      height: ${this.config.glowSize}px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      opacity: ${this.config.glowOpacity};
      background: radial-gradient(circle, ${this.config.glowColor} 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
        document.body.appendChild(this.glow);
    }

    bindEvents() {
        let lastX = 0, lastY = 0;
        let frameId = null;

        // 滑鼠移動
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // 使用 RAF 優化性能
            if (!frameId) {
                frameId = requestAnimationFrame(() => {
                    this.updateGlow();

                    // 創建粒子軌跡
                    if (Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5) {
                        this.createTrailParticle(e.clientX, e.clientY);
                        lastX = e.clientX;
                        lastY = e.clientY;
                    }

                    frameId = null;
                });
            }
        });

        // 點擊漣漪
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });

        // 離開視窗
        document.addEventListener('mouseleave', () => {
            if (this.glow) {
                this.glow.style.opacity = '0';
            }
        });

        document.addEventListener('mouseenter', () => {
            if (this.glow) {
                this.glow.style.opacity = this.config.glowOpacity;
            }
        });
    }

    updateGlow() {
        if (this.glow) {
            this.glow.style.left = `${this.mouse.x}px`;
            this.glow.style.top = `${this.mouse.y}px`;
        }
    }

    createRipple(x, y) {
        for (let i = 0; i < this.config.rippleCount; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.className = 'cursor-ripple';
                ripple.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          border: 2px solid ${this.config.glowColor};
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          animation: rippleExpand 0.8s ease-out forwards;
        `;

                document.body.appendChild(ripple);

                // 動畫結束後移除
                setTimeout(() => ripple.remove(), 800);
            }, i * 100);
        }
    }

    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        const size = 4 + Math.random() * 4;

        particle.className = 'cursor-trail-particle';
        particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${this.config.glowColor};
      pointer-events: none;
      z-index: 9997;
      transform: translate(-50%, -50%);
      animation: particleFade 0.6s ease-out forwards;
      box-shadow: 0 0 10px ${this.config.glowColor};
    `;

        document.body.appendChild(particle);

        // 動畫結束後移除
        setTimeout(() => particle.remove(), 600);
    }

    updateColor(color) {
        this.config.glowColor = color;
        if (this.glow) {
            this.glow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        }
    }

    destroy() {
        if (this.glow) {
            this.glow.remove();
        }
    }
}

// 注入 CSS 動畫
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes rippleExpand {
      0% {
        width: 0;
        height: 0;
        opacity: 1;
      }
      100% {
        width: 100px;
        height: 100px;
        opacity: 0;
      }
    }
    
    @keyframes particleFade {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
    }
  `;
    document.head.appendChild(style);

    // 自動初始化
    window.CursorEffects = CursorEffects;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.cursorEffects = new CursorEffects();
        });
    } else {
        window.cursorEffects = new CursorEffects();
    }
}
