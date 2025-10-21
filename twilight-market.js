// Load navbar and footer
document.addEventListener('DOMContentLoaded', function() {
  // Load navbar
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading navbar:', error));

  // Load footer
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));

  // Handle form submission
  const stallholderForm = document.getElementById('stallholderForm');
  if (stallholderForm) {
    stallholderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('stall-name').value,
        business: document.getElementById('stall-business').value,
        email: document.getElementById('stall-email').value,
        phone: document.getElementById('stall-phone').value,
        products: document.getElementById('stall-products').value,
        stallSize: document.getElementById('stall-size').value,
        message: document.getElementById('stall-message').value
      };

      // Here you would typically send this to a server
      // For now, we'll just show an alert
      alert('Thank you for your interest! We will contact you soon with more details about having a stall at our Twilight Market.');
      
      // Reset form
      stallholderForm.reset();
    });
  }
});
