// Import router
import { initializeRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");

    // --- Configuration ---
    const componentsToLoad = [
        { id: 'navigation-placeholder', path: 'components/layout/navigation.html' },
        { id: 'home-placeholder', path: 'components/sections/home.html' },
        { id: 'locations-placeholder', path: 'components/sections/locations.html' },
        { id: 'about-placeholder', path: 'components/sections/about.html' },
        { id: 'menu-placeholder', path: 'components/sections/menu.html' },
        { id: 'technicians-placeholder', path: 'components/sections/technicians.html' },
        { id: 'reviews-placeholder', path: 'components/sections/reviews.html' },
        { id: 'instagram-placeholder', path: 'components/sections/instagram.html' },
        { id: 'aftercare-placeholder', path: 'components/sections/aftercare.html' },
        { id: 'contact-placeholder', path: 'components/sections/contact.html' },
        { id: 'footer-placeholder', path: 'components/layout/footer.html' },
        { id: 'booking-modal-placeholder', path: 'components/layout/booking-modal.html' },
        { id: 'policy-modal-placeholder', path: 'components/layout/policy-modal.html' },
        { id: 'shop-modal-placeholder', path: 'components/layout/shop-modal.html' },
        { id: 'faq-modal-placeholder', path: 'components/layout/faq-modal.html' }
    ];

    // IMPORTANT: Replace with your actual URLs!
    const bookingLinks = {
        'Irvine': 'https://book.squareup.com/appointments/f80ffd17-8030-41a2-ba19-12bd5541cb16/location/LC0CZ4AZ7TKXS/services',
        'Tustin': 'https://book.squareup.com/appointments/f80ffd17-8030-41a2-ba19-12bd5541cb16/location/G0X353MBKGTCW/services',
        'Santa Ana': 'https://book.squareup.com/appointments/f80ffd17-8030-41a2-ba19-12bd5541cb16/location/LZMX8CTA69S7E/services',
        'Costa Mesa': 'https://book.squareup.com/appointments/f80ffd17-8030-41a2-ba19-12bd5541cb16/location/LVMKS7ERWS3KP/services'
    };
    const yelpProfileUrl = 'https://www.yelp.com/biz/elegant-lashes-by-katie-irvine-irvine';

    // --- Component Loading Function ---
    const loadComponent = async ({ id, path }) => {
        const placeholder = document.getElementById(id);
        if (!placeholder) {
            console.error(`Placeholder element with ID "${id}" not found.`);
            // Potentially mark loading as failed for this component if needed later
            return;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${path}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
            placeholder.classList.remove('placeholder-loading');
            placeholder.classList.add('placeholder-loaded');
            console.log(`Successfully loaded component: ${path}`);
        } catch (error) {
            console.error(`Failed to load component "${path}":`, error);
            placeholder.innerHTML = `<p class="text-center text-red-600 p-4 font-semibold">Error loading content.</p>`;
            placeholder.classList.remove('placeholder-loading');
            placeholder.classList.add('placeholder-error');
        }
    };

    // --- Initialization Functions ---

    function initializeMobileMenu() {
        const navPlaceholder = document.getElementById('navigation-placeholder');
        if (!navPlaceholder) return; // Need the navigation loaded

        const mobileMenuButton = navPlaceholder.querySelector('#mobile-menu-button');
        const mobileMenu = navPlaceholder.querySelector('#mobile-menu'); // Ensure selecting within the loaded nav

        if (mobileMenuButton && mobileMenu) {
            const menuIconOpen = mobileMenuButton.querySelector('svg.block');
            const menuIconClose = mobileMenuButton.querySelector('svg.hidden');

            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
                menuIconOpen?.classList.toggle('hidden');
                menuIconClose?.classList.toggle('hidden');
            });

            // Use event delegation on the menu itself for potentially loaded links/buttons
            mobileMenu.addEventListener('click', (event) => {
                 // Check if the clicked element is a link or a button meant to close the menu
                if (event.target.closest('a') || event.target.closest('button.open-modal-button')) {
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.add('hidden');
                    menuIconOpen?.classList.remove('hidden');
                    menuIconClose?.classList.add('hidden');
                    // Note: Modal opening logic is handled separately in initializeBookingModal
                }
            });
             console.log("Mobile menu initialized.");
        } else {
            console.warn("Mobile menu button or menu element not found within navigation placeholder.");
        }
    }

    function initializeBookingModal() {
        const bookingModal = document.getElementById('booking-modal'); // Modal is in its own component now
        if (!bookingModal) {
            console.warn("Booking modal element not found.");
            return;
        }

        const modalOverlay = bookingModal.querySelector('.modal-overlay');
        const modalCloseButton = bookingModal.querySelector('.modal-close');
        const openModalButtons = document.querySelectorAll('.open-modal-button'); // Query globally as they exist in multiple components
        const locationSelectButtonsModal = bookingModal.querySelectorAll('.location-select-button');
        // Buttons on location page - query after components loaded
        const locationSelectButtonsPage = document.querySelectorAll('#locations-placeholder .location-select-button');

        const openModal = () => {
            bookingModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
        const closeModal = () => {
            bookingModal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // Attach listeners to ALL buttons that should open the modal
        openModalButtons.forEach(button => button.addEventListener('click', openModal));

        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);

        // Handle location selection from Modal buttons
        if (locationSelectButtonsModal) {
            locationSelectButtonsModal.forEach(button => {
                button.addEventListener('click', () => {
                    const location = button.getAttribute('data-location');
                    const url = bookingLinks[location];
                    // Basic check if URL is a placeholder
                    if (url && !url.toUpperCase().includes('YOUR_')) {
                        console.log(`Redirecting to ${location} booking: ${url}`);
                        window.open(url, '_blank'); // Open in new tab
                        closeModal();
                    } else {
                        console.warn(`Booking link for ${location} is not set up or is a placeholder.`);
                        alert(`Online booking for ${location} is coming soon! Please call or text 657-334-9919 to book.`);
                        // closeModal(); // Optionally close modal even if link is not ready
                    }
                });
            });
        }

        // Handle location selection from Location Section buttons (just open modal)
        if (locationSelectButtonsPage) {
            locationSelectButtonsPage.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default if it's an anchor etc.
                    openModal();
                });
            });
        }
         console.log("Booking modal initialized.");
    }

    function initializePolicyModal() {
        const policyModal = document.getElementById('policy-modal');
        if (!policyModal) {
            console.warn("Policy modal element not found.");
            return;
        }

        const modalOverlay = policyModal.querySelector('.modal-overlay');
        const modalCloseButton = policyModal.querySelector('.modal-close');
        const openPolicyButtons = document.querySelectorAll('.open-policy-modal');

        const openModal = () => {
            policyModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
        const closeModal = () => {
            policyModal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        // Attach listeners to all buttons that should open the modal
        openPolicyButtons.forEach(button => button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        }));

        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);

        console.log("Policy modal initialized.");
    }

    function initializeShopModal() {
        const shopModal = document.getElementById('shop-modal');
        if (!shopModal) {
            console.warn("Shop modal not found");
            return;
        }

        const openButtons = document.querySelectorAll('.open-shop-modal');
        const closeButton = shopModal.querySelector('.modal-close');
        const overlay = shopModal.querySelector('.modal-overlay');

        function openModal() {
            shopModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            shopModal.classList.add('hidden');
            document.body.style.overflow = '';
        }

        openButtons.forEach(button => {
            button.addEventListener('click', openModal);
        });

        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !shopModal.classList.contains('hidden')) {
                closeModal();
            }
        });

        console.log("Shop modal initialized.");
    }

    function initializeFAQModal() {
        const modal = document.getElementById('faq-modal');
        const openButtons = document.querySelectorAll('.open-faq-modal');
        const closeButton = modal?.querySelector('.modal-close');
        const overlay = modal?.querySelector('.modal-overlay');
        const faqQuestions = modal?.querySelectorAll('.faq-question');

        const openModal = () => {
            modal?.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal?.classList.add('hidden');
            document.body.style.overflow = '';
        };

        // Handle FAQ question clicks
        faqQuestions?.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other answers
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('show');
                    }
                });

                // Toggle current answer
                question.setAttribute('aria-expanded', !isExpanded);
                answer.classList.toggle('show');
            });
        });

        openButtons.forEach(button => {
            button.addEventListener('click', openModal);
        });

        if (closeButton) closeButton.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });

        console.log('FAQ Modal initialized');
    }

    function updateYelpLinks() {
        // Update the main Yelp link in the reviews section
        const reviewsPlaceholder = document.getElementById('reviews-placeholder');
        if (reviewsPlaceholder) {
            const mainYelpLink = reviewsPlaceholder.querySelector('a[href*="yelp.com"]'); // Robust selector
            if (mainYelpLink) {
                if (yelpProfileUrl && !yelpProfileUrl.toUpperCase().includes('YOUR_')) {
                    mainYelpLink.href = yelpProfileUrl;
                    mainYelpLink.target = '_blank';
                    mainYelpLink.rel = 'noopener noreferrer';
                } else {
                    mainYelpLink.removeAttribute('href');
                    mainYelpLink.style.pointerEvents = 'none';
                    mainYelpLink.style.opacity = '0.6';
                    mainYelpLink.style.textDecoration = 'line-through';
                    console.warn("Main Yelp Profile URL is not configured.");
                }
            }
        }

        // Update the Yelp link in the footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerYelpLink = footerPlaceholder.querySelector('footer a[href*="yelp.com"]'); // Robust selector
            if (footerYelpLink) {
                if (yelpProfileUrl && !yelpProfileUrl.toUpperCase().includes('YOUR_')) {
                    footerYelpLink.href = yelpProfileUrl;
                    footerYelpLink.target = '_blank';
                    footerYelpLink.rel = 'noopener noreferrer';
                } else {
                    footerYelpLink.style.display = 'none'; // Hide link if not configured
                }
            }
        }
         console.log("Yelp links updated.");
    }

    function initializeScrollSpy() {
        const sections = document.querySelectorAll('section[id]'); // Select all sections by ID attribute
        const navPlaceholder = document.getElementById('navigation-placeholder');

        if (!navPlaceholder || sections.length === 0) {
            console.warn("Navigation placeholder or sections not found. Scroll spy disabled.");
            return;
        }

        const navLinks = navPlaceholder.querySelectorAll('nav a.nav-link'); // Select links within the loaded nav
        const navElement = navPlaceholder.querySelector('nav');
        const navHeight = navElement?.offsetHeight || 64;

        if (navLinks.length === 0) {
            console.warn("Navigation links not found within navigation placeholder. Scroll spy disabled.");
            return;
        }

        let currentActiveSectionId = ''; // Store the ID of the currently active section

        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: `-${navHeight + 60}px 0px -45% 0px`, // Adjust margins: top margin accounts for nav+buffer, bottom margin makes it trigger earlier
            threshold: 0 // Trigger as soon as the element enters/leaves the intersection area
        };

        const intersectionCallback = (entries) => {
            let intersectingEntries = entries.filter(entry => entry.isIntersecting);

            if (intersectingEntries.length > 0) {
                // Find the entry that is "most" visible (closest to the top edge defined by rootMargin)
                intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                currentActiveSectionId = intersectingEntries[0].target.getAttribute('id');
            } else {
                // If nothing is intersecting within the rootMargin (scrolled past the last section),
                // keep the last active section highlighted, unless scrolled near the very top.
                 if (window.scrollY < sections[0].offsetTop - navHeight - 50) {
                    currentActiveSectionId = sections[0].getAttribute('id') || 'home'; // Default to home if scrolled way up
                }
                // Otherwise, currentActiveSectionId retains its last value
            }

             // Update nav links based ONLY on the determined currentActiveSectionId
             navLinks.forEach(link => {
                 const linkHref = link.getAttribute('href');
                 const isActive = linkHref === `#${currentActiveSectionId}`;
                 link.classList.toggle('nav-active', isActive);
                 link.classList.toggle('text-primary', isActive);
                 link.classList.toggle('border-transparent', !isActive);
                 link.classList.toggle('text-darktext', !isActive);
             });
        };

        const observer = new IntersectionObserver(intersectionCallback, observerOptions);
        sections.forEach(section => observer.observe(section));

        // Initial check for highlighting when page loads (useful for hashed URLs)
        const initialHash = window.location.hash;
        let initialActiveId = 'home'; // Default to home

        if (initialHash && document.getElementById(initialHash.substring(1))) {
            initialActiveId = initialHash.substring(1);
            // Attempt to scroll into view slightly below the nav bar
            const targetElement = document.getElementById(initialActiveId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight - 20; // 20px buffer

                // Use timeout to ensure rendering is complete after component load
                setTimeout(() => {
                     window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' // Or 'auto' for instant jump
                    });
                }, 100); // Small delay
            }
        }

        // Apply initial highlighting
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${initialActiveId}`;
            link.classList.toggle('nav-active', isActive);
            link.classList.toggle('text-primary', isActive);
            link.classList.toggle('border-transparent', !isActive);
            link.classList.toggle('text-darktext', !isActive);
        });
        currentActiveSectionId = initialActiveId; // Set the initial active ID tracker

         console.log(`Scroll spy initialized. Initial section: ${currentActiveSectionId}`);
    }

    // Reviews Section Location Tabs
    function initializeReviewTabs() {
        const reviewsSection = document.getElementById('reviews');
        if (!reviewsSection) {
            console.warn('Reviews section not found');
            return;
        }

        const locationTabs = reviewsSection.querySelectorAll('.location-tab');
        const reviewContainers = reviewsSection.querySelectorAll('.location-reviews');

        // Function to show reviews for a specific location
        const showLocationReviews = (locationId) => {
            // Hide all review containers
            reviewContainers.forEach(container => {
                container.classList.remove('active');
                container.style.display = 'none';
            });

            // Remove active class from all tabs
            locationTabs.forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected location's reviews
            const selectedContainer = reviewsSection.querySelector(`.location-reviews[data-location="${locationId}"]`);
            if (selectedContainer) {
                selectedContainer.classList.add('active');
                selectedContainer.style.display = 'block';
            }

            // Add active class to selected tab
            const selectedTab = reviewsSection.querySelector(`.location-tab[data-location="${locationId}"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        };

        // Add click event listeners to location tabs
        locationTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const locationId = tab.getAttribute('data-location');
                showLocationReviews(locationId);
            });
        });

        // Show Irvine reviews by default
        showLocationReviews('irvine');
    }

    // Yelp Reviews Modal
    function initializeYelpModal() {
        const modal = document.getElementById('yelp-modal');
        const openButton = document.getElementById('open-yelp-modal');
        const closeButton = document.getElementById('close-yelp-modal');

        if (!modal || !openButton || !closeButton) return;

        openButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        };

        closeButton.addEventListener('click', closeModal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    function initializeTeamToggles() {
        const techniciansSection = document.getElementById('technicians');
        if (!techniciansSection) {
            console.warn("Technicians section not found");
            return;
        }

        const toggleButtons = techniciansSection.querySelectorAll('.team-location-toggle');
        let currentlyExpanded = null;
        
        function collapseSection(wrapper) {
            const content = wrapper.querySelector('.team-members');
            wrapper.style.height = '0px';
            wrapper.classList.remove('expanded');
            wrapper.previousElementSibling.setAttribute('aria-expanded', 'false');
        }

        function expandSection(wrapper) {
            const content = wrapper.querySelector('.team-members');
            wrapper.classList.add('expanded');
            wrapper.style.height = content.offsetHeight + 'px';
            wrapper.previousElementSibling.setAttribute('aria-expanded', 'true');
        }
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const wrapper = this.nextElementSibling;
                
                // If clicking the same button that's already expanded, collapse it
                if (this.getAttribute('aria-expanded') === 'true') {
                    collapseSection(wrapper);
                    currentlyExpanded = null;
                    return;
                }
                
                // If there's a different section expanded, collapse it
                if (currentlyExpanded) {
                    collapseSection(currentlyExpanded);
                }
                
                // Expand the clicked section
                expandSection(wrapper);
                currentlyExpanded = wrapper;
            });
        });

        // Handle resize events to update heights
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (currentlyExpanded) {
                    const content = currentlyExpanded.querySelector('.team-members');
                    currentlyExpanded.style.height = content.offsetHeight + 'px';
                }
            }, 250);
        });
        
        console.log("Team toggles initialized");
    }

    // Add scroll handler for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function initializeMenuCollapsible() {
        const serviceHeaders = document.querySelectorAll('.service-header');
        
        if (serviceHeaders.length === 0) {
            console.warn('No service headers found for collapsible menu');
            return;
        }
        
        // Initialize all headers with a unique ID
        serviceHeaders.forEach((header, index) => {
            header.setAttribute('data-service-id', `service-${index}`);
            header.setAttribute('aria-expanded', 'false');
        });
        
        serviceHeaders.forEach(header => {
            header.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                
                const serviceId = this.getAttribute('data-service-id');
                const content = this.nextElementSibling;
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Toggle only this specific service
                if (isExpanded) {
                    // Collapse
                    this.setAttribute('aria-expanded', 'false');
                    this.classList.remove('expanded');
                    content.classList.remove('expanded');
                } else {
                    // Expand
                    this.setAttribute('aria-expanded', 'true');
                    this.classList.add('expanded');
                    content.classList.add('expanded');
                    
                    // Scroll into view if needed
                    setTimeout(() => {
                        const headerRect = this.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        
                        if (headerRect.bottom > windowHeight * 0.8) {
                            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 300);
                }
            });
        });
        
        // Add click handler to the document to close expanded services when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.service-header') && !e.target.closest('.service-content')) {
                serviceHeaders.forEach(header => {
                    if (header.getAttribute('aria-expanded') === 'true') {
                        header.setAttribute('aria-expanded', 'false');
                        header.classList.remove('expanded');
                        header.nextElementSibling.classList.remove('expanded');
                    }
                });
            }
        });
        
        console.log('Menu collapsible functionality initialized');
    }

    function initializeTeamLocationModals() {
        const locationBtns = document.querySelectorAll('.location-btn');
        const modals = document.querySelectorAll('.modal');
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        const modalOverlays = document.querySelectorAll('.modal-overlay');

        // Open modal function
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                // Reset scroll position of modal content
                const modalContainer = modal.querySelector('.modal-container');
                if (modalContainer) {
                    modalContainer.scrollTop = 0;
                }
                
                modal.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                });
                document.body.style.overflow = 'hidden';
            }
        }

        // Close modal function
        function closeModal(modal) {
            if (modal) {
                modal.classList.remove('active');
                modal.addEventListener('transitionend', () => {
                    modal.classList.add('hidden');
                    // Reset scroll position when modal is closed
                    const modalContainer = modal.querySelector('.modal-container');
                    if (modalContainer) {
                        modalContainer.scrollTop = 0;
                    }
                }, { once: true });
                document.body.style.overflow = '';
            }
        }

        // Add click event listeners to location buttons
        locationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal-target');
                openModal(modalId);
            });
        });

        // Add click event listeners to close buttons
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                closeModal(modal);
            });
        });

        // Add click event listeners to modal overlays
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                const modal = overlay.closest('.modal');
                closeModal(modal);
            });
        });

        // Close modal on escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        closeModal(modal);
                    }
                });
            }
        });

        console.log("Team location modals initialized.");
    }

    // --- Main Execution Flow ---
    console.log("Starting component loading...");
    Promise.all(componentsToLoad.map(comp => loadComponent(comp)))
        .then(() => {
            console.log('All components loaded.');
            console.log('Initializing application features...');

            // Initialize JS features that depend on the loaded components
            initializeMobileMenu();
            initializeBookingModal();
            initializePolicyModal();
            initializeShopModal();
            initializeFAQModal();
            initializeScrollSpy();
            initializeReviewTabs();
            initializeYelpModal();
            initializeTeamToggles();
            updateYelpLinks();
            initializeMenuCollapsible();
            initializeTeamLocationModals();

            // Initialize router last
            initializeRouter();

            console.log('Application initialization complete.');
        })
        .catch(error => {
            console.error('Critical error during component loading phase:', error);
            document.body.innerHTML = '<p class="text-center text-red-600 p-8 font-bold text-xl">Sorry, the page could not be loaded completely. Please try refreshing.</p>';
        });

}); // End DOMContentLoaded listener