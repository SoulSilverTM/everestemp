document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar Scroll Effect ───────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ─── Mobile Menu Toggle ─────────────────────────────────────────
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('active');
        const i = menuIcon.querySelector('i');
        i.classList.toggle('fa-bars',  !isOpen);
        i.classList.toggle('fa-xmark',  isOpen);
        menuIcon.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuIcon.addEventListener('click', toggleMenu);
    menuIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            menuIcon.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ─── Active nav link on scroll ──────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navItems  = document.querySelectorAll('.nav-links a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
        });
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
        });
    }, { passive: true });

    // ─── Hero Title: word-by-word slide-in ─────────────────────────
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const rawHTML = heroTitle.innerHTML;
        heroTitle.innerHTML = rawHTML.replace(/(<[^>]+>.*?<\/[^>]+>|[^\s<]+)/g, (match) => {
            if (match.startsWith('<')) return match;
            return `<span class="hero-word">${match}</span>`;
        });
        heroTitle.querySelectorAll('.hero-word').forEach((word, i) => {
            word.style.animationDelay = `${0.5 + i * 0.12}s`;
        });
    }

    // ─── Particles Canvas ───────────────────────────────────────────
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles;

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        const rand = (min, max) => Math.random() * (max - min) + min;

        const initParticles = () => {
            const count = Math.min(Math.floor((W * H) / 12000), 80);
            particles = Array.from({ length: count }, () => ({
                x: rand(0, W), y: rand(0, H),
                r: rand(0.8, 2.4),
                vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
                alpha: rand(0.2, 0.6),
            }));
        };

        const connectDistance = 110;

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(92,172,196,${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(92,172,196,${0.12 * (1 - dist / connectDistance)})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        resize(); initParticles(); draw();
        window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
    }

    // ─── Ripple on Buttons ──────────────────────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);
            const x      = e.clientX - rect.left - size / 2;
            const y      = e.clientY - rect.top  - size / 2;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            Object.assign(ripple.style, {
                width: size + 'px', height: size + 'px',
                left: x + 'px',    top:  y + 'px',
            });
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // ─── Scroll Reveal ([data-reveal]) ─────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // ─── Stagger Groups ─────────────────────────────────────────────
    const staggerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    ['.gallery-bento', '.faq-list', '.footer-top', '.about-features'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) staggerObserver.observe(el);
    });

    // ─── Service Card Animations ────────────────────────────────────
    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(card => cardObserver.observe(card));

    // ─── Select floating label ──────────────────────────────────────
    document.querySelectorAll('select.form-input').forEach(select => {
        select.addEventListener('change', () => {
            select.nextElementSibling.classList.toggle('input-has-value', select.value !== '');
        });
    });

    // ─── FAQ Accordion ──────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        const toggle = () => {
            const item   = question.parentElement;
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        };
        question.addEventListener('click', toggle);
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });

    // ─── Lightbox ───────────────────────────────────────────────────
    const lightbox        = document.getElementById('lightbox');
    const lightboxImg     = document.getElementById('lightbox-img');
    const lightboxClose   = document.getElementById('lightbox-close');
    const lightboxPrev    = document.getElementById('lightbox-prev');
    const lightboxNext    = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const projectItems = document.querySelectorAll('.gal-item');
    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        const img = projectItems[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCounter.textContent = `${index + 1} / ${projectItems.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navigate = (dir) => {
        currentIndex = (currentIndex + dir + projectItems.length) % projectItems.length;
        const img = projectItems[currentIndex].querySelector('img');
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCounter.textContent = `${currentIndex + 1} / ${projectItems.length}`;
            lightboxImg.style.opacity = '1';
        }, 180);
    };

    projectItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click',  () => navigate(-1));
    lightboxNext.addEventListener('click',  () => navigate(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
    });

    // ─── Scroll to Top ──────────────────────────────────────────────
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── Contact Form (guard — section may be removed) ──────────────
    const form        = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    if (form && formSuccess) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            setTimeout(() => {
                form.style.display = 'none';
                formSuccess.classList.add('show');
            }, 1500);
        });
    }

    // ─── Scrollytelling ─────────────────────────────────────────────
    const scrollyImg     = document.getElementById('scrolly-img');
    const scrollyTag     = document.getElementById('scrolly-tag');
    const scrollyCounter = document.getElementById('scrolly-counter');
    const scrollyBar     = document.getElementById('scrolly-bar');
    const scrollySteps   = document.querySelectorAll('.scrolly-step');
    const TOTAL          = scrollySteps.length;

    if (scrollyImg && TOTAL > 0) {
        let currentSrc = scrollyImg.src;

        const swapImage = (step) => {
            const newSrc = step.dataset.img;
            const tag    = step.dataset.tag || '';
            const idx    = parseInt(step.dataset.idx, 10);

            // Update counter + progress
            scrollyCounter.textContent = `${String(idx).padStart(2,'0')} / ${String(TOTAL).padStart(2,'0')}`;
            scrollyBar.style.width = `${(idx / TOTAL) * 100}%`;
            scrollyTag.textContent = tag;

            if (newSrc === currentSrc) return;
            currentSrc = newSrc;

            // Crossfade: fade out → swap src → fade in
            scrollyImg.classList.add('fade-out');
            setTimeout(() => {
                scrollyImg.src = newSrc;
                scrollyImg.onload = () => scrollyImg.classList.remove('fade-out');
                // Fallback if already cached
                if (scrollyImg.complete) scrollyImg.classList.remove('fade-out');
            }, 260);
        };

        // Trigger first step immediately
        swapImage(scrollySteps[0]);

        // On mobile the image is sticky at the top and steps are below it.
        // A lower threshold + less negative bottom margin ensures reliable triggering.
        const isMobile = window.matchMedia('(max-width: 860px)').matches;

        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Mark active
                    scrollySteps.forEach(s => s.classList.remove('active'));
                    entry.target.classList.add('active');
                    swapImage(entry.target);
                }
            });
        }, isMobile ? {
            // Mobile: trigger when 20% of the step enters the viewport centre
            threshold: 0.2,
            rootMargin: '-5% 0px -50% 0px',
        } : {
            // Desktop: trigger at mid-point of viewport
            threshold: 0.5,
            rootMargin: '-10% 0px -40% 0px',
        });

        scrollySteps.forEach(step => stepObserver.observe(step));

        // Re-evaluate if viewport size changes (e.g. orientation flip)
        window.matchMedia('(max-width: 860px)').addEventListener('change', (e) => {
            // Reload page on orientation change to reinitialise observer
            // (lightweight approach — avoids complex observer teardown)
            if (e.matches !== isMobile) location.reload();
        });
    }
});

