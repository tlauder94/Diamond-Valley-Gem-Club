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
            image = '/images/library.jpg'; // Assigned image for Working Bee
            className = 'event-working-bee';
            break;
          case 'Field Trip':
            image = '/images/Faceting.jpeg'; // Assigned image for Field Trip
            className = 'event-field-trip';
            break;
          case 'Committee Meeting':
            image = '/images/cabs.jpg'; // Assigned image for Committee Meeting
            className = 'event-committee-meeting';
            break;
          case 'Social Event':
            image = '/images/library.jpg'; // Assigned image for Social Event
            className = 'event-social-event';
            break;
          case 'AGM':
            image = '/images/Faceting.jpeg'; // Assigned image for AGM
            className = 'event-agm';
            break;
          case 'Other Event':
            image = '/images/cabs.jpg'; // Assigned image for Other Event
            className = 'event-other-event';
            break;
          case 'Gem Show':
            image = '/images/library.jpg'; // Assigned image for Gem Show
            className = 'event-gem-show';
            break;
          case 'Gem Identification':
            image = '/images/Faceting.jpeg'; // Assigned image for Gem Identification
            className = 'event-gem-identification';
            break;
          default:
            image = '/images/default-event.png'; // Optional fallback image
            className = 'event-default';
        }

        return {
          title: event.title,
          start: startTime,
          end: endTime,
          description: event.description,
          location: event.location,
          category: event.type,
          availableTo: event.openTo, // Add "Who it is available to"
          image: image, // Use the assigned image
          className: className // Add className for styling
        };
      });

      // Initialize the calendar with processed events
      initializeCalendar(processedEvents);
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
      right: 'dayGridMonth,timeGridWeek'
    },
    events: events, // Pass the processed events to FullCalendar
    eventContent: function(arg) {
      // Format the start time as HH:mm am/pm
      const startTime = new Date(arg.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      return {
        html: `
          <div class="fc-event-time" style="font-size: 0.8rem; color: #fff; font-weight: bold;">${startTime}</div>
          <div class="fc-event-title">${arg.event.title}</div>
        `
      };
    },
    eventClick: function(info) {
      info.jsEvent.preventDefault();

      // Populate the modal with event details
      const modal = document.getElementById('event-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalDate = document.getElementById('modal-date');
      const modalTime = document.getElementById('modal-time');
      const modalDescription = document.getElementById('modal-description');
      const modalLocation = document.getElementById('modal-location');
      const modalAvailableTo = document.getElementById('modal-available-to');
      const modalImage = document.getElementById('modal-image');

      const startDate = new Date(info.event.start).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const startTime = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const endTime = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const eventTime = `${startTime} - ${endTime}`;

      modalTitle.textContent = info.event.title;
      modalDate.textContent = `Date: ${startDate}`;
      modalTime.textContent = `Time: ${eventTime}`;
      modalDescription.textContent = info.event.extendedProps.description;
      modalLocation.textContent = `Location: ${info.event.extendedProps.location}`;
      modalAvailableTo.textContent = `Available To: ${info.event.extendedProps.availableTo}`;
      modalImage.src = info.event.extendedProps.image; // Use the assigned image

      modal.style.display = 'block';
    }
  });

  calendar.render();
}