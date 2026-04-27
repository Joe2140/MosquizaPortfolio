/* ============================================
   MEMORIES GALLERY FULLSCREEN
   ============================================ */

document.addEventListener('click', (e) => {
    const memoryBtn = e.target.closest('.memory-fullscreen-btn');
    if (!memoryBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Get all memory cards
    const memoryCards = document.querySelectorAll('.memory-card');
    const memoryImages = Array.from(memoryCards).map(card => {
        const img = card.querySelector('.memory-image img');
        return {
            src: img.src,
            alt: img.alt
        };
    });
    
    // Find clicked image index
    const clickedCard = memoryBtn.closest('.memory-card');
    const clickedImg = clickedCard.querySelector('.memory-image img');
    const startIndex = memoryImages.findIndex(img => img.src === clickedImg.src);
    
    if (memoryImages.length > 0) {
        openMemoryFullscreen(memoryImages, startIndex >= 0 ? startIndex : 0);
    }
});

let currentMemoryIndex = 0;
let currentMemoryImages = [];

function openMemoryFullscreen(images, startIndex = 0) {
    currentMemoryImages = images;
    currentMemoryIndex = startIndex;
    
    const viewer = document.getElementById('fullscreenViewer');
    const img = document.getElementById('fullscreenImage');
    const counter = document.getElementById('fullscreenCounter');
    
    img.src = images[startIndex].src;
    img.alt = images[startIndex].alt;
    counter.textContent = `${startIndex + 1} / ${images.length}`;
    
    viewer.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Store memory images for navigation
    viewer.dataset.source = 'memories';
    viewer.dataset.imageCount = images.length;
}

/* ============================================
   CAROUSEL / IMAGE GALLERY FUNCTIONALITY
   ============================================ */

const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('.carousel-img');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;

    // Set initial active image
    if (images.length > 0) {
        images[0].classList.add('active');
    }

    // Function to show image at index
    function showImage(index) {
        // Wrap around
        if (index >= images.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex = index;
        }

        // Update all images and dots
        images.forEach((img, i) => {
            img.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    // Prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carousel.closest('.project-image-wrapper:hover')) {
            if (e.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            }
        }
    });
});

/* ============================================
   FULLSCREEN IMAGE VIEWER WITH NAVIGATION
   ============================================ */

const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenClose = document.querySelector('.fullscreen-close');
const fullscreenPrev = document.querySelector('.fullscreen-prev');
const fullscreenNext = document.querySelector('.fullscreen-next');
const fullscreenCounter = document.getElementById('fullscreenCounter');

let currentFullscreenImages = [];
let currentFullscreenIndex = 0;

function updateFullscreenDisplay() {
    if (currentFullscreenImages.length === 0) return;
    
    const img = currentFullscreenImages[currentFullscreenIndex];
    fullscreenImage.src = img.src;
    fullscreenImage.alt = img.alt;
    fullscreenCounter.textContent = `${currentFullscreenIndex + 1} / ${currentFullscreenImages.length}`;
    
    // Update button states
    fullscreenPrev.style.opacity = currentFullscreenIndex === 0 ? '0.5' : '1';
    fullscreenNext.style.opacity = currentFullscreenIndex === currentFullscreenImages.length - 1 ? '0.5' : '1';
    fullscreenPrev.style.pointerEvents = currentFullscreenIndex === 0 ? 'none' : 'auto';
    fullscreenNext.style.pointerEvents = currentFullscreenIndex === currentFullscreenImages.length - 1 ? 'none' : 'auto';
}

function openFullscreen(imageSrc, allImages, startIndex = 0) {
    currentFullscreenImages = allImages;
    currentFullscreenIndex = startIndex;
    updateFullscreenDisplay();
    fullscreenViewer.classList.add('show');
    document.body.style.overflow = 'hidden';
    console.log('✅ Fullscreen opened');
}

function closeFullscreen() {
    fullscreenViewer.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentFullscreenImages = [];
    console.log('✓ Fullscreen closed');
}

