// Re:MEET Landing Page - GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Device detection - check for touch device, not just screen size
function isDesktop() {
    // Check if device has touch capability
    const hasTouch = 'ontouchstart' in window ||
                     navigator.maxTouchPoints > 0 ||
                     navigator.msMaxTouchPoints > 0;

    // Check pointer type (coarse = touch, fine = mouse)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Check User Agent for mobile/tablet keywords
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent);

    // Check if it's iPad (iPadOS 13+ reports as Mac)
    const isIPad = navigator.userAgent.includes('Mac') && hasTouch;

    // It's desktop only if: no touch, fine pointer, not mobile UA, not iPad
    const isDesktopDevice = !hasTouch && !hasCoarsePointer && !mobileUA && !isIPad;

    // Also check minimum width for small laptops
    const hasMinWidth = window.innerWidth > 1024;

    return isDesktopDevice && hasMinWidth;
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    initHeaderTheme();
    initScrollTop();
    initServicesSlider();

    ScrollTrigger.matchMedia({
        // Desktop - full GSAP animations with pin
        "(min-width: 1025px)": function() {
            if (isDesktop()) {
                initHeroAnimations();
                initHeroPin();
                initPromisesAnimation();
                initSectionAnimations();
            } else {
                initMobileStyles();
            }
        },
        // Mobile/Tablet - static styles, no pin-spacer
        "(max-width: 1024px)": function() {
            initMobileStyles();
        }
    });
});

