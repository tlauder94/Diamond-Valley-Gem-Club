// Resources page JavaScript functionality

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

// Dropdown Newsletter text box when the header is clicked
function toggleNewsletterSection(elementId) {
  const year = elementId[21]; // Extract year (5 for 2025, 4 for 2024)
  const contentElement = document.getElementById("newsletter-text-202" + year);
  
  if (contentElement) {
    if (contentElement.style.display === "flex") {
      contentElement.style.display = "none";
    } else {
      contentElement.style.display = "flex";
    }
  }
}

// Initialize all resources page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Add event listeners to newsletter headers
  const newsletterHeader2025 = document.getElementById('newsletter-header-2025');
  const newsletterHeader2024 = document.getElementById('newsletter-header-2024');
  
  if (newsletterHeader2025) {
    newsletterHeader2025.addEventListener('click', () => {
      toggleNewsletterSection(newsletterHeader2025.id);
    });
  }
  
  if (newsletterHeader2024) {
    newsletterHeader2024.addEventListener('click', () => {
      toggleNewsletterSection(newsletterHeader2024.id);
    });
  }
});