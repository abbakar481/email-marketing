// ============================================
// MAILFORGE - Application JavaScript
// ============================================

// --- Preloader ---
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        initAOS();
        animateCounters();
    }, 800);
});

// --- Particles Background ---
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.r = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor(w * h / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// --- Navbar Scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile Nav Toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Simple AOS (Animate on Scroll) ---
function initAOS() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const duration = 2000;
                const start = performance.now();
                const isDecimal = target % 1 !== 0;

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = target * eased;
                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// --- Workflow Builder ---
const workflows = {
    welcome: [
        { type: 'trigger', icon: '📥', iconClass: 'green', label: 'New Subscriber', sub: 'Signup form submitted' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 1 minute', sub: 'Immediate warmup' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Send Welcome Email', sub: 'Personalized greeting' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 2 days', sub: 'Engagement window' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Opened Email?', sub: 'Check engagement' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Send Value Email', sub: 'Tips & resources' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 3 days', sub: '' },
        { type: 'action', icon: '🎁', iconClass: 'teal', label: 'Send Offer Email', sub: '15% first purchase' },
    ],
    abandon: [
        { type: 'trigger', icon: '🛒', iconClass: 'green', label: 'Cart Abandoned', sub: 'Item left in cart' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 1 hour', sub: 'Cooling period' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Reminder Email', sub: 'Show cart items' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Purchased?', sub: 'Check conversion' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 24 hours', sub: '' },
        { type: 'action', icon: '💰', iconClass: 'teal', label: 'Discount Email', sub: '10% off cart' },
    ],
    winback: [
        { type: 'trigger', icon: '😴', iconClass: 'green', label: '90 Days Inactive', sub: 'No opens or clicks' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'We Miss You Email', sub: 'Personal touch' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 5 days', sub: '' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Re-engaged?', sub: 'Track activity' },
        { type: 'action', icon: '🎁', iconClass: 'teal', label: 'Exclusive Offer', sub: '25% comeback deal' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 7 days', sub: '' },
        { type: 'action', icon: '👋', iconClass: 'blue', label: 'Final Goodbye', sub: 'Sunset or re-engage' },
    ],
    birthday: [
        { type: 'trigger', icon: '🎂', iconClass: 'green', label: 'Birthday Match', sub: '7 days before' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Birthday Preview', sub: 'Teaser of gift' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait until Birthday', sub: '' },
        { type: 'action', icon: '🎁', iconClass: 'teal', label: 'Birthday Gift Email', sub: 'Special discount code' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 3 days', sub: '' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Used Gift?', sub: 'Track redemption' },
    ],
    upsell: [
        { type: 'trigger', icon: '✅', iconClass: 'green', label: 'Purchase Complete', sub: 'Order confirmed' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 2 hours', sub: '' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Thank You Email', sub: 'Order details + tips' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 5 days', sub: 'Usage window' },
        { type: 'action', icon: '📈', iconClass: 'teal', label: 'Cross-Sell Email', sub: 'AI recommendations' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Clicked Product?', sub: '' },
        { type: 'action', icon: '💎', iconClass: 'blue', label: 'VIP Offer', sub: 'Loyalty reward' },
    ],
    leadscoring: [
        { type: 'trigger', icon: '📥', iconClass: 'green', label: 'Lead Captured', sub: 'Form or landing page' },
        { type: 'action', icon: '🎯', iconClass: 'blue', label: 'Score Lead', sub: 'Behavioral + firmographic' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Score > 50?', sub: 'Hot lead threshold' },
        { type: 'action', icon: '📧', iconClass: 'teal', label: 'Nurture Sequence', sub: 'Educational content' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait for Score Change', sub: '' },
        { type: 'action', icon: '🔔', iconClass: 'blue', label: 'Notify Sales Team', sub: 'Slack + CRM update' },
    ],
};

function renderWorkflow(name) {
    const canvas = document.getElementById('workflowCanvas');
    if (!canvas) return;
    const flow = workflows[name] || workflows.welcome;
    canvas.innerHTML = '';

    flow.forEach((node, i) => {
        const el = document.createElement('div');
        el.className = `wf-node ${node.type}`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.innerHTML = `
            <div class="wf-icon ${node.iconClass}">${node.icon}</div>
            <div>
                <span class="wf-label">${node.label}</span>
                ${node.sub ? `<span class="wf-sublabel">${node.sub}</span>` : ''}
            </div>
        `;
        canvas.appendChild(el);

        setTimeout(() => {
            el.style.transition = 'all 0.4s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 80);

        if (i < flow.length - 1) {
            const conn = document.createElement('div');
            conn.className = 'wf-connector';
            canvas.appendChild(conn);
        }
    });
}

// Workflow item clicks
document.querySelectorAll('.workflow-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.workflow-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        renderWorkflow(item.dataset.workflow);
    });
});

// Initial render
renderWorkflow('welcome');

// --- Template Gallery ---
const templates = {
    ecommerce: [
        { name: 'Summer Sale', type: 'Promotional', colors: ['#667eea', '#764ba2'] },
        { name: 'New Arrivals', type: 'Product Launch', colors: ['#f093fb', '#f5576c'] },
        { name: 'Flash Deal', type: 'Urgency', colors: ['#4facfe', '#00f2fe'] },
        { name: 'Loyalty Reward', type: 'Retention', colors: ['#43e97b', '#38f9d7'] },
    ],
    saas: [
        { name: 'Product Update', type: 'Changelog', colors: ['#6366F1', '#8B5CF6'] },
        { name: 'Trial Ending', type: 'Conversion', colors: ['#F59E0B', '#EF4444'] },
        { name: 'Feature Highlight', type: 'Engagement', colors: ['#06B6D4', '#0EA5E9'] },
        { name: 'Onboarding', type: 'Activation', colors: ['#10B981', '#34D399'] },
    ],
    newsletter: [
        { name: 'Weekly Digest', type: 'Curated', colors: ['#8B5CF6', '#EC4899'] },
        { name: 'Industry Insights', type: 'Educational', colors: ['#3B82F6', '#6366F1'] },
        { name: 'Personal Update', type: 'Creator', colors: ['#F97316', '#F59E0B'] },
        { name: 'Community Roundup', type: 'Social', colors: ['#14B8A6', '#06B6D4'] },
    ],
    transactional: [
        { name: 'Order Confirmation', type: 'Receipt', colors: ['#10B981', '#059669'] },
        { name: 'Shipping Update', type: 'Tracking', colors: ['#3B82F6', '#2563EB'] },
        { name: 'Password Reset', type: 'Security', colors: ['#EF4444', '#DC2626'] },
        { name: 'Invoice', type: 'Billing', colors: ['#6366F1', '#4F46E5'] },
    ],
    events: [
        { name: 'Webinar Invite', type: 'Registration', colors: ['#8B5CF6', '#7C3AED'] },
        { name: 'Event Reminder', type: 'Follow-up', colors: ['#F59E0B', '#D97706'] },
        { name: 'Post-Event', type: 'Thank You', colors: ['#EC4899', '#DB2777'] },
        { name: 'Conference', type: 'Multi-day', colors: ['#06B6D4', '#0891B2'] },
    ],
};

function renderTemplates(category) {
    const grid = document.getElementById('templateGrid');
    if (!grid) return;
    const items = templates[category] || templates.ecommerce;
    grid.innerHTML = '';

    items.forEach((t, i) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.innerHTML = `
            <div class="template-thumb">
                <div class="template-thumb-inner" style="background: linear-gradient(135deg, ${t.colors[0]}15, ${t.colors[1]}15)">
                    <div class="tt-header" style="background: ${t.colors[0]}30; width: 50%"></div>
                    <div class="tt-hero" style="background: linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]}); opacity: 0.6"></div>
                    <div class="tt-body">
                        <div class="tt-line" style="background: ${t.colors[0]}20; width: 80%"></div>
                        <div class="tt-line" style="background: ${t.colors[0]}15; width: 100%"></div>
                        <div class="tt-line" style="background: ${t.colors[0]}15; width: 60%"></div>
                        <div class="tt-cta" style="background: ${t.colors[0]}; opacity: 0.5"></div>
                    </div>
                </div>
            </div>
            <div class="template-info">
                <h4>${t.name}</h4>
                <span>${t.type}</span>
            </div>
        `;
        grid.appendChild(card);

        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });
}

// Tab clicks
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTemplates(btn.dataset.tab);
    });
});

