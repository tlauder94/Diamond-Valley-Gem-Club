// Index page JavaScript functionality

// Close announcement banner function
function closeAnnouncementBanner() {
  const banner = document.querySelector('.annoucement-banner');
  banner.classList.remove('show');
}

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

// Preload all API data when Index page loads
function preloadAPIData() {
  console.log('🏠 Index page loaded - preloading all DVGC data...');
  window.DVGCCache.preloadAllData()
    .then((result) => {
      console.log('✅ Data preloading complete:', result);
      // Load upcoming events after cache is ready
      loadUpcomingEvents();
    })
    .catch((error) => {
      console.error('❌ Data preloading failed:', error);
      // Still try to load events even if preload fails
      loadUpcomingEvents();
    });
}

// Function to load upcoming events
async function loadUpcomingEvents() {
  const upcomingEventsContainer = document.getElementById('upcoming-events-container');

  try {
    console.log('🎯 Loading upcoming events from cache...');
    
    // Get upcoming events from cache
    const upcomingEvents = await window.DVGCCache.getUpcomingEvents(3);
    
    console.log('📅 Upcoming events loaded:', upcomingEvents.length);

    // Clear any existing content
    upcomingEventsContainer.innerHTML = '';

    if (upcomingEvents.length === 0) {
      upcomingEventsContainer.innerHTML = '<p class="no-events">No upcoming events scheduled.</p>';
      return;
    }

    // Loop through the events and create cards
    upcomingEvents.forEach(event => {
      // Convert date from DD-MM-YYYY to a readable format
      const [day, month, year] = event.date.split('-');
      const formattedDate = `${day} ${new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'long' })}, ${year}`;

      // Format start and end times
      const formattedStartTime = formatTime(event.startTime);
      const formattedEndTime = formatTime(event.endTime);

      // Create the event card
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');

      // Add the image container
      const eventCardImage = document.createElement('div');
      eventCardImage.classList.add('event-card-image');
      const img = document.createElement('img');
      img.src = event.image; // Using image from cache
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
  } catch (error) {
    console.error('❌ Error loading upcoming events:', error);
    upcomingEventsContainer.innerHTML = '<p>Failed to load upcoming events. Please try again later.</p>';
  }
}

// Function to format time to 12-hour format with AM/PM
function formatTime(time) {
  const timeString = String(time).padStart(4, '0'); // Ensure 4-digit format
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = timeString.slice(2, 4);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  return `${formattedHours}:${minutes}${period}`;
}

// Highlight today's opening hours card
function highlightTodaysHours() {
  const today = new Date().getDay(); // Get the current day (0 = Sunday, 1 = Monday, etc.)
  const cards = document.querySelectorAll('.opening-hours-card');

  cards.forEach(card => {
    if (parseInt(card.getAttribute('data-day')) === today) {
      card.classList.add('highlight'); // Add the highlight class to today's card
    }
  });
}

// Load announcements
async function loadAnnouncements() {
  try {
    console.log('📢 Loading announcements from cache...');
    
    // Get announcements from cache
    const announcements = await window.DVGCCache.getAnnouncements();
    
    console.log('📋 Announcements loaded:', announcements.length);

    const banner = document.querySelector('.annoucement-banner');
    
    if (announcements.length > 0) {
      const announcement = announcements[0];
      document.getElementById('annoucement-header').textContent = announcement.title || 'Announcement';
      document.getElementById('annoucement-text').textContent = announcement.message || 'No message provided.';
      banner.classList.add('show');
    } else {
      console.log('ℹ️ No announcements to display.');
      banner.classList.remove('show');
    }
  } catch (error) {
    console.error('❌ Error loading announcements:', error);
    document.querySelector('.annoucement-banner').classList.remove('show');
  }
}

// Load random courses for Index page display
function loadRandomCourses() {
  const courseGrid = document.getElementById('index-course-grid');
  console.log('🎓 Starting course loading...');

  // Fetch the courses.html file
  fetch('courses.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load courses. Status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Select all course cards
      const courseCards = Array.from(doc.querySelectorAll('.course-card'));
      console.log('📚 Total course cards found:', courseCards.length);

      // Randomly select 3 courses
      const shuffledCourses = courseCards.sort(() => 0.5 - Math.random());
      const selectedCourses = shuffledCourses.slice(0, 3);
      console.log('🎯 Selected courses for display:', selectedCourses.length);

      // Clear the course grid
      courseGrid.innerHTML = '';

      // Append the selected courses to the Index page
      selectedCourses.forEach(courseCard => {
        // Create a new card element
        const card = document.createElement('div');
        card.classList.add('index-course-card');

        // Extract the image, title, description, and link from the original course card
        const imageElement = courseCard.querySelector('img');
        if (imageElement) {
          imageElement.classList.add('course-image'); // Ensure the class is applied
        }
        const image = imageElement?.outerHTML || '';
        const title = courseCard.querySelector('h2')?.outerHTML || '';
        const description = courseCard.querySelector('p')?.outerHTML || '';
        const link = courseCard.querySelector('a.course-button')?.outerHTML || '';

        // Build the card's inner HTML
        card.innerHTML = `
          ${image}
          ${title}
          ${description}
          ${link}
        `;

        // Append the card to the grid
        courseGrid.appendChild(card);
        console.log('➕ Added course card:', card.querySelector('h2')?.textContent);
      });
      
      console.log('✅ Finished adding all course cards. Total in grid:', courseGrid.children.length);
    })
    .catch(error => {
      console.error('Error fetching courses:', error);
      courseGrid.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
    });
}

// Initialize all Index page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load shared components
  loadNavbar();
  loadFooter();
  
  // Initialize page-specific functionality
  preloadAPIData();
  highlightTodaysHours();
  loadAnnouncements();
  loadRandomCourses();
  
  // Add event listener for close announcement button
  const closeButton = document.getElementById('close-announcement');
  if (closeButton) {
    closeButton.addEventListener('click', closeAnnouncementBanner);
  }
});