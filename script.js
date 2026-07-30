/**
 * आर्यन कांबले - PORTFOLIO INTERACTION LOGIC
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        
        // Fallback in case load event takes too long
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 3000);
    }

    // ==========================================
    // 2. MOBILE MENU DRAWER
    // ==========================================
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerToggle && navbar) {
        hamburgerToggle.addEventListener('click', () => {
            hamburgerToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 3. STICKY HEADER & SCROLL PROGRESS
    // ==========================================
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header Sticky Class
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Scroll Progress Bar
        if (progressBar) {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (documentHeight > 0) {
                const scrollPercent = (scrollY / documentHeight) * 100;
                progressBar.style.width = `${scrollPercent}%`;
            }
        }
    });

    // ==========================================
    // 4. SCROLL REVEAL (FADE / SLIDE UP IN PORT)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up');

    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || entry.intersectionRatio > 0.1) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. ACTIVE NAV SECTION HIGH LIGHTING
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    const activeNavObserverOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px'
    };

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeNavObserverOptions);

    sections.forEach(sec => activeNavObserver.observe(sec));

    // ==========================================
    // 6. SCROLL TO TOP BUTTON
    // ==========================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (scrollToTopBtn) {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 7. COUNTER STATISTICS ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimals') || '0');
        const duration = 1800; // Total duration in ms
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            const currentValue = easeProgress * target;

            if (decimals > 0) {
                element.innerText = currentValue.toFixed(decimals);
            } else {
                element.innerText = Math.floor(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (decimals > 0) {
                    element.innerText = target.toFixed(decimals);
                } else {
                    element.innerText = target;
                }
            }
        };

        requestAnimationFrame(animate);
    };

    const statsSection = document.getElementById('impact');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    statNumbers.forEach(num => countUp(num));
                    animatedStats = true;
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 8. LIGHTBOX MODAL (CERTIFICATES & GALLERY)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxPrev = document.getElementById('lightbox-prev-btn');
    const lightboxNext = document.getElementById('lightbox-next-btn');

    let currentLightboxCollection = [];
    let currentLightboxIndex = -1;

    // Open lightbox function
    const openLightbox = (collection, index) => {
        currentLightboxCollection = collection;
        currentLightboxIndex = index;
        updateLightboxContent();
        if (lightbox) {
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
    };

    // Close lightbox function
    const closeLightbox = () => {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable background scrolling
        }
    };

    // Update image and caption in lightbox
    const updateLightboxContent = () => {
        if (currentLightboxIndex > -1 && currentLightboxIndex < currentLightboxCollection.length) {
            const currentItem = currentLightboxCollection[currentLightboxIndex];
            const imgPath = currentItem.getAttribute('data-image') || currentItem.querySelector('img').src;
            const caption = currentItem.querySelector('h4') ? currentItem.querySelector('h4').innerText : (currentItem.querySelector('img').alt || '');
            
            lightboxImg.src = imgPath;
            lightboxCaption.innerText = caption;

            // Show/Hide controls based on collection size
            if (currentLightboxCollection.length <= 1) {
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            } else {
                lightboxPrev.style.display = 'flex';
                lightboxNext.style.display = 'flex';
            }
        }
    };

    // Navigation triggers
    const showPrevImage = (e) => {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxCollection.length) % currentLightboxCollection.length;
        updateLightboxContent();
    };

    const showNextImage = (e) => {
        if (e) e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxCollection.length;
        updateLightboxContent();
    };

    // Binding Click Listeners for Certificates
    const certCards = Array.from(document.querySelectorAll('.cert-card'));
    certCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openLightbox(certCards, index);
        });
    });

    // Binding Click Listeners for Gallery Items
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item-card'));
    galleryItems.forEach((card, index) => {
        card.addEventListener('click', () => {
            openLightbox(galleryItems, index);
        });
    });

    // Close event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation in Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });


});