// ===== Mobile/Tablet Static Styles =====
function initMobileStyles() {
    // Make all elements visible without animation
    gsap.set('.hero-title, .hero-subtitle, .hero-label, .hero-cta, .hero-right, .hero-bottom', { opacity: 1, y: 0 });
    gsap.set('.promises-title, .promises-subtitle', { opacity: 1, y: 0 });
    gsap.set('.promise-card', { position: 'relative', top: 'auto' });
    gsap.set('.limit-content, .limit-title, .limit-card', { opacity: 1, y: 0 });
    gsap.set('.solution-content, .solution-title, .solution-desc, .solution-card', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.process .section-title-center-black, .process-desc, .process-caption, .process-step', { opacity: 1, y: 0 });
    gsap.set('.faq-content', { opacity: 1, y: 0 });
    gsap.set('.footer-content', { opacity: 1 });
}

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

// ===== Services Slider =====
function initServicesSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider(newIndex) {
        // Remove active from all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Add active to new slide
        slides[newIndex].classList.add('active');
        currentIndex = newIndex;
    }

    // Click on inactive slide to activate
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (!slide.classList.contains('active')) {
                updateSlider(index);
            }
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
        updateSlider(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
        updateSlider(newIndex);
    });
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

    // Hero label fade in
    gsap.fromTo('.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    );

    // Hero CTA fade in
    gsap.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 }
    );

    // Hero right cards fade in
    gsap.fromTo('.hero-right',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Hero bottom stats fade in
    gsap.fromTo('.hero-bottom',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power3.out', delay: 1.2 }
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

// ===== Hero Section Pin (light theme split layout) =====
function initHeroPin() {
    const heroSplit = document.querySelector('.hero-split');
    if (!heroSplit) return;

    // Pin hero section
    ScrollTrigger.create({
        trigger: '.hero-split',
        start: 'top top',
        end: '+=500',
        pin: true,
        anticipatePin: 1
    });

}

// ===== Promises Section Animation =====
function initPromisesAnimation() {
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

    // Subtitle fade in
    tl.fromTo('.promises-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
    );

    // Cards stacking animation
    tl.to('.promise-card-1', { top: '10%', duration: 2 }, '+=0.5')
      .to('.promise-card-2', { top: '40%', duration: 2 }, '+=0.5')
      .to('.promise-card-3', { top: '70%', duration: 2 }, '+=0.5');

    // Hold after last card - additional scroll before next section
    tl.to({}, { duration: 2 });

    // Fade out content and transition to white (only for dark theme)
    const isLightTheme = document.body.classList.contains('theme-light');
    if (!isLightTheme) {
        tl.to('.promises-title, .promises-subtitle, .promises-cards, .promises-bg', { opacity: 0, duration: 0.8 }, '+=0.3')
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
}

// ===== Limit-Solution Combined Animation =====
function initLimitSolutionAnimation() {
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

    // Hold after limit content - additional scroll before solution
    tl.to({}, { duration: 2 });

    // Crossfade: limit title out, solution title + desc in
    tl.to('.limit-title', { opacity: 0, y: -20, duration: 4 })
      .fromTo('.solution-title',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 2 },
          '<0.3'
      )
      .fromTo('.solution-desc',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1.5 },
          '-=1'
      );
    tl.to({}, { duration: 2 });

    // Crossfade cards one by one with hold between each
    tl.to('.limit-card:nth-child(1)', { opacity: 0, scale: 0.95, duration: 0.5 }, '+=0.2')
      .to('.solution-card:nth-child(1)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2');

    // Hold after card 1
    tl.to({}, { duration: 2 });

    tl.to('.limit-card:nth-child(2)', { opacity: 0, scale: 0.95, duration: 0.5 })
      .to('.solution-card:nth-child(2)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2');

    // Hold after card 2
    tl.to({}, { duration: 2 });

    tl.to('.limit-card:nth-child(3)', { opacity: 0, scale: 0.95, duration: 0.5 })
      .to('.solution-card:nth-child(3)', { opacity: 1, scale: 1, duration: 0.5 }, '<0.2');

    // Hold at the end - additional scroll before next section
    tl.to({}, { duration: 5 });
}

// ===== Features Section Animation =====
function initFeaturesAnimation() {
    if (!document.querySelector('.features')) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features',
            start: 'top top',
            end: '+=6000',
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // Cards rise one by one
    tl.to('.feature-card-1', { top: '0%', duration: 2 });
    tl.to('.feature-card-2', { top: '-20%', duration: 2 });
    tl.to('.feature-card-3', { top: '50%', duration: 2 });
    tl.to('.feature-card-4', { top: '60%', duration: 2 });

    // Hold all cards together
    tl.to({}, { duration: 2 });

    // Cards exit one by one
    tl.to('.feature-card-1', { top: '-100vh', duration: 1 });
    tl.to('.feature-card-2', { top: '-100vh', duration: 1 });
    tl.to('.feature-card-3', { top: '-100vh', duration: 1 });
    tl.to('.feature-card-4', { top: '-100vh', duration: 1 });

    // Fade out background and transition to white
    tl.to('.features-bg', { opacity: 0, duration: 1 })
      .to('.features', {
          backgroundColor: '#ffffff',
          duration: 0.8,
          onStart: () => {
              document.querySelector('.features').setAttribute('data-theme', 'light');
          },
          onReverseComplete: () => {
              document.querySelector('.features').setAttribute('data-theme', 'dark');
          }
      }, '<');
}

// ===== Other Section Animations =====
function initSectionAnimations() {
    // Limit-Solution combined section
    initLimitSolutionAnimation();

    // Features section
    initFeaturesAnimation();

    // Companies section with pin
    if (document.querySelector('.companies')) {
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

        ScrollTrigger.create({
            trigger: '.companies',
            start: 'top top',
            end: '+=500',
            pin: true,
            anticipatePin: 1
        });
    }

    // Process section with pin
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

    ScrollTrigger.create({
        trigger: '.process',
        start: 'top top',
        end: '+=500',
        pin: true,
        anticipatePin: 1
    });

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

// ===== Scroll to Top Button =====
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[data-theme], footer[data-theme]');

    if (!scrollTopBtn) return;

    function updateButtonTheme() {
        const btnRect = scrollTopBtn.getBoundingClientRect();
        const btnMiddle = btnRect.top + btnRect.height / 2;
        let currentTheme = 'dark';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= btnMiddle && rect.bottom > btnMiddle) {
                currentTheme = section.getAttribute('data-theme');
            }
        });

        if (currentTheme === 'light') {
            scrollTopBtn.classList.add('dark');
        } else {
            scrollTopBtn.classList.remove('dark');
        }
    }

    // Show/hide button and update theme based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        updateButtonTheme();
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

console.log('Re:MEET Landing - GSAP Initialized');
