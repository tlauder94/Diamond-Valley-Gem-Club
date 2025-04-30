document.addEventListener('DOMContentLoaded', () => {
  const eventsApiUrl = 'https://script.google.com/macros/s/AKfycbzDEbxudf6gPyCQe2KBI-Rf2Ddh49OPjPGEFL08S6nPTF-dVPnD7i8YwJAYx436KumX/exec?sheet=Events';

  // Fetch events from the API
  fetch(eventsApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched Events:', data);

      // Process the events for FullCalendar
      const processedEvents = data.map(event => {
        // Convert date from DD-MM-YYYY to YYYY-MM-DD
        const [day, month, year] = event.date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        // Convert start and end times to ISO format
        const startTime = `${formattedDate}T${String(event.startTime).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`;
        const endTime = `${formattedDate}T${String(event.endTime).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`;

        // Assign an image and className based on event type
        let image = '';
        let className = '';
        switch (event.type) {
          case 'Working Bee':
            image = '/images/library.jpg';
            className = 'event-working-bee';
            break;
          case 'Field Trip':
            image = '/images/Faceting.jpeg';
            className = 'event-field-trip';
            break;
          case 'Committee Meeting':
            image = '/images/cabs.jpg';
            className = 'event-committee-meeting';
            break;
          case 'Social Event':
            image = '/images/library.jpg';
            className = 'event-social-event';
            break;
          case 'AGM':
            image = '/images/Faceting.jpeg';
            className = 'event-agm';
            break;
          case 'Other Event':
            image = '/images/cabs.jpg';
            className = 'event-other-event';
            break;
          case 'Gem Show':
            image = '/images/library.jpg';
            className = 'event-gem-show';
            break;
          case 'Gem Identification':
            image = '/images/Faceting.jpeg';
            className = 'event-gem-identification';
            break;
          default:
            image = '/images/default-event.png';
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
          image: image,
          className: className,
        };
      });

      // Initialize the calendar with processed events
      initializeCalendar(processedEvents);

      // Populate the upcoming events section
      populateUpcomingEvents(processedEvents);
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
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

      // Populate modal with event details
      modalTitle.textContent = info.event.title;
      modalMonth.textContent = month;
      modalDay.textContent = day;
      modalTime.textContent = eventTime;
      modalDescription.textContent = info.event.extendedProps.description || 'No description available.';
      modalLocation.textContent = info.event.extendedProps.location || 'No location specified.';
      modalAvailableTo.textContent = info.event.extendedProps.availableTo || 'Open to everyone.';
      modalImage.src = info.event.extendedProps.image || '/images/default-event.png';

      // Show the modal
      modal.style.display = 'block';
    },
  });

  calendar.render();
}

// Populate Upcoming Events Section
function populateUpcomingEvents(events) {
  const upcomingEventsContainer = document.getElementById('upcoming-events-container');
  const upcomingEvents = events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  upcomingEventsContainer.innerHTML = '';

  if (upcomingEvents.length === 0) {
    upcomingEventsContainer.innerHTML = '<p>No upcoming events at the moment.</p>';
    return;
  }

  upcomingEvents.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.classList.add('upcoming-event');

    eventElement.innerHTML = `
      <div class="upcoming-event-date">
        <span class="upcoming-event-day">${new Date(event.start).getDate()}</span>
        <span class="upcoming-event-month">${new Date(event.start).toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div class="upcoming-event-details">
        <h3>${event.title}</h3>
        <p>${event.description || 'No description available.'}</p>
        <p><strong>Location:</strong> ${event.location || 'No location specified.'}</p>
        <p><strong>Time:</strong> ${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
      </div>
    `;

    upcomingEventsContainer.appendChild(eventElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('event-modal');
  const closeModalButton = document.getElementById('close-modal');

  // Close modal when the close button is clicked
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when the Escape key is pressed
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
    }
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});