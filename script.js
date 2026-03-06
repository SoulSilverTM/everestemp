document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const i = menuIcon.querySelector('i');
        if (navLinks.classList.contains('active')) {
            i.classList.remove('fa-bars');
            i.classList.add('fa-xmark');
        } else {
            i.classList.remove('fa-xmark');
            i.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.querySelector('i').classList.remove('fa-xmark');
            menuIcon.querySelector('i').classList.add('fa-bars');
        });
    });

    // Form inputs label animation handler
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        // If it's a select element, handle change
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                if(input.value !== "") {
                    input.nextElementSibling.classList.add('input-has-value');
                } else {
                    input.nextElementSibling.classList.remove('input-has-value');
                }
            });
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });
});
