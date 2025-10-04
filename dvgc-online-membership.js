// DVGC Online Membership page JavaScript functionality

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
      document.querySelector('#footer-container').innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading footer:', error);
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = 'Failed to load footer. Please try again later.';
      document.querySelector('#footer-container').appendChild(errorElement);
    });
}

// Function to calculate fees
function calculateFees() {
  const rows = document.querySelectorAll('#personal-details-section .personal-details-container');
  let joiningFee = 0;
  let membershipCost = 0;
  let adultCount = 0;

  rows.forEach(row => {
    const dobField = row.querySelector('input[name="dob[]"]');
    const dobValue = dobField ? dobField.value : null;

    if (dobValue) {
      const dob = new Date(dobValue);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const isBirthdayPassed = today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      const finalAge = isBirthdayPassed ? age - 1 : age;

      // Add joining fee for each member
      joiningFee += 10;

      // Calculate membership cost based on age
      if (finalAge < 16) {
        membershipCost += 15; // Child under 16
      } else if (finalAge < 18) {
        membershipCost += 20; // Child 16–17
      } else {
        if (adultCount === 0) {
          membershipCost += 40; // First adult
        } else {
          membershipCost += 30; // Additional adults
        }
        adultCount++;
      }
    }
  });

  // Update the fee display
  document.getElementById('joining-fee').textContent = joiningFee;
  document.getElementById('membership-cost').textContent = membershipCost;
  document.getElementById('total-amount').textContent = joiningFee + membershipCost;
}

// Function to validate the form before submission
function validateForm(event) {
  const rows = document.querySelectorAll('#personal-details-section .inline-fields');
  const termsAccepted = document.getElementById('accept-terms').checked;
  const mobilePhone = document.getElementById('mobile-phone').value.trim();
  const addressFields = [
    document.getElementById('apt-number').value.trim(),
    document.getElementById('street').value.trim(),
    document.getElementById('suburb').value.trim(),
    document.getElementById('state').value.trim(),
    document.getElementById('postcode').value.trim(),
  ];

  let hasAdult = false;
  let hasValidRow = false;

  // Validate each row in Personal Details
  rows.forEach(row => {
    const firstName = row.querySelector('input[name="first-name[]"]').value.trim();
    const lastName = row.querySelector('input[name="last-name[]"]').value.trim();
    const dobValue = row.querySelector('input[name="dob[]"]').value;

    if (firstName && lastName && dobValue) {
      hasValidRow = true;

      const dob = new Date(dobValue);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const isBirthdayPassed = today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      const finalAge = isBirthdayPassed ? age - 1 : age;

      if (finalAge >= 18) {
        hasAdult = true;
      }
    }
  });

  // Check if all required fields are filled
  const isAddressComplete = addressFields.every(field => field !== '');

  // Error messages
  if (!hasValidRow) {
    alert('You must complete at least one row with First Name, Last Name, and D.O.B.');
    event.preventDefault();
    return false;
  }

  if (!hasAdult) {
    alert('At least one adult (18+) must be included in the form.');
    event.preventDefault();
    return false;
  }

  if (!isAddressComplete) {
    alert('All address fields (Number, Street, Suburb, State, Postcode) are mandatory.');
    event.preventDefault();
    return false;
  }

  if (!mobilePhone) {
    alert('Mobile Phone is mandatory.');
    event.preventDefault();
    return false;
  }

  if (!termsAccepted) {
    alert('You must accept the terms and conditions to proceed.');
    event.preventDefault();
    return false;
  }

  return true;
}

// Initialize all membership page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Initialize form functionality
  document.getElementById('add-person-button').addEventListener('click', () => {
    const personalDetailsSection = document.getElementById('personal-details-section');
    const newContainer = document.createElement('div');
    newContainer.classList.add('personal-details-container');

    newContainer.innerHTML = `
      <button type="button" class="remove-person-button" aria-label="Remove Section">&times;</button>
      <div class="personal-row">
        <div class="field-container title-container">
          <label for="title">Title</label>
          <select id="title" name="title[]" required>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
        </div>
        <div class="field-container first-name-container">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name[]" required>
        </div>
        <div class="field-container last-name-container">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name[]" required>
        </div>
      </div>
      <div class="personal-row">
        <div class="field-container placeholder-container"></div> <!-- Placeholder for Title -->
        <div class="field-container preferred-name-container">
          <label for="preferred-name">Preferred Name</label>
          <input type="text" id="preferred-name" name="preferred-name[]">
        </div>
        <div class="field-container dob-container">
          <label for="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob[]" required>
        </div>
      </div>
    `;

    personalDetailsSection.appendChild(newContainer);
    calculateFees(); // Recalculate fees after adding
  });

  // Add event listener to the initial remove button
  document.querySelectorAll('.remove-person-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.target.closest('.inline-fields').remove();
    });
  });

  // Recalculate fees whenever DOB is changed
  document.getElementById('personal-details-section').addEventListener('input', (event) => {
    if (event.target.name === 'dob[]') {
      calculateFees();
    }
  });

  // Handle removal of person sections
  document.getElementById('personal-details-section').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-person-button')) {
      setTimeout(() => calculateFees(), 0); // Delay to allow DOM update
    }
  });

  // Event listener to remove dynamically added sections
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-person-button')) {
      const container = event.target.closest('.personal-details-container');
      if (container) {
        container.remove();
        calculateFees(); // Recalculate after removal
      }
    }
  });

  // Attach validation to the form submission
  document.getElementById('membership-form').addEventListener('submit', validateForm);

  // Initial calculation
  calculateFees();
});