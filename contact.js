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

// Initialize contact form toggle functionality
function initContactFormToggle() {
  const toggleButton = document.getElementById('contact-form-btn');
  const formContainer = document.getElementById('contact-form-container');
  
  if (toggleButton && formContainer) {
    toggleButton.addEventListener('click', function() {
      const isHidden = formContainer.classList.contains('hidden');
      
      if (isHidden) {
        // Show the form
        formContainer.classList.remove('hidden');
        toggleButton.classList.add('expanded');
        toggleButton.querySelector('.button-text').textContent = 'Click to close';
        toggleButton.querySelector('.button-arrow').textContent = '▲';
        
        // Smooth scroll to form
        setTimeout(() => {
          formContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }, 100);
      } else {
        // Hide the form
        formContainer.classList.add('hidden');
        toggleButton.classList.remove('expanded');
        toggleButton.querySelector('.button-text').textContent = 'Email Us';
        toggleButton.querySelector('.button-arrow').textContent = '▼';
      }
    });
  }
}

// Initialize all contact page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Initialize page-specific functionality
  highlightTodaysHours();
  initContactFormToggle();
});