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
  const traderForm = document.getElementById('traderForm');
  if (traderForm) {
    traderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('trader-name').value,
        business: document.getElementById('trader-business').value,
        email: document.getElementById('trader-email').value,
        phone: document.getElementById('trader-phone').value,
        products: document.getElementById('trader-products').value,
        tables: document.getElementById('trader-tables').value,
        message: document.getElementById('trader-message').value
      };

      // Here you would typically send this to a server
      // For now, we'll just show an alert
      alert('Thank you for your interest! We will contact you soon with more details about trading at our gem show.');
      
      // Reset form
      traderForm.reset();
    });
  }
});

// Toggle trader dropdown
function toggleTraderInfo() {
  const dropdown = document.getElementById('traderDropdown');
  const arrow = document.querySelector('.dropdown-arrow');
  
  if (dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px') {
    dropdown.style.maxHeight = '0px';
    arrow.style.transform = 'rotate(0deg)';
  } else {
    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
    arrow.style.transform = 'rotate(180deg)';
  }
}

// Add to Google Calendar
function addToGoogleCalendar() {
  const eventDetails = {
    text: 'Annual Gem & Mineral Show 2026',
    dates: '20260509T090000/20260510T160000',
    details: 'Join us for two spectacular days celebrating the beauty and wonder of Earth\'s natural treasures. Saturday 9th May 9am-5pm, Sunday 10th May 9am-4pm. Admission $5 per person, children under 12 free with adult.',
    location: 'Eltham Community and Reception Centre, 801 Main Road, Eltham VIC 3095'
  };
  
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
  window.open(url, '_blank');
}

// Download ICS file for iCal/Outlook
function downloadICS() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Diamond Valley Gem Club//Gem Show//EN
BEGIN:VEVENT
UID:gem-show-2026@dvgc.org.au
DTSTAMP:20251021T000000Z
DTSTART:20260509T090000
DTEND:20260510T160000
SUMMARY:Annual Gem & Mineral Show 2026
DESCRIPTION:Join us for two spectacular days celebrating the beauty and wonder of Earth's natural treasures. Saturday 9th May 9am-5pm\\, Sunday 10th May 9am-4pm. Admission $5 per person\\, children under 12 free with adult.
LOCATION:Eltham Community and Reception Centre\\, 801 Main Road\\, Eltham VIC 3095
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gem-show-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
