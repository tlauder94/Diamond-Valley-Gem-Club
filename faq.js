// FAQ page JavaScript functionality

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

// Dropdown FAQ text box when the header is clicked (for boxes 1-9)
function toggleFAQ(elementId) {
  const faqNumber = elementId.replace('faq-box-header-', '');
  const textElement = document.getElementById("faq-text-" + faqNumber);
  
  if (textElement) {
    if (textElement.style.display === "flex") {
      textElement.style.display = "none";
    } else {
      textElement.style.display = "flex";
    }
  }
}

// Initialize all FAQ page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Add event listeners to all FAQ headers
  for (let i = 1; i <= 11; i++) {
    const faqHeader = document.getElementById(`faq-box-header-${i}`);
    if (faqHeader) {
      faqHeader.addEventListener('click', () => {
        toggleFAQ(faqHeader.id);
      });
    }
  }
});