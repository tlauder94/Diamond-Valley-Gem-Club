// Course pages JavaScript functionality (for main directory)

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
      // Extract just the footer content, not the full HTML document
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const footerContent = doc.querySelector('footer.site-footer');
      
      if (footerContent) {
        document.querySelector('footer').innerHTML = footerContent.outerHTML;
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

// Load course cost from local JSON file
async function loadCourseCost(courseName) {
  try {
    console.log(`💎 Loading ${courseName} course cost from local JSON...`);
    
    // Fetch course costs from local JSON file
    const response = await fetch('course-costs.json');
    if (!response.ok) {
      throw new Error(`Failed to load course costs. Status: ${response.status}`);
    }
    
    const data = await response.json();
    const course = data.courses.find(c => c.name === courseName);
    
    const costElement = document.getElementById('course-cost');
    
    if (course) {
      costElement.textContent = `$${course.cost}`;
      console.log('✅ Course cost loaded from local JSON:', course.cost);
    } else {
      costElement.textContent = "Course not found.";
      console.warn(`⚠️ ${courseName} course not found in local JSON`);
    }
  } catch (error) {
    console.error('❌ Error loading course cost from local JSON:', error);
    document.getElementById('course-cost').textContent = "Error loading cost.";
  }
}

// Initialize all course page functionality
// Auto-detect course name from page title
function initializeCourse() {
  document.addEventListener('DOMContentLoaded', () => {
    // Load shared components
    loadNavbar();
    loadFooter();
    
    // Auto-detect course name from the page title
    const pageTitle = document.title;
    if (pageTitle && document.getElementById('course-cost')) {
      loadCourseCost(pageTitle);
    }
  });
}

// Auto-initialize for course pages
// Check if this is a course page by looking for course-cost element
if (document.getElementById('course-cost') || document.readyState === 'loading') {
  initializeCourse();
}