// Re:MEET Landing Page - GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    initHeaderTheme();
    initHeroAnimations();
    initPromisesAnimation();
    initSectionAnimations();
});

// ===== Header Theme Switching =====
function initHeaderTheme() {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[data-theme], footer[data-theme]');

    function updateHeaderTheme() {
        const headerRect = header.getBoundingClientRect();
        const headerMiddle = headerRect.top + headerRect.height / 2;
        let currentTheme = 'dark';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= headerMiddle && rect.bottom > headerMiddle) {
                currentTheme = section.getAttribute('data-theme');
            }
        });

        if (currentTheme === 'light') {
            header.classList.remove('header-dark');
            header.classList.add('header-light');
        } else {
            header.classList.remove('header-light');
            header.classList.add('header-dark');
        }
    }

    window.addEventListener('scroll', updateHeaderTheme);
    window.addEventListener('resize', updateHeaderTheme);
    updateHeaderTheme();
}

// ===== Hero Section Animations =====
function initHeroAnimations() {
    // Hero title fade in
    gsap.fromTo('.hero-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );

    // Hero subtitle fade in
    gsap.fromTo('.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    );

    // Hero buttons fade in
    gsap.fromTo('.hero-buttons',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.9 }
    );

    // Hero bg mouse parallax
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (hero && heroBg) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;

            gsap.to(heroBg, {
                x: offsetX * -100,
                y: offsetY * -60,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        hero.addEventListener('mouseleave', () => {
            gsap.to(heroBg, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
}

// ===== Promises Section Animation =====
function initPromisesAnimation() {
    // Disable on mobile/tablet
    if (window.innerWidth <= 1024) {
        gsap.set('.promises-title', { opacity: 1, y: 0 });
        gsap.set('.promise-card', { top: 'auto' });
        return;
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.promises',
            start: 'top top',
            end: '+=5000',
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Title fade in
    tl.fromTo('.promises-title',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
    );

    // Cards stacking animation
    tl.to('.promise-card-1', { top: '10%', duration: 2 }, '+=0.5')
      .to('.promise-card-2', { top: '40%', duration: 2 }, '+=0.5')
      .to('.promise-card-3', { top: '70%', duration: 2 }, '+=0.5');

    // Fade out content and transition to white
    tl.to('.promises-title, .promises-cards, .promises-bg', { opacity: 0, duration: 0.8 }, '+=0.3')
      .to('.promises', {
          backgroundColor: '#ffffff',
          duration: 0.5,
          onStart: () => {
              document.querySelector('.promises').setAttribute('data-theme', 'light');
          },
          onReverseComplete: () => {
              document.querySelector('.promises').setAttribute('data-theme', 'dark');
          }
      }, '<');
}

// ===== Limit-Solution Combined Animation =====
function initLimitSolutionAnimation() {
    // Disable on mobile/tablet
    if (window.innerWidth <= 1024) {
        gsap.set('.limit-content, .limit-solution .solution-content', { opacity: 1 });
        return;
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.limit-solution',
            start: 'top top',
            end: '+=2000',
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Initial fade in of limit content
    tl.fromTo('.limit-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
    );

    tl.fromTo('.limit-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
        '-=0.5'
    );

    // Hold for a moment
    tl.to({}, { duration: 0.5 });

    // Crossfade: limit title out, solution title in
    tl.to('.limit-title', { opacity: 0, y: -20, duration: 0.8 })
      .fromTo('.solution-title',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '<0.3'
      );

    // Crossfade cards one by one
    tl.to('.limit-card:nth-child(1)', { opacity: 0, scale: 0.95, duration: 0.5 }, '+=0.2')
      .to('.solution-card:nth-child(1)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2')
      .to('.limit-card:nth-child(2)', { opacity: 0, scale: 0.95, duration: 0.5 }, '<0.15')
      .to('.solution-card:nth-child(2)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2')
      .to('.limit-card:nth-child(3)', { opacity: 0, scale: 0.95, duration: 0.5 }, '<0.15')
      .to('.solution-card:nth-child(3)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2');

    // Hold at the end
    tl.to({}, { duration: 0.5 });
}

// ===== Features Section Animation =====
function initFeaturesAnimation() {
    // Disable on mobile/tablet
    if (window.innerWidth <= 1024) {
        gsap.set('.feature-card', { top: 'auto', position: 'relative' });
        return;
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features',
            start: 'top top',
            end: '+=3500',
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Cards continuously scroll from bottom to top and out
    tl.to('.feature-card-1', { top: '-100vh', duration: 10 })
      .to('.feature-card-2', { top: '-100vh', duration: 9.5 }, '-=3')
      .to('.feature-card-3', { top: '-100vh', duration: 8.5 }, '-=3')
      .to('.feature-card-4', { top: '-100vh', duration: 10 }, '-=3');
}

// ===== Other Section Animations =====
function initSectionAnimations() {
    // Limit-Solution combined section
    initLimitSolutionAnimation();

    // Features section
    initFeaturesAnimation();

    // Companies section
    gsap.fromTo('.companies-content',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
                trigger: '.companies',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Process section
    gsap.fromTo('.process .section-title-center-black',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
                trigger: '.process',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.process-step',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
            scrollTrigger: {
                trigger: '.process-steps',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // FAQ section
    gsap.fromTo('.faq-content',
        { opacity: 0, y: 50 },
        {
            opacity: 1, y: 0, duration: 1,
            scrollTrigger: {
                trigger: '.faq',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Footer section - opacity only to preserve CSS transform
    gsap.fromTo('.footer-content',
        { opacity: 0 },
        {
            opacity: 1, duration: 1,
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

console.log('Re:MEET Landing - GSAP Initialized');
