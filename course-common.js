// Course pages JavaScript functionality (for courses subdirectory)

// Dynamically load the shared navbar with path fixes for subdirectory
function loadNavbar() {
  fetch('../navbar.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load navbar. Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('header').innerHTML = data;
      
      // Fix relative paths for course subdirectory
      const navbar = document.querySelector('header');
      
      // Fix logo image path
      const logoImg = navbar.querySelector('.logo');
      if (logoImg) {
        logoImg.src = '../images/Logo Side.png';
      }
      
      // Fix navigation links
      const navLinks = navbar.querySelectorAll('a[href]');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('../')) {
          link.setAttribute('href', '../' + href);
        }
      });
    })
    .catch(error => {
      console.error('Error loading navbar:', error);
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = 'Failed to load navbar. Please try again later.';
      document.querySelector('header').appendChild(errorElement);
    });
}

// Dynamically load the shared footer with path fixes for subdirectory
function loadFooter() {
  fetch('../footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load footer. Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      // Extract just the footer content, not the full HTML document
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const footerContent = doc.querySelector('footer.site-footer');
      
      if (footerContent) {
        document.querySelector('footer').innerHTML = footerContent.outerHTML;
        
        // Fix relative paths for course subdirectory
        const footer = document.querySelector('footer');
        
        // Fix footer image paths
        const footerImages = footer.querySelectorAll('img[src]');
        footerImages.forEach(img => {
          const src = img.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('../')) {
            img.setAttribute('src', '../' + src);
          }
        });
        
        // Fix footer links
        const footerLinks = footer.querySelectorAll('a[href]');
        footerLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('mailto:')) {
            link.setAttribute('href', '../' + href);
          }
        });
      } else {
        // Fallback if footer structure is different
        document.querySelector('footer').innerHTML = data;
      }
    })
    .catch(error => {
      console.error('Error loading footer:', error);
      const errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      errorElement.textContent = 'Failed to load footer. Please try again later.';
      document.querySelector('footer').appendChild(errorElement);
    });
}

// Load upcoming course events - filter for current course
function loadUpcomingCourses(courseName) {
  const events = [
    {
      title: 'Cabochon Cutting Workshop',
      courseType: 'Cabochon Cutting',
      start: '2025-06-15T10:00:00',
      end: '2025-06-15T16:00:00',
      description: 'Learn the art of shaping and polishing gemstones into smooth, domed cabochons.',
      image: '../images/cabs.jpg',
      type: 'course',
      spacesAvailable: 10
    },
    {
      title: 'Faceting Masterclass',
      courseType: 'Faceting',
      start: '2025-07-10T09:00:00',
      end: '2025-07-10T15:00:00',
      description: 'Master the precision art of gemstone faceting.',
      image: '../images/faceting.png',
      type: 'course',
      spacesAvailable: 5
    },
    {
      title: 'Jewellery Making Workshop',
      courseType: 'Jewellery Making',
      start: '2025-08-05T10:00:00',
      end: '2025-08-05T16:00:00',
      description: 'Create beautiful jewelry pieces.',
      image: '../images/jewellery1.jpeg',
      type: 'course',
      spacesAvailable: 8
    },
    {
      title: 'Lost Wax Casting',
      courseType: 'Lost Wax Casting',
      start: '2025-08-20T09:00:00',
      end: '2025-08-20T15:00:00',
      description: 'Learn the ancient art of lost wax casting.',
      image: '../images/lostwax.jpg',
      type: 'course',
      spacesAvailable: 6
    },
    {
      title: 'Rock Carving Workshop',
      courseType: 'Rock Carving',
      start: '2025-09-10T10:00:00',
      end: '2025-09-10T16:00:00',
      description: 'Carve beautiful sculptures from stone.',
      image: '../images/rc1.jpg',
      type: 'course',
      spacesAvailable: 7
    },
    {
      title: 'Rock Slabbing Session',
      courseType: 'Rock Slabbing',
      start: '2025-09-25T10:00:00',
      end: '2025-09-25T16:00:00',
      description: 'Learn to cut rocks into beautiful slabs.',
      image: '../images/rs1.webp',
      type: 'course',
      spacesAvailable: 12
    },
    {
      title: 'Silversmithing Workshop',
      courseType: 'Silversmithing',
      start: '2025-10-15T10:00:00',
      end: '2025-10-15T16:00:00',
      description: 'Master the art of working with silver.',
      image: '../images/ss1.jpg',
      type: 'course',
      spacesAvailable: 4
    },
    {
      title: 'Viking Weaving Class',
      courseType: 'Viking Weaving',
      start: '2025-11-05T10:00:00',
      end: '2025-11-05T16:00:00',
      description: 'Learn traditional Viking weaving techniques.',
      image: '../images/vw.jpg',
      type: 'course',
      spacesAvailable: 9
    },
    {
      title: 'Wire Wrapping Workshop',
      courseType: 'Wire Wrapping',
      start: '2025-11-20T10:00:00',
      end: '2025-11-20T16:00:00',
      description: 'Create beautiful wire-wrapped jewelry.',
      image: '../images/wirewrapping.jpeg',
      type: 'course',
      spacesAvailable: 10
    }
  ];

  const upcomingCoursesContainer = document.getElementById('upcoming-courses-container');

  if (upcomingCoursesContainer) {
    // Filter events for this specific course
    const filteredEvents = events.filter(event => 
      event.type === 'course' && 
      (!courseName || event.courseType === courseName)
    );
    
    if (filteredEvents.length === 0) {
      upcomingCoursesContainer.innerHTML = '<p class="no-courses">No upcoming dates currently scheduled. Check back soon!</p>';
      return;
    }
    
    filteredEvents.forEach(event => {
        const eventDate = new Date(event.start);
        const month = eventDate.toLocaleString('default', { month: 'short' });
        const day = eventDate.getDate();
        const startTime = new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const endTime = new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const eventTime = `${startTime} - ${endTime}`;

        const eventHTML = `
          <div class="event">
            <div class="event-date">
              <div class="event-month">${month}</div>
              <div class="event-day">${day}</div>
            </div>
            <img src="${event.image}" alt="${event.title}" class="event-image">
            <div class="event-details">
              <h3>${event.title}</h3>
              <p class="event-time">${eventTime}</p>
              <p class="event-spaces">
                <span class="spaces-label">Spaces:</span> ${event.spacesAvailable}
              </p>
            </div>
          </div>
        `;

        upcomingCoursesContainer.innerHTML += eventHTML;
      });
  }
}

// Load course cost from cache
async function loadCourseCost(courseName) {
  try {
    console.log(`💎 Loading ${courseName} course cost from cache...`);
    
    // Get course cost from cache
    const courseCost = await window.DVGCCache.getCourseCost(courseName);
    
    const costElement = document.getElementById('course-cost');
    
    if (courseCost) {
      costElement.textContent = `$${courseCost}`;
      console.log('✅ Course cost loaded:', courseCost);
    } else {
      costElement.textContent = "Course not found.";
      console.warn(`⚠️ ${courseName} course not found in cache`);
    }
  } catch (error) {
    console.error('❌ Error loading course cost:', error);
    document.getElementById('course-cost').textContent = "Error loading cost.";
  }
}

// Initialize all course page functionality
// This function should be called with the specific course name
function initializeCourse(courseName) {
  document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadNavbar();
    loadFooter();
    
    // Load course-specific content
    loadUpcomingCourses(courseName);
    
    // Load course cost if courseName is provided
    if (courseName) {
      loadCourseCost(courseName);
    }
  });
}

// Export the initialization function for individual course pages
window.CoursePageLoader = {
  initialize: initializeCourse
};