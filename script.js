// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeScrollAnimations();
    initializeStatsCounter();
    initializeProjectsFilter();
    initializeTestimonialSlider();
    initializeContactForm();
    initializeNewsletterForm();
    initializeCookieConsent();
    initializeLanguageSwitch();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navbar toggle on mobile
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Add click event to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Initial active state
    updateActiveNavLink();
}

// Scroll animations and back to top button
function initializeScrollAnimations() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

// Stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Function to animate counter
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 20)); // Update every 20ms
        let current = 0;
        
        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = current;
            }
        }, 20);
    }
    
    // Use Intersection Observer to trigger counter when visible
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        statNumbers.forEach(stat => {
            animateCounter(stat);
        });
    }
}

// Projects filter functionality
function initializeProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Testimonial slider functionality
function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentIndex = 0;
    
    // Function to show testimonial by index
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(item => item.classList.remove('active'));
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current testimonial and dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Add click event to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTestimonial(index);
        });
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = testimonials.length - 1;
        }
        showTestimonial(newIndex);
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) {
            newIndex = 0;
        }
        showTestimonial(newIndex);
    });
    
    // Auto-rotate testimonials
    let interval = setInterval(function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonials.length) {
            newIndex = 0;
        }
        showTestimonial(newIndex);
    }, 5000);
    
    // Pause auto-rotation on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', function() {
        clearInterval(interval);
    });
    
    testimonialSlider.addEventListener('mouseleave', function() {
        interval = setInterval(function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonials.length) {
                newIndex = 0;
            }
            showTestimonial(newIndex);
        }, 5000);
    });
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill all required fields.');
                return;
            }
            
            // Here you would typically send the data to your server
            // This is a placeholder for demonstration
            console.log('Form submitted:', { name, email, phone, service, message });
            
            // Show success message (in a real application you'd wait for server response)
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Newsletter form handling
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email
            const email = this.querySelector('input[type="email"]').value;
            
            // Basic validation
            if (!email) {
                alert('Please enter your email address.');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Newsletter subscription:', { email });
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            newsletterForm.reset();
        });
    }
}

// Cookie consent functionality
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        // Show cookie consent banner after a delay
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 2000);
    }
    
    // Accept cookies
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('show');
        
        // Here you would initialize tracking scripts, etc.
        console.log('Cookies accepted');
    });
    
    // Decline cookies
    declineBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.classList.remove('show');
        
        console.log('Cookies declined');
    });
}

// Language switch functionality
function initializeLanguageSwitch() {
    const enLang = document.getElementById('enLang');
    const grLang = document.getElementById('grLang');
    
    // English version (default)
    enLang.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!this.classList.contains('active')) {
            // Set active state
            this.classList.add('active');
            grLang.classList.remove('active');
            
            // Switch language (in a real application, you would load translations)
            console.log('Language switched to English');
            
            // Here you would update all text content with English translations
            // For demonstration, we'll just keep the page as is (already in English)
            
            // Store language preference
            localStorage.setItem('language', 'en');
        }
    });
    
    // Greek version
    grLang.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!this.classList.contains('active')) {
            // Set active state
            this.classList.add('active');
            enLang.classList.remove('active');
            
            // Switch language (in a real application, you would load translations)
            console.log('Language switched to Greek');
            
            // Here is where you would replace all text with Greek translations
            // For a real website, you might use a translation library or load a different page
            
            // Example of how content would be changed (simplified for demonstration)
            document.querySelector('.hero-content h1').textContent = 'Τροφοδοτώντας την Ελλάδα με Ηλιακή Ενέργεια';
            document.querySelector('.hero-content p').textContent = 'Βιώσιμες ενεργειακές λύσεις για ένα φωτεινότερο μέλλον';
            
            // You would continue with all other text elements
            
            // Store language preference
            localStorage.setItem('language', 'el');
        }
    });
    
    // Check stored language preference on page load
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'el') {
        // Trigger click event to switch to Greek
        grLang.click();
    }
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add animation to elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .benefit-item, .project-card, .contact-item');
    
    // Use Intersection Observer to detect when elements are in viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        elements.forEach(element => {
            element.classList.add('animate');
        });
    }
}

// Call animate on scroll after DOM is loaded
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Handle form validation in real-time
function validateFormFields() {
    const inputFields = document.querySelectorAll('input[required], textarea[required]');
    
    inputFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });
}

// Call form validation after DOM is loaded
document.addEventListener('DOMContentLoaded', validateFormFields);

// Preload images for better user experience
function preloadImages() {
    const imagesToPreload = [
        'images/logo/jp-energy-logo.png',
        'images/team/ceo-papadopoulos.jpg',
        'images/projects/solar-park-aerial.jpg',
        'images/projects/solar-panel-closeup.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload images after DOM is loaded
document.addEventListener('DOMContentLoaded', preloadImages);