// Fullscreen button click handler
document.addEventListener('click', (e) => {
    const fullscreenBtn = e.target.closest('.fullscreen-btn');
    if (!fullscreenBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Get the carousel container from the clicked button
    const imageWrapper = fullscreenBtn.closest('.project-image-wrapper');
    const carousel = imageWrapper.querySelector('.carousel-container');
    
    // Get all images in this carousel
    const allImages = Array.from(carousel.querySelectorAll('.carousel-img')).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    
    // Find current active image index
    const activeImage = carousel.querySelector('.carousel-img.active');
    const startIndex = allImages.findIndex(img => img.src === activeImage.src);
    
    if (allImages.length > 0) {
        openFullscreen(activeImage.src, allImages, startIndex >= 0 ? startIndex : 0);
    }
});

// Navigation buttons
fullscreenNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentFullscreenIndex < currentFullscreenImages.length - 1) {
        currentFullscreenIndex++;
        updateFullscreenDisplay();
    }
});

fullscreenPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentFullscreenIndex > 0) {
        currentFullscreenIndex--;
        updateFullscreenDisplay();
    }
});

// Close fullscreen button
if (fullscreenClose) {
    fullscreenClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFullscreen();
    });
}

// Close fullscreen when clicking outside image
fullscreenViewer.addEventListener('click', (e) => {
    if (e.target === fullscreenViewer) {
        closeFullscreen();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenViewer.classList.contains('show')) {
        closeFullscreen();
    }
    
    // Navigate with arrow keys
    if (fullscreenViewer.classList.contains('show')) {
        if (e.key === 'ArrowRight' && currentFullscreenIndex < currentFullscreenImages.length - 1) {
            currentFullscreenIndex++;
            updateFullscreenDisplay();
        } else if (e.key === 'ArrowLeft' && currentFullscreenIndex > 0) {
            currentFullscreenIndex--;
            updateFullscreenDisplay();
        }
    }
});

/* ============================================
   MOBILE MENU
   ============================================ */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   PROJECT FILTERING
   ============================================ */

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const selectedFilter = button.getAttribute('data-filter');
        
        // Filter projects
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (selectedFilter === 'all' || cardCategory === selectedFilter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ============================================
   CONTACT FORM
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  emailjs.init("Nz1gCUoCoJjRTLfFQ");

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let params = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      reason: document.getElementById("reason").value,
      message: document.getElementById("message").value,
    };

    emailjs.send("service_67kfvdw", "template_oejc56n", params)
      .then((res) => {
        console.log("SUCCESS:", res.status);
        alert("Message sent!");
        form.reset();
      })
      .catch((err) => {
        console.log("ERROR:", err);
        alert("Failed. Check console.");
      });
  });

});
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let inputs = contactForm.querySelectorAll('input, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      isValid = false;
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = '';
    }
  });

  if (isValid) {
    sendMail();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = "✓ Sent!";
    submitBtn.disabled = true;

    contactForm.reset();

    setTimeout(() => {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
});

/* ============================================
   ACTIVE NAV LINK
   ============================================ */

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

/* ============================================
   NAVBAR BACKGROUND ON SCROLL
   ============================================ */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset > 50;
    
    if (scrolled && navbar) {
        navbar.style.boxShadow = '0 4px 16px rgba(45, 122, 90, 0.12)';
    } else if (navbar) {
        navbar.style.boxShadow = '0 2px 8px rgba(45, 122, 90, 0.08)';
    }
});

/* ============================================
   FORM VALIDATION FEEDBACK
   ============================================ */

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#2d7a5a';
    });
    
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = 'rgba(82, 183, 136, 0.15)';
        }
    });
});

/* ============================================
   CONSOLE LOG
   ============================================ */

console.log('%c🎨 Joesil Mosquiza - Portfolio', 'font-size: 16px; color: #2d7a5a; font-weight: bold;');
console.log('%c✨ Graphic Designer | Creative Professional', 'color: #52b788; font-size: 12px;');
console.log('%c📸 Fullscreen Image Viewer Ready', 'color: #3a9970; font-size: 11px;');