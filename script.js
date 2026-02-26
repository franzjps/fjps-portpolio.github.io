document.addEventListener("DOMContentLoaded", function() {
    // Gallery Modal Logic
    const galleryImgs = document.querySelectorAll('img.gallery-img[data-img-src]');
    const modalLabel = document.getElementById('galleryModalLabel');
    const modalDesc = document.getElementById('galleryModalDesc');
    const modalCarousel = document.getElementById('galleryModalCarousel');
    const modalCarouselInner = document.getElementById('galleryModalCarouselInner');

    let activeGallerySlides = [];

    const buildCarouselSlides = (slides, activeIndex) => {
        if (!modalCarouselInner) {
            return;
        }

        modalCarouselInner.innerHTML = '';

        slides.forEach((slideData, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item${index === activeIndex ? ' active' : ''}`;
            if (slideData.isLong) {
                item.innerHTML = `<div class="gallery-modal-scrollbox"><img src="${slideData.src}" alt="${slideData.alt}" class="d-block w-100 gallery-modal-carousel-img-long shadow"></div>`;
            } else {
                item.innerHTML = `<img src="${slideData.src}" alt="${slideData.alt}" class="d-block w-100 gallery-modal-carousel-img rounded shadow">`;
            }
            modalCarouselInner.appendChild(item);
        });

        const controls = modalCarousel.querySelectorAll('.carousel-control-prev, .carousel-control-next');
        controls.forEach(control => {
            control.style.display = slides.length > 1 ? '' : 'none';
        });
    };

    const updateModalMeta = (index) => {
        if (!activeGallerySlides[index]) {
            return;
        }

        modalLabel.textContent = activeGallerySlides[index].caption;
        modalDesc.textContent = activeGallerySlides[index].description;
    };

    if (modalCarousel) {
        modalCarousel.addEventListener('slid.bs.carousel', function() {
            const activeItem = modalCarousel.querySelector('.carousel-item.active');
            const activeIndex = Array.from(modalCarouselInner.children).indexOf(activeItem);
            updateModalMeta(activeIndex);
        });
    }
    
    // Gallery Nav Logic
    const photosTab = document.getElementById('galleryPhotosTab');
    const videosTab = document.getElementById('galleryVideosTab');
    const photosContent = document.getElementById('galleryPhotosContent');
    const videosContent = document.getElementById('galleryVideosContent');
    const portfolioTabBtn = document.getElementById('portfolio-tab');
    const cvTabBtn = document.getElementById('cv-tab');
    const portfolioMapSection = document.getElementById('portfolioMapSection');

    const syncMapSectionVisibility = () => {
        if (!portfolioMapSection || !cvTabBtn) {
            return;
        }

        portfolioMapSection.style.display = cvTabBtn.classList.contains('active') ? 'none' : '';
    };

    if (portfolioTabBtn && cvTabBtn && portfolioMapSection) {
        portfolioTabBtn.addEventListener('shown.bs.tab', syncMapSectionVisibility);
        cvTabBtn.addEventListener('shown.bs.tab', syncMapSectionVisibility);
        syncMapSectionVisibility();
    }

    if (photosTab && videosTab && photosContent && videosContent) {
        photosTab.addEventListener('click', function () {
            photosTab.classList.add('active');
            videosTab.classList.remove('active');
            photosContent.style.display = '';
            videosContent.style.display = 'none';
        });
        videosTab.addEventListener('click', function () {
            videosTab.classList.add('active');
            photosTab.classList.remove('active');
            videosContent.style.display = '';
            photosContent.style.display = 'none';
        });
    }

    galleryImgs.forEach((img) => {
        img.addEventListener('click', function () {
            if (!modalCarousel) {
                return;
            }

            const group = img.getAttribute('data-gallery-group');
            const groupImgs = group
                ? Array.from(document.querySelectorAll(`img.gallery-img[data-img-src][data-gallery-group="${group}"]`))
                : [img];

            activeGallerySlides = groupImgs.map(groupImg => ({
                src: groupImg.getAttribute('data-img-src') || groupImg.getAttribute('src') || '',
                alt: groupImg.getAttribute('alt') || '',
                caption: groupImg.getAttribute('data-img-caption') || '',
                description: groupImg.getAttribute('data-img-description') || '',
                isLong: groupImg.getAttribute('data-img-long') === 'true'
            }));

            const activeIndex = groupImgs.indexOf(img);
            buildCarouselSlides(activeGallerySlides, activeIndex > -1 ? activeIndex : 0);

            const carouselInstance = bootstrap.Carousel.getOrCreateInstance(modalCarousel);
            carouselInstance.to(activeIndex > -1 ? activeIndex : 0);
            updateModalMeta(activeIndex > -1 ? activeIndex : 0);
        });
    });
    
    // Gallery Minimize/Expand
    const galleryToggleBtn = document.getElementById('galleryToggleBtn');
    const galleryContent = document.getElementById('galleryContent');
    let minimized = false;

    galleryToggleBtn.addEventListener('click', function () {
        minimized = !minimized;
        if (minimized) {
            galleryContent.style.display = 'none';
            galleryToggleBtn.innerHTML = '<i class="bi bi-plus"></i> Expand';
        } else {
            galleryContent.style.display = '';
            galleryToggleBtn.innerHTML = '<i class="bi bi-dash"></i> Minimize';
        }
    });


    // Gallery Card Scroll Animation
    const animCards = document.querySelectorAll('.gallery-anim-card');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        animCards.forEach(card => observer.observe(card));
    } else {
        // Fallback for old browsers
        animCards.forEach(card => card.classList.add('visible'));
    }

});
