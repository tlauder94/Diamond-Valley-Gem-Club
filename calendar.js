// Calendar page JavaScript functionality

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

document.addEventListener('DOMContentLoaded', async () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  try {
    console.log('📅 Loading calendar events from cache...');
    
    // Get events from cache
    const events = await window.DVGCCache.getEvents();
    
    console.log('📊 Calendar events loaded:', events.length);

    // Process the events for FullCalendar
    const processedEvents = events.map(event => {
      // Convert date from DD-MM-YYYY to YYYY-MM-DD
      const [day, month, year] = event.date.split('-');
      const formattedDate = `${year}-${month}-${day}`;

      // Convert start and end times to ISO format
      const startTime = `${formattedDate}T${String(event.startTime).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`;
      const endTime = `${formattedDate}T${String(event.endTime).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`;

      // Assign className based on event type
      let className = '';
      switch (event.type) {
        case 'Working Bee':
          className = 'event-working-bee';
          break;
        case 'Field Trip':
          className = 'event-field-trip';
          break;
        case 'Committee Meeting':
          className = 'event-committee-meeting';
          break;
        case 'Social Event':
          className = 'event-social-event';
          break;
        case 'AGM':
          className = 'event-agm';
          break;
        case 'Other Event':
          className = 'event-other-event';
          break;
        case 'Gem Show':
          className = 'event-gem-show';
          break;
        case 'Gem Identification':
          className = 'event-gem-identification';
          break;
        default:
          className = 'event-default';
      }

      return {
        title: event.title,
        start: startTime,
        end: endTime,
        description: event.description,
        location: event.location,
        category: event.type,
        availableTo: event.openTo,
        image: event.image, // Using image from cache
        className: className,
      };
    });

    // Initialize the calendar with processed events
    initializeCalendar(processedEvents);
  } catch (error) {
    console.error('❌ Error loading calendar events:', error);
    // Initialize empty calendar if data fails to load
    initializeCalendar([]);
  }
});

// Initialize FullCalendar
function initializeCalendar(events) {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    events: events,
    eventContent: function(arg) {
      const startTime = new Date(arg.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      return {
        html: `
          <div class="fc-event-time" style="font-size: 0.8rem; color: #fff; font-weight: bold;">${startTime}</div>
          <div class="fc-event-title">${arg.event.title}</div>
        `,
      };
    },
    eventClick: function(info) {
      info.jsEvent.preventDefault(); // Prevent default browser behavior

      // Get modal elements
      const modal = document.getElementById('event-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalMonth = document.getElementById('modal-month');
      const modalDay = document.getElementById('modal-day');
      const modalTime = document.getElementById('modal-time');
      const modalDescription = document.getElementById('modal-description');
      const modalLocation = document.getElementById('modal-location');
      const modalAvailableTo = document.getElementById('modal-available-to');
      const modalImage = document.getElementById('modal-image');

      // Extract event details
      const startDate = new Date(info.event.start);
      const month = startDate.toLocaleString('default', { month: 'short' });
      const day = startDate.getDate();
      const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const endTime = info.event.end
        ? new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        : 'N/A';
      const eventTime = `${startTime} - ${endTime}`;

      // Assign an image based on event type (same logic as the events list)
      let image = '';
      switch (info.event.extendedProps.category) {
        case 'Working Bee':
          image = "images/workingbee.jpg";
          break;
        case 'Field Trip':
          image = "images/fieldtrip.jpg";
          break;
        case 'Committee Meeting':
          image = "images/committee.jpg";
          break;
        case 'Social Event':
          image = "images/social.jpg";
          break;
        case 'AGM':
          image = "images/committee.jpeg";
          break;
        case 'Other Event':
          image = "images/otherevent.jpg";
          break;
        case 'Gem Show':
          image = "images/gemshow.jpg";
          break;
        case 'Gem Identification':
          image = "images/gemid.jpg";
          break;
        default:
          image = "images/default-event.png";
      }

      // Populate modal with event details
      modalTitle.textContent = info.event.title;
      modalMonth.textContent = month;
      modalDay.textContent = day;
      modalTime.textContent = eventTime;
      modalDescription.textContent = info.event.extendedProps.description || 'No description available.';
      modalLocation.textContent = info.event.extendedProps.location || 'No location specified.';
      modalAvailableTo.textContent = info.event.extendedProps.availableTo || 'Open to everyone.';
      modalImage.src = image; // Use the assigned image

      // Show the modal
      modal.style.display = 'block';
    },
  });

  calendar.render();
}

// Get modal elements
const modal = document.getElementById('event-modal');
const closeButton = document.querySelector('.close-button'); // Assuming the close button has this class

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when the X button is clicked
if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}

