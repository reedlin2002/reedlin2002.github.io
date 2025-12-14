/**
 * 粒子星空背景系統 (Lite Version)
 * Particle Starfield Background System
 * 優化版：移除滑鼠互動運算，僅保留視覺效果
 */

class ParticleStarfield {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with id "${canvasId}" not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.shootingStars = [];

        // 配置選項
        this.config = {
            particleCount: options.particleCount || 80,
            particleSize: { min: 0.5, max: 2 },
            particleSpeed: { min: 0.05, max: 0.15 },
            particleOpacity: { min: 0.1, max: 0.6 },
            shootingStarFrequency: options.shootingStarFrequency || 0.0005,
            colors: options.colors || ['#06b6d4', '#22d3ee', '#67e8f9', '#ffffff'],
            twinkleSpeed: 0.01
        };

        this.animationId = null;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(x, y) {
        const { particleSize, particleSpeed, particleOpacity, colors } = this.config;

        return {
            x: x !== undefined ? x : Math.random() * this.canvas.width,
            y: y !== undefined ? y : Math.random() * this.canvas.height,
            vx: 0,
            vy: 0,
            baseSpeed: Math.random() * (particleSpeed.max - particleSpeed.min) + particleSpeed.min,
            size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
            opacity: Math.random() * (particleOpacity.max - particleOpacity.min) + particleOpacity.min,
            baseOpacity: Math.random() * (particleOpacity.max - particleOpacity.min) + particleOpacity.min,
            twinkle: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height * 0.5;
        const angle = Math.PI / 4 + Math.random() * Math.PI / 6;
        const speed = 8 + Math.random() * 4;

        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 60 + Math.random() * 40,
            opacity: 1,
            size: 1.5,
            tail: []
        };
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // 閃爍效果
            particle.twinkle += this.config.twinkleSpeed;
            particle.opacity = particle.baseOpacity + Math.sin(particle.twinkle) * 0.3;

            // 緩慢移動 (僅垂直)
            particle.y -= particle.baseSpeed;

            // 邊界檢查 - 循環回到底部
            if (particle.y < 0) {
                particle.y = this.canvas.height;
                particle.x = Math.random() * this.canvas.width;
            }
        });
    }

    updateShootingStars() {
        if (Math.random() < this.config.shootingStarFrequency) {
            this.shootingStars.push(this.createShootingStar());
        }

        this.shootingStars = this.shootingStars.filter(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.opacity -= 0.01;

            star.tail.unshift({ x: star.x, y: star.y });
            if (star.tail.length > 20) star.tail.pop();

            return star.opacity > 0 &&
                star.x < this.canvas.width + 100 &&
                star.y < this.canvas.height + 100;
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製粒子星星
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            // 移除陰影以提升效能
            // this.ctx.shadowBlur = particle.size * 3;
            // this.ctx.shadowColor = particle.color;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });

        // 繪製流星
        this.shootingStars.forEach(star => {
            this.ctx.save();

            if (star.tail.length > 1) {
                const gradient = this.ctx.createLinearGradient(
                    star.x, star.y,
                    star.tail[star.tail.length - 1].x,
                    star.tail[star.tail.length - 1].y
                );

                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = star.size * 2;
                this.ctx.lineCap = 'round';

                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y);
                star.tail.forEach(point => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.stroke();
            }

            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    animate() {
        this.updateParticles();
        this.updateShootingStars();
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resize);
    }

    updateColors(colors) {
        this.config.colors = colors;
        this.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
}

// 自動初始化邏輯保持不變
if (typeof window !== 'undefined') {
    window.ParticleStarfield = ParticleStarfield;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleSystem);
    } else {
        initParticleSystem();
    }
}

function initParticleSystem() {
    const checkCanvas = setInterval(() => {
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            clearInterval(checkCanvas);
            const theme = document.documentElement.getAttribute('data-theme') || 'stellar';
            const themeColors = {
                'stellar': ['#06b6d4', '#22d3ee', '#67e8f9', '#ffffff'],
                'cyberpunk-ultra': ['#f72585', '#4cc9f0', '#7209b7', '#ffffff'],
                'aurora-dreams': ['#10b981', '#8b5cf6', '#3b82f6', '#ffffff']
            };

            window.particleSystem = new ParticleStarfield('particle-canvas', {
                particleCount: 80, // Default to lower count
                shootingStarFrequency: 0.0005,
                colors: themeColors[theme] || themeColors['stellar']
            });
        }
    }, 100);
    setTimeout(() => clearInterval(checkCanvas), 5000);
}
