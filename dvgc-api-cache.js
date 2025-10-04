/**
 * DVGC API Cache Manager
 * Centralized caching system for all Google Sheets API data
 * Loads data once and serves it throughout the site
 */

class DVGCApiCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.isLoading = new Map();
    
    // API Endpoints Configuration
    this.endpoints = {
      events: 'https://script.google.com/macros/s/AKfycby5-Sv7WigXltzCjVL_EtgQjYYyH2_rMpGx8HAsu93Pe8vjwn1LxX6NrvJl3fM61WuQ/exec?sheet=Events',
      announcements: 'https://script.google.com/macros/s/AKfycby5-Sv7WigXltzCjVL_EtgQjYYyH2_rMpGx8HAsu93Pe8vjwn1LxX6NrvJl3fM61WuQ/exec?sheet=Announcement',
      courses: 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgAVUnOJDWSIpG9P_OXnRAYn5tIerxJDE3p7qyI1rtIxvlkqXtnKthD2PAPbQQB-NQz5eIVCO5JqOhnxwutuMOeeA4yu93LZtDbw8kQNe5sU4g2InX7JvJuf-a80spCRITI8umXmsbai4oDbqCoIcUgmM_9MWq3asPsXfDkawc4WnLsOCj0uLITK333KgGNGRi78lxEOWjZZdvam2MtmOXQVNbwijjATyErsFJcYhD73ZrQoWs0jHx2uvlhWcqdTo8W9PydWmoj9KVqCCUb7Ufb47e4zGjyiWtv3Eg1GjoLhAsiZEA&lib=MOZjIhuefjGEGvwvHrh3M0TbZ7jG6IkQL'
    };

    // Initialize cache from localStorage if available
    this.loadFromStorage();
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(dataType) {
    const timestamp = this.cacheTimestamps.get(dataType);
    if (!timestamp) return false;
    
    return (Date.now() - timestamp) < this.cacheDuration;
  }

  /**
   * Get data from cache or fetch if not available/expired
   */
  async getData(dataType) {
    // Return cached data if valid
    if (this.isCacheValid(dataType) && this.cache.has(dataType)) {
      console.log(`📋 Serving ${dataType} from cache`);
      return this.cache.get(dataType);
    }

    // Prevent multiple simultaneous requests for the same data
    if (this.isLoading.get(dataType)) {
      console.log(`⏳ Waiting for ${dataType} request in progress...`);
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading.get(dataType)) {
            clearInterval(checkInterval);
            resolve(this.cache.get(dataType));
          }
        }, 100);
      });
    }

    // Fetch fresh data
    return this.fetchData(dataType);
  }

  /**
   * Fetch data from API and cache it
   */
  async fetchData(dataType) {
    this.isLoading.set(dataType, true);
    
    try {
      console.log(`🌐 Fetching fresh ${dataType} data...`);
      
      const response = await fetch(this.endpoints[dataType]);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the data
      this.cache.set(dataType, data);
      this.cacheTimestamps.set(dataType, Date.now());
      
      // Save to localStorage for persistence
      this.saveToStorage();
      
      console.log(`✅ ${dataType} data cached successfully (${data.length} items)`);
      
      return data;
      
    } catch (error) {
      console.error(`❌ Failed to fetch ${dataType}:`, error);
      
      // Return stale cache if available, otherwise empty array
      if (this.cache.has(dataType)) {
        console.log(`⚠️ Returning stale ${dataType} cache due to fetch error`);
        return this.cache.get(dataType);
      }
      
      throw error;
      
    } finally {
      this.isLoading.set(dataType, false);
    }
  }

  /**
   * Get specific event types for image mapping
   */
  async getEvents() {
    const events = await this.getData('events');
    
    // Process events with image mapping
    return events.map(event => {
      // Convert date from DD-MM-YYYY to YYYY-MM-DD for easier processing
      const [day, month, year] = event.date.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Assign image based on event type
      let image = '';
      switch (event.type) {
        case 'Working Bee':
          image = 'images/workingbee.jpg';
          break;
        case 'Field Trip':
          image = 'images/fieldtrip.jpg';
          break;
        case 'Committee Meeting':
          image = 'images/committee.jpg';
          break;
        case 'Social Event':
          image = 'images/social.jpg';
          break;
        case 'AGM':
          image = 'images/committee.jpeg';
          break;
        case 'Other Event':
          image = 'images/otherevent.jpg';
          break;
        case 'Gem Show':
          image = 'images/gemshow.jpg';
          break;
        case 'Gem Identification':
          image = 'images/gemid.jpg';
          break;
        default:
          image = 'images/default-event.png';
      }
      
      return {
        ...event,
        formattedDate,
        image
      };
    });
  }

  /**
   * Get announcements
   */
  async getAnnouncements() {
    return this.getData('announcements');
  }

  /**
   * Get course cost by name
   */
  async getCourseCost(courseName) {
    const courses = await this.getData('courses');
    const course = courses.find(c => c.name === courseName);
    return course ? course.cost : null;
  }

  /**
   * Get all courses
   */
  async getCourses() {
    return this.getData('courses');
  }

  /**
   * Get upcoming events (next N events)
   */
  async getUpcomingEvents(limit = 3) {
    const events = await this.getEvents();
    const today = new Date();
    
    // Filter future events
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.formattedDate);
      return eventDate >= today;
    });
    
    // Sort by date
    upcomingEvents.sort((a, b) => new Date(a.formattedDate) - new Date(b.formattedDate));
    
    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  }

  /**
   * Preload all data (call this on home page)
   */
  async preloadAllData() {
    console.log('🚀 Preloading all DVGC API data...');
    
    const promises = [
      this.getData('events'),
      this.getData('announcements'),
      this.getData('courses')
    ];
    
    try {
      const results = await Promise.allSettled(promises);
      
      let successful = 0;
      let failed = 0;
      
      results.forEach((result, index) => {
        const dataType = Object.keys(this.endpoints)[index];
        if (result.status === 'fulfilled') {
          successful++;
          console.log(`✅ ${dataType} preloaded`);
        } else {
          failed++;
          console.error(`❌ ${dataType} failed:`, result.reason);
        }
      });
      
      console.log(`📊 Preload complete: ${successful} successful, ${failed} failed`);
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('dvgcDataLoaded', {
        detail: { successful, failed, total: promises.length }
      }));
      
      return { successful, failed };
      
    } catch (error) {
      console.error('❌ Preload failed:', error);
      throw error;
    }
  }

  /**
   * Force refresh all data
   */
  async refreshAllData() {
    console.log('🔄 Force refreshing all data...');
    this.clearCache();
    return this.preloadAllData();
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
    localStorage.removeItem('dvgc_api_cache');
    localStorage.removeItem('dvgc_cache_timestamps');
    console.log('🗑️ Cache cleared');
  }

  /**
   * Save cache to localStorage for persistence
   */
  saveToStorage() {
    try {
      const cacheData = {};
      const timestampData = {};
      
      for (const [key, value] of this.cache.entries()) {
        cacheData[key] = value;
      }
      
      for (const [key, value] of this.cacheTimestamps.entries()) {
        timestampData[key] = value;
      }
      
      localStorage.setItem('dvgc_api_cache', JSON.stringify(cacheData));
      localStorage.setItem('dvgc_cache_timestamps', JSON.stringify(timestampData));
      
    } catch (error) {
      console.warn('⚠️ Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  loadFromStorage() {
    try {
      const cacheData = localStorage.getItem('dvgc_api_cache');
      const timestampData = localStorage.getItem('dvgc_cache_timestamps');
      
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        for (const [key, value] of Object.entries(parsed)) {
          this.cache.set(key, value);
        }
      }
      
      if (timestampData) {
        const parsed = JSON.parse(timestampData);
        for (const [key, value] of Object.entries(parsed)) {
          this.cacheTimestamps.set(key, value);
        }
      }
      
      console.log('📥 Cache loaded from localStorage');
      
    } catch (error) {
      console.warn('⚠️ Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus() {
    const status = {};
    
    for (const dataType of Object.keys(this.endpoints)) {
      const hasCache = this.cache.has(dataType);
      const isValid = this.isCacheValid(dataType);
      const timestamp = this.cacheTimestamps.get(dataType);
      const age = timestamp ? Math.floor((Date.now() - timestamp) / 1000) : null;
      
      status[dataType] = {
        cached: hasCache,
        valid: isValid,
        ageSeconds: age,
        itemCount: hasCache ? this.cache.get(dataType).length : 0
      };
    }
    
    return status;
  }
}

// Create global instance
window.DVGCCache = new DVGCApiCache();

// Expose useful methods globally
window.dvgcPreloadData = () => window.DVGCCache.preloadAllData();
window.dvgcRefreshData = () => window.DVGCCache.refreshAllData();
window.dvgcCacheStatus = () => console.table(window.DVGCCache.getCacheStatus());

console.log('🎯 DVGC API Cache Manager initialized');