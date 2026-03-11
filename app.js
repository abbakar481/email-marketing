// ============================================
// MAILFORGE - Application JavaScript v2.0
// Fixed: preloader, animations, interactivity,
// forms, drag-drop, live feed, FAQ, cookies
// ============================================

// --- Preloader (with fallback timeout) ---
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader')?.classList.add('loaded');
        initAnimations();
        animateCounters();
        animateBars();
        startLiveFeed();
    }, 600);
});
// Fallback: force hide preloader after 4s even if load fails
setTimeout(() => {
    document.getElementById('preloader')?.classList.add('loaded');
}, 4000);

// --- Particles ---
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [], w, h;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w; this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
            this.r = Math.random() * 2 + 0.5; this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(); }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(99,102,241,${this.alpha})`; ctx.fill(); }
    }

    const count = Math.min(60, Math.floor(w * h / 20000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// --- Navbar ---
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar?.classList.toggle('scrolled', scrolled);
    backToTop?.classList.toggle('visible', window.scrollY > 500);
});
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// --- Mobile Nav ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks?.classList.remove('open')));

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('href');
        if (href === '#') return window.scrollTo({ top: 0, behavior: 'smooth' });
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Scroll Animations ---
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function animateCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                if (isNaN(target)) return;
                const duration = 2000, start = performance.now();
                const isDecimal = target % 1 !== 0;
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = isDecimal ? (target * eased).toFixed(1) : Math.floor(target * eased);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(c => observer.observe(c));
}

// --- Animated Bars ---
function animateBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.bar').forEach((bar, i) => {
                    setTimeout(() => {
                        bar.style.height = bar.dataset.height + '%';
                    }, i * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const bars = document.getElementById('animatedBars');
    if (bars) observer.observe(bars);
}

// --- Mini Stats Count Up ---
(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.countUp);
                if (isNaN(target)) return;
                const duration = 2000, start = performance.now();
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased).toLocaleString();
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count-up]').forEach(el => observer.observe(el));
})();

// --- Live Feed ---
function startLiveFeed() {
    const feed = document.getElementById('liveFeed');
    if (!feed) return;
    const events = [
        { icon: '📧', text: 'sarah@luminary.co opened "Summer Sale"' },
        { icon: '🛒', text: 'marcus@threads.co clicked "Shop Now"' },
        { icon: '💰', text: '$47.99 purchase from welcome series' },
        { icon: '📥', text: 'New subscriber: alex@startup.io' },
        { icon: '✅', text: 'Campaign "Flash Deal" sent to 12.4K' },
        { icon: '🎯', text: 'A/B test winner: Variant B (+23%)' },
        { icon: '📈', text: 'Open rate trending up: 48.2%' },
        { icon: '💎', text: 'VIP segment grew by 156 today' },
        { icon: '🔔', text: 'Automation triggered: Cart recovery' },
        { icon: '⚡', text: 'AI optimized send time for 8.2K' },
    ];
    let idx = 0;
    function addEvent() {
        const item = document.createElement('div');
        item.className = 'feed-item';
        const ev = events[idx % events.length];
        item.innerHTML = `<span class="feed-icon">${ev.icon}</span> ${ev.text}`;
        feed.prepend(item);
        if (feed.children.length > 3) feed.removeChild(feed.lastChild);
        idx++;
    }
    addEvent();
    setInterval(addEvent, 3000);
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
    ],
    birthday: [
        { type: 'trigger', icon: '🎂', iconClass: 'green', label: 'Birthday Match', sub: '7 days before' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Birthday Preview', sub: 'Teaser of gift' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait until Birthday', sub: '' },
        { type: 'action', icon: '🎁', iconClass: 'teal', label: 'Birthday Gift Email', sub: 'Special discount code' },
    ],
    upsell: [
        { type: 'trigger', icon: '✅', iconClass: 'green', label: 'Purchase Complete', sub: 'Order confirmed' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 2 hours', sub: '' },
        { type: 'action', icon: '📧', iconClass: 'blue', label: 'Thank You Email', sub: 'Order details + tips' },
        { type: 'delay', icon: '⏳', iconClass: 'purple', label: 'Wait 5 days', sub: 'Usage window' },
        { type: 'action', icon: '📈', iconClass: 'teal', label: 'Cross-Sell Email', sub: 'AI recommendations' },
    ],
    leadscoring: [
        { type: 'trigger', icon: '📥', iconClass: 'green', label: 'Lead Captured', sub: 'Form or landing page' },
        { type: 'action', icon: '🎯', iconClass: 'blue', label: 'Score Lead', sub: 'Behavioral + firmographic' },
        { type: 'condition', icon: '🔀', iconClass: 'orange', label: 'Score > 50?', sub: 'Hot lead threshold' },
        { type: 'action', icon: '📧', iconClass: 'teal', label: 'Nurture Sequence', sub: 'Educational content' },
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
        el.style.opacity = '0'; el.style.transform = 'translateY(10px)';
        el.innerHTML = `<div class="wf-icon ${node.iconClass}">${node.icon}</div><div><span class="wf-label">${node.label}</span>${node.sub ? `<span class="wf-sublabel">${node.sub}</span>` : ''}</div>`;
        canvas.appendChild(el);
        setTimeout(() => { el.style.transition = 'all 0.4s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
        if (i < flow.length - 1) { const c = document.createElement('div'); c.className = 'wf-connector'; canvas.appendChild(c); }
    });
}

document.querySelectorAll('.workflow-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.workflow-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        renderWorkflow(item.dataset.workflow);
    });
});
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
        card.style.opacity = '0'; card.style.transform = 'translateY(10px)';
        card.innerHTML = `
            <div class="template-thumb">
                <div class="template-thumb-inner" style="background:linear-gradient(135deg,${t.colors[0]}15,${t.colors[1]}15)">
                    <div class="tt-header" style="background:${t.colors[0]}30;width:50%"></div>
                    <div class="tt-hero" style="background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]});opacity:0.6"></div>
                    <div class="tt-body">
                        <div class="tt-line" style="background:${t.colors[0]}20;width:80%"></div>
                        <div class="tt-line" style="background:${t.colors[0]}15;width:100%"></div>
                        <div class="tt-line" style="background:${t.colors[0]}15;width:60%"></div>
                        <div class="tt-cta" style="background:${t.colors[0]};opacity:0.5"></div>
                    </div>
                </div>
            </div>
            <div class="template-info"><h4>${t.name}</h4><span>${t.type}</span></div>`;
        card.addEventListener('click', () => showToast(`Template "${t.name}" selected! Customize it in the editor.`));
        grid.appendChild(card);
        setTimeout(() => { card.style.transition = 'all 0.4s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 100);
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTemplates(btn.dataset.tab);
    });
});
renderTemplates('ecommerce');

// --- Demo Tab Switching ---
document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// --- Drag and Drop ---
(function initDragDrop() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    const blockLabels = { text: '📝 Text Block', image: '🖼️ Image Block', button: '🔘 Button', columns: '📊 2-Column Layout', hero: '🎨 Hero Section', product: '📦 Product Card', timer: '⏱️ Countdown Timer', social: '📱 Social Icons', ai: '🤖 AI-Generated Content' };

    document.querySelectorAll('.demo-block').forEach(block => {
        block.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', block.dataset.block);
            block.style.opacity = '0.5';
        });
        block.addEventListener('dragend', () => { block.style.opacity = '1'; });
    });

    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const type = e.dataTransfer.getData('text/plain');
        const label = blockLabels[type] || type;
        const el = document.createElement('div');
        el.className = 'dropped-block';
        el.innerHTML = `${label} <span style="margin-left:auto;cursor:pointer;opacity:0.5" onclick="this.parentElement.remove()">✕</span>`;
        dropZone.querySelector('p')?.remove();
        dropZone.appendChild(el);
    });
})();

// --- Heatmap ---
(function() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    // Seeded data for consistency
    const data = [0.2,0.5,0.7,0.9,0.8,0.4,0.1, 0.3,0.6,0.8,0.95,0.85,0.5,0.15, 0.1,0.4,0.6,0.7,0.6,0.3,0.1, 0.15,0.3,0.5,0.65,0.55,0.25,0.05, 0.25,0.55,0.75,0.88,0.78,0.45,0.12, 0.1,0.35,0.55,0.7,0.6,0.3,0.08];
    data.forEach(v => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.background = v > 0.7 ? `rgba(99,102,241,${0.3 + v * 0.7})` : v > 0.4 ? `rgba(139,92,246,${0.15 + v * 0.4})` : `rgba(255,255,255,${v * 0.1})`;
        cell.title = `${Math.round(v * 100)}% engagement`;
        grid.appendChild(cell);
    });
})();

// --- Pricing Toggle ---
const pricingToggle = document.getElementById('pricingToggle');
pricingToggle?.addEventListener('change', () => {
    const isAnnual = pricingToggle.checked;
    document.querySelectorAll('.price-amount.monthly').forEach(el => el.classList.toggle('hidden', isAnnual));
    document.querySelectorAll('.price-amount.annual').forEach(el => el.classList.toggle('hidden', !isAnnual));
    document.getElementById('monthlyLabel')?.classList.toggle('active', !isAnnual);
    document.getElementById('annualLabel')?.classList.toggle('active', isAnnual);
});

// --- FAQ Accordion ---
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
    });
});

// --- Modals ---
function openModal(id) { document.getElementById(id)?.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); document.body.style.overflow = ''; }
window.openModal = openModal;
window.closeModal = closeModal;

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; } });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')); document.body.style.overflow = ''; }
});

// --- Form Validation & Handling ---
function validateForm(form) {
    let valid = true;
    form.querySelectorAll('input[required]').forEach(input => {
        input.classList.remove('error');
        if (!input.value.trim()) { input.classList.add('error'); valid = false; }
        else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) { input.classList.add('error'); valid = false; }
    });
    return valid;
}

function showSuccess(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    openModal('successModal');
}

document.getElementById('signupForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        closeModal('signupModal');
        showSuccess("🎉 You're In!", 'Check your email for next steps. Your 14-day free trial starts now.');
        e.target.reset();
    }
});

document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        closeModal('loginModal');
        showSuccess('Welcome Back!', 'Redirecting to your dashboard...');
        e.target.reset();
    }
});

document.getElementById('demoForm')?.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(e.target)) {
        closeModal('demoModal');
        showSuccess('📅 Demo Booked!', "We'll send a calendar invite to your email shortly.");
        e.target.reset();
    }
});

// Clear error on input
document.querySelectorAll('.modal-form input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
});

// --- Toast ---
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// --- Active Nav Link ---
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

// --- Cookie Banner ---
function acceptCookies() {
    document.getElementById('cookieBanner')?.classList.remove('visible');
    try { localStorage.setItem('cookies_accepted', '1'); } catch(e) {}
}
function dismissCookies() {
    document.getElementById('cookieBanner')?.classList.remove('visible');
    try { localStorage.setItem('cookies_accepted', '0'); } catch(e) {}
}
window.acceptCookies = acceptCookies;
window.dismissCookies = dismissCookies;

// Show cookie banner after 2s if not already accepted
setTimeout(() => {
    try {
        if (!localStorage.getItem('cookies_accepted')) {
            document.getElementById('cookieBanner')?.classList.add('visible');
        }
    } catch(e) {
        document.getElementById('cookieBanner')?.classList.add('visible');
    }
}, 2000);

// --- Hero Typing Effect ---
(function() {
    const el = document.getElementById('heroTyping');
    if (!el) return;
    const phrases = ['Actually Converts', 'Drives Revenue', 'Outperforms All', 'Scales With You'];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
            setTimeout(type, 80);
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
            setTimeout(type, 40);
        }
    }
    setTimeout(type, 3000);
})();