renderTemplates('ecommerce');

// --- Heatmap ---
(function generateHeatmap() {
    const grid = document.querySelector('.heatmap-grid');
    if (!grid) return;
    const hours = 6;
    for (let h = 0; h < hours; h++) {
        for (let d = 0; d < 7; d++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            const intensity = Math.random();
            const alpha = 0.1 + intensity * 0.8;
            cell.style.background = intensity > 0.7
                ? `rgba(99, 102, 241, ${alpha})`
                : intensity > 0.4
                    ? `rgba(139, 92, 246, ${alpha * 0.6})`
                    : `rgba(255, 255, 255, ${alpha * 0.1})`;
            grid.appendChild(cell);
        }
    }
})();

// --- Pricing Toggle ---
const pricingToggle = document.getElementById('pricingToggle');
pricingToggle?.addEventListener('change', () => {
    const isAnnual = pricingToggle.checked;
    document.querySelectorAll('.price-amount.monthly').forEach(el => {
        el.style.display = isAnnual ? 'none' : 'inline';
    });
    document.querySelectorAll('.price-amount.annual').forEach(el => {
        el.style.display = isAnnual ? 'inline' : 'none';
    });
    document.querySelectorAll('.toggle-label').forEach((label, i) => {
        label.classList.toggle('active', i === (isAnnual ? 1 : 0));
    });
});

// --- Modals ---
function openModal(id) {
    document.getElementById(id)?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
            m.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// --- Form Handlers ---
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function handleSignup(e) {
    e.preventDefault();
    closeModal('signupModal');
    showToast('🎉 Account created! Check your email to get started.');
}

function handleLogin(e) {
    e.preventDefault();
    closeModal('loginModal');
    showToast('Welcome back! Redirecting to dashboard...');
}

function handleDemo(e) {
    e.preventDefault();
    closeModal('demoModal');
    showToast('📅 Demo booked! We\'ll send a calendar invite shortly.');
}

// --- Active Nav Link ---
const sections = document.querySelectorAll('.section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// Make functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handleDemo = handleDemo;
