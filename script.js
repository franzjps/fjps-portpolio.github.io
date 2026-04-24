document.addEventListener("DOMContentLoaded", function() {
    const profileThemeImage = document.getElementById('profileThemeImage');
    const themeToggle = document.getElementById('themeToggle');
    const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const THEME_STORAGE_KEY = 'portfolio-theme';

    const getStoredTheme = () => {
        const value = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (value === 'light' || value === 'dark') {
            return value;
        }
        return null;
    };

    const getEffectiveTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return themeMediaQuery.matches ? 'dark' : 'light';
    };

    const swapProfileImageByTheme = (isDarkMode, animate) => {
        if (!profileThemeImage) {
            return;
        }

        const lightSrc = profileThemeImage.getAttribute('data-light-src') || '';
        const darkSrc = profileThemeImage.getAttribute('data-dark-src') || '';
        const nextSrc = isDarkMode ? darkSrc : lightSrc;

        if (!nextSrc || profileThemeImage.getAttribute('src') === nextSrc) {
            return;
        }

        if (!animate) {
            profileThemeImage.setAttribute('src', nextSrc);
            return;
        }

        profileThemeImage.classList.add('theme-swapping');
        window.setTimeout(() => {
            profileThemeImage.setAttribute('src', nextSrc);

            const clearSwapClass = () => {
                profileThemeImage.classList.remove('theme-swapping');
            };

            profileThemeImage.addEventListener('load', clearSwapClass, { once: true });
            window.setTimeout(clearSwapClass, 280);
        }, 160);
    };

    const applyTheme = (theme, animateImage) => {
        const isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);

        if (themeToggle) {
            themeToggle.checked = isDarkMode;
        }

        swapProfileImageByTheme(isDarkMode, animateImage);
    };

    applyTheme(getEffectiveTheme(), false);

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const nextTheme = themeToggle.checked ? 'dark' : 'light';
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            applyTheme(nextTheme, true);
        });
    }

    if (typeof themeMediaQuery.addEventListener === 'function') {
        themeMediaQuery.addEventListener('change', (event) => {
            if (getStoredTheme()) {
                return;
            }
            applyTheme(event.matches ? 'dark' : 'light', true);
        });
    } else if (typeof themeMediaQuery.addListener === 'function') {
        themeMediaQuery.addListener((event) => {
            if (getStoredTheme()) {
                return;
            }
            applyTheme(event.matches ? 'dark' : 'light', true);
        });
    }

    const projectSections = document.querySelectorAll('.project-showcase');

    if ('IntersectionObserver' in window && projectSections.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        projectSections.forEach(section => observer.observe(section));
    } else {
        projectSections.forEach(section => section.classList.add('visible'));
    }

    const qrButtons = document.querySelectorAll('.qr-contact-btn');
    const contactQrModalLabel = document.getElementById('contactQrModalLabel');
    const contactQrModalImg = document.getElementById('contactQrModalImg');
    const contactQrModalNote = document.getElementById('contactQrModalNote');

    if (qrButtons.length && contactQrModalLabel && contactQrModalImg && contactQrModalNote) {
        qrButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const src = button.getAttribute('data-qr-src') || '';
                const label = button.getAttribute('data-qr-label') || 'Contact QR';
                const note = button.getAttribute('data-qr-note') || '';

                contactQrModalLabel.textContent = label + ' QR';
                contactQrModalImg.setAttribute('src', src);
                contactQrModalImg.setAttribute('alt', label + ' QR code');
                contactQrModalNote.textContent = note;
            });
        });
    }

    const projectPreviewImages = document.querySelectorAll('.project-carousel-img');
    const projectExpandModal = document.getElementById('projectExpandModal');
    const projectExpandModalLabel = document.getElementById('projectExpandModalLabel');
    const projectExpandMediaWrap = document.getElementById('projectExpandMediaWrap');
    const projectExpandImg = document.getElementById('projectExpandImg');
    const projectExpandPrev = document.getElementById('projectExpandPrev');
    const projectExpandNext = document.getElementById('projectExpandNext');

    let activeExpandGroup = [];
    let activeExpandIndex = 0;

    const updateExpandNavState = () => {
        const hideNav = activeExpandGroup.length <= 1;

        if (projectExpandPrev) {
            projectExpandPrev.classList.toggle('hidden', hideNav);
        }

        if (projectExpandNext) {
            projectExpandNext.classList.toggle('hidden', hideNav);
        }
    };

    const renderExpandedImage = () => {
        if (!activeExpandGroup[activeExpandIndex] || !projectExpandImg || !projectExpandModalLabel || !projectExpandMediaWrap) {
            return;
        }

        const currentImage = activeExpandGroup[activeExpandIndex];
        const src = currentImage.getAttribute('src') || '';
        const alt = currentImage.getAttribute('alt') || 'Project Preview';
        const isLong = currentImage.getAttribute('data-expand-long') === 'true';

        projectExpandImg.setAttribute('src', src);
        projectExpandImg.setAttribute('alt', alt);
        projectExpandModalLabel.textContent = alt;
        projectExpandMediaWrap.classList.toggle('long-mode', isLong);
        updateExpandNavState();
    };

    const moveExpandedImage = (direction) => {
        if (activeExpandGroup.length <= 1) {
            return;
        }

        const groupSize = activeExpandGroup.length;
        activeExpandIndex = (activeExpandIndex + direction + groupSize) % groupSize;
        renderExpandedImage();
    };

    if (projectPreviewImages.length && projectExpandModal && projectExpandMediaWrap && projectExpandImg) {
        projectPreviewImages.forEach((img) => {
            img.addEventListener('click', function () {
                const carousel = img.closest('.carousel');
                activeExpandGroup = carousel
                    ? Array.from(carousel.querySelectorAll('.project-carousel-img'))
                    : [img];
                activeExpandIndex = activeExpandGroup.indexOf(img);
                if (activeExpandIndex < 0) {
                    activeExpandIndex = 0;
                }

                renderExpandedImage();

                const modalInstance = bootstrap.Modal.getOrCreateInstance(projectExpandModal);
                modalInstance.show();
            });
        });

        if (projectExpandPrev) {
            projectExpandPrev.addEventListener('click', function () {
                moveExpandedImage(-1);
            });
        }

        if (projectExpandNext) {
            projectExpandNext.addEventListener('click', function () {
                moveExpandedImage(1);
            });
        }
    }
});
