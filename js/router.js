// Router configuration
const routes = {
    '#/': 'home',
    '#/about': 'about',
    '#/locations': 'locations',
    '#/services': 'menu',
    '#/reviews': 'reviews',
    '#/team': 'technicians',
    '#/gallery': 'instagram',
    '#/aftercare': 'aftercare',
    '#/contact': 'contact'
};

// Handle route changes
function handleRoute() {
    // Get hash or default to home
    let hash = window.location.hash.toLowerCase() || '#/';
    
    // Remove any trailing slashes except for home route
    if (hash !== '#/') {
        hash = hash.replace(/\/$/, '');
    }
    
    const targetSection = routes[hash] || 'home';
    
    // Scroll to section
    const element = document.getElementById(`${targetSection}-placeholder`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    // Update active states in navigation
    updateActiveNavigation(targetSection);
}

// Update navigation active states
function updateActiveNavigation(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Initialize router
function initializeRouter() {
    // Handle initial route
    handleRoute();

    // Handle navigation clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-section]');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            // Convert regular path to hash path if necessary
            const hashPath = path.startsWith('#') ? path : '#' + path;
            window.location.hash = hashPath;
            // handleRoute() will be called by the hashchange event
        }
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        handleRoute();
    });
}

export { initializeRouter }; 