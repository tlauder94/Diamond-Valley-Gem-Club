/**
 * Opening Hours Manager
 * Loads and displays club opening hours from JSON
 */

class OpeningHoursManager {
  constructor() {
    this.openingHours = null;
    this.isLoaded = false;
  }

  /**
   * Load opening hours from JSON file
   */
  async loadOpeningHours() {
    if (this.isLoaded) {
      return this.openingHours;
    }

    try {
      console.log('📅 Loading opening hours...');
      const response = await fetch('opening-hours.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load opening hours: ${response.status}`);
      }
      
      const data = await response.json();
      this.openingHours = data.openingHours;
      this.isLoaded = true;
      
      console.log('✅ Opening hours loaded successfully');
      return this.openingHours;
      
    } catch (error) {
      console.error('❌ Failed to load opening hours:', error);
      // Return fallback data
      return this.getFallbackHours();
    }
  }

  /**
   * Generate opening hours HTML
   */
  async generateOpeningHoursHTML() {
    const hours = await this.loadOpeningHours();
    
    let html = '';
    hours.forEach(dayInfo => {
      const timeHTML = dayInfo.status === 'closed' 
        ? '<p>Closed</p>'
        : dayInfo.times.map(time => `<p>${time}</p>`).join('');
      
      html += `
        <div class="opening-hours-card" data-day="${dayInfo.dayNumber}">
          <h3>${dayInfo.day}</h3>
          ${timeHTML}
        </div>
      `;
    });
    
    return html;
  }

  /**
   * Load opening hours into existing containers
   */
  async loadIntoContainers() {
    try {
      const containers = document.querySelectorAll('.opening-hours-cards');
      
      if (containers.length === 0) {
        console.log('ℹ️ No opening hours containers found on this page');
        return;
      }
      
      const hoursHTML = await this.generateOpeningHoursHTML();
      
      containers.forEach(container => {
        container.innerHTML = hoursHTML;
      });
      
      console.log(`✅ Opening hours loaded into ${containers.length} container(s)`);
      
      // Highlight today's hours if the function exists
      if (typeof highlightTodaysHours === 'function') {
        highlightTodaysHours();
      }
      
    } catch (error) {
      console.error('❌ Failed to load opening hours into containers:', error);
    }
  }

  /**
   * Get today's opening hours
   */
  async getTodaysHours() {
    const hours = await this.loadOpeningHours();
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    return hours.find(dayInfo => dayInfo.dayNumber === today);
  }

  /**
   * Check if club is currently open
   */
  async isCurrentlyOpen() {
    const todaysHours = await this.getTodaysHours();
    
    if (!todaysHours || todaysHours.status === 'closed') {
      return false;
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format
    
    // Check if current time falls within any of today's time slots
    return todaysHours.times.some(timeSlot => {
      const [startTime, endTime] = timeSlot.split(' - ');
      const start = this.timeStringToNumber(startTime);
      const end = this.timeStringToNumber(endTime);
      
      return currentTime >= start && currentTime <= end;
    });
  }

  /**
   * Convert time string (e.g., "7:30pm") to number (e.g., 1930)
   */
  timeStringToNumber(timeString) {
    const [time, period] = timeString.toLowerCase().split(/([ap]m)/);
    const [hours, minutes] = time.split(':');
    
    let hour24 = parseInt(hours, 10);
    if (period === 'pm' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'am' && hour24 === 12) {
      hour24 = 0;
    }
    
    return hour24 * 100 + parseInt(minutes || '0', 10);
  }

  /**
   * Fallback opening hours data (in case JSON fails to load)
   */
  getFallbackHours() {
    console.log('⚠️ Using fallback opening hours data');
    return [
      { day: "Monday", dayNumber: 1, times: ["7:30pm - 9:30pm"], status: "open" },
      { day: "Tuesday", dayNumber: 2, times: ["10:30am - 3:00pm", "7:30pm - 9:30pm"], status: "open" },
      { day: "Wednesday", dayNumber: 3, times: ["10:30am - 3:00pm"], status: "open" },
      { day: "Thursday", dayNumber: 4, times: ["7:30pm - 10:00pm"], status: "open" },
      { day: "Friday", dayNumber: 5, times: [], status: "closed" },
      { day: "Saturday", dayNumber: 6, times: ["10:30am - 4:00pm"], status: "open" },
      { day: "Sunday", dayNumber: 0, times: [], status: "closed" }
    ];
  }
}

// Create global instance
window.OpeningHoursManager = new OpeningHoursManager();

// Auto-load opening hours when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.OpeningHoursManager.loadIntoContainers();
});

console.log('📅 Opening Hours Manager initialized');