// Close modal when the Escape key is pressed
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const upcomingEventsContainer = document.getElementById('upcoming-events-container');
  const eventTypeFilter = document.getElementById('event-type-filter');
  let allEvents = []; // Store all events for filtering

  // Fetch events from the API
  const eventsApiUrl = 'https://script.google.com/macros/s/AKfycby5-Sv7WigXltzCjVL_EtgQjYYyH2_rMpGx8HAsu93Pe8vjwn1LxX6NrvJl3fM61WuQ/exec?sheet=Events';

  fetch(eventsApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched Events:', data);
      allEvents = data; // Store all events
      displayEvents(allEvents.slice(0, 6)); // Display the next 6 events initially
    })
    .catch(error => {
      console.error('Error fetching events:', error);
      upcomingEventsContainer.innerHTML = '<p>Failed to load upcoming events. Please try again later.</p>';
    });

    
  // Function to format time to 12-hour format with AM/PM
  function formatTime(time) {
    // Ensure the time is a 4-digit string (e.g., "0700")
    const timeString = String(time).padStart(4, '0');
    const hours = parseInt(timeString.slice(0, 2), 10);
    const minutes = timeString.slice(2, 4);

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format, with 12 instead of 0

    return `${formattedHours}:${minutes}${period}`;
  }

  // Function to display events
  function displayEvents(events) {
    // Clear the container
    upcomingEventsContainer.innerHTML = '';

    if (events.length === 0) {
      // Display a fallback message if no events are found
      upcomingEventsContainer.innerHTML = `
        <div class="no-events-message">
          <p>No events to display for this category. Check out our <a href="calendar.html">calendar</a> for more events or explore other categories!</p>
        </div>
      `;
      return; // Exit the function early
    }

    // Loop through the events and create cards
    events.forEach(event => {
      // Convert date from DD-MM-YYYY to a readable format
      const [day, month, year] = event.date.split('-');
      const formattedDate = `${day} ${new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'long' })}, ${year}`;

      // Format start and end times
      const formattedStartTime = formatTime(event.startTime);
      const formattedEndTime = formatTime(event.endTime);

      // Assign an image based on event type
      let image = '';
      switch (event.type) {
        case 'Working Bee':
          image = "images/workingbee.jpg";
          break;
        case 'Field Trip':
          image = "images/fieldtrip.jpg";
          break;
        case 'Committee Meeting':
          image = "images/committee.jpg";
          break;
        case 'Social Event':
          image = "images/social.jpg";
          break;
        case 'AGM':
          image = "images/committee.jpeg";
          break;
        case 'Other Event':
          image = "images/otherevent.jpg";
          break;
        case 'Gem Show':
          image = "images/gemshow.jpg";
          break;
        case 'Gem Identification':
          image = "images/gemid.jpg";
          break;
        default:
          image = "images/default-event.png";
      }

      // Create the event card
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');

      // Add the image container
      const eventCardImage = document.createElement('div');
      eventCardImage.classList.add('event-card-image');
      const img = document.createElement('img');
      img.src = image;
      img.alt = event.title;
      eventCardImage.appendChild(img);

      // Add the content container
      const eventCardContent = document.createElement('div');
      eventCardContent.classList.add('event-card-content');

      // Add the event info
      const eventInfo = document.createElement('div');
      eventInfo.classList.add('event-info');
      eventInfo.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
        <p><strong>Location:</strong> ${event.location || 'No location specified'}</p>
        <p><strong>Who Can Attend:</strong> ${event.openTo || 'Open to everyone'}</p>
      `;

      // Add the "Add to Calendar" button
      const addToCalendarButton = document.createElement('button');
      addToCalendarButton.classList.add('add-to-calendar-button');
      addToCalendarButton.textContent = "Add to Calendar";
      addToCalendarButton.onclick = () => {
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          event.title
        )}&dates=${encodeURIComponent(event.date)}&details=${encodeURIComponent(
          `Time: ${formattedStartTime} - ${formattedEndTime}\nLocation: ${event.location}\nWho Can Attend: ${event.openTo}`
        )}`;
        window.open(calendarUrl, '_blank');
      };

      // Append everything to the event card
      eventCardContent.appendChild(eventInfo);
      eventCardContent.appendChild(addToCalendarButton);
      eventCard.appendChild(eventCardImage);
      eventCard.appendChild(eventCardContent);
      upcomingEventsContainer.appendChild(eventCard);
    });
  }

  // Event listener for the dropdown filter
  eventTypeFilter.addEventListener('change', () => {
    const selectedType = eventTypeFilter.value;
    if (selectedType === 'all') {
      displayEvents(allEvents.slice(0, 6)); // Show the next 6 events
    } else {
      const filteredEvents = allEvents.filter(event => event.type === selectedType);
      displayEvents(filteredEvents.slice(0, 6)); // Show the next 6 filtered events
    }
  });
});