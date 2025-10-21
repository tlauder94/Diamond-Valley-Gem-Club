// Contact page JavaScript functionality

// Dynamically load the shared navbar
function loadNavbar() {
  fetch('navbar.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load navbar. Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('header').innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading navbar:', error);
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = 'Failed to load navbar. Please try again later.';
      document.querySelector('header').appendChild(errorElement);
    });
}

// Dynamically load the shared footer
function loadFooter() {
  fetch('footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load footer. Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('footer').innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading footer:', error);
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = 'Failed to load footer. Please try again later.';
      document.querySelector('footer').appendChild(errorElement);
    });
}

// Highlight today's opening hours
function highlightTodaysHours() {
  const today = new Date().getDay(); // Get the current day (0 = Sunday, 1 = Monday, etc.)
  const cards = document.querySelectorAll('.opening-hours-card');

  cards.forEach(card => {
    if (parseInt(card.getAttribute('data-day')) === today) {
      card.classList.add('highlight'); // Add the highlight class to today's card
    }
  });
}

// Function to scroll to contact form if URL hash indicates it
function checkForFormScroll() {
  if (window.location.hash === '#contact-form' || 
      window.location.hash === '#form' || 
      window.location.hash === '#book-tour-landing') {
    const formSection = document.querySelector('.contact-form-section-wrapper');
    
    if (formSection) {
      // Scroll to the form after a short delay to ensure page is loaded
      setTimeout(() => {
        formSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }
}

// Initialize all contact page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Initialize page-specific functionality
  highlightTodaysHours();
  
  // Check if should scroll to form based on URL hash
  checkForFormScroll();
});