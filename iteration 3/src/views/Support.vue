<template>
  <div class="support-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Nearby Help, When You Need It Most</h1>
        <p class="hero-description">
          A quick-access hub for emergency support, connecting you to nearby medical help and allergy care.
        </p>
      </div>
      <div class="hero-image">
        <img src="/images/10011760143647_.pic.jpg" alt="Medical Support Illustration" class="hero-illustration">
      </div>
    </div>

    <!-- Search and Results Section -->
    <div class="search-section">
      <div class="search-container">
        <h2 class="search-title">Search nearby medical support quickly and safely.</h2>
        
        <!-- Search Bar and Filters -->
        <div class="search-controls">
          <div class="service-search-wrapper">
            <input 
              type="text" 
              v-model="locationSearch"
              placeholder="Search for address or location"
              class="search-input"
              @input="handleLocationSearch"
              @focus="showSuggestions = true"
            >
            
            <!-- Location Suggestions Dropdown -->
            <div v-if="showSuggestions && locationSuggestions.length > 0" class="suggestions-dropdown">
              <div 
                v-for="(suggestion, index) in locationSuggestions" 
                :key="index"
                class="suggestion-item"
                @click="selectLocation(suggestion)"
              >
                <span class="suggestion-icon">📍</span>
                <span class="suggestion-text">{{ suggestion.display_name }}</span>
              </div>
            </div>
            
            <button 
              class="search-button" 
              @click="searchLocation"
              :disabled="searching"
              :title="'Search medical facilities'"
            >
              <span v-if="!searching" class="search-icon-button">🔍</span>
              <span v-else class="loading-icon">🔄</span>
            </button>
            
            <button 
              class="location-target-button" 
              @click="getCurrentLocation" 
              :disabled="gettingLocation"
              :title="gettingLocation ? 'Getting location...' : 'Use my current location'"
            >
              <span v-if="!gettingLocation" class="target-icon">🎯</span>
              <span v-else class="loading-icon">🔄</span>
            </button>
          </div>
          
          <div class="filter-chips">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              :class="['chip', { active: activeFilter === filter.id }]"
              @click="setFilter(filter.id)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Results List -->
        <div class="results-container">
          <div 
            v-for="location in filteredLocations" 
            :key="location.id"
            class="location-card"
          >
            <div class="location-info">
              <h3 class="location-name">{{ location.name }}</h3>
              <p class="location-address">{{ location.address }} • {{ location.distance }}</p>
            </div>
            <button class="navigate-button" @click="navigate(location)">
              Navigate
            </button>
          </div>

          <!-- No Results -->
          <div v-if="filteredLocations.length === 0" class="no-results">
            <p>No medical facilities found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Support',
  data() {
    return {
      // free text typed by the user. When it changes, I debounce a lookup.
      locationSearch: '',
      activeFilter: 'all',
      // very light chip model. In future we could make the ids match backend enums
      filters: [
        { id: 'all', label: 'All' },
        { id: 'hospital', label: 'Hospitals' },
        { id: 'gp', label: 'GP Clinics' }
      ],
      // results shown to the user
      locations: [],
      // default to Melbourne CBD so first paint isn’t empty
      userLatitude: -37.8136,
      userLongitude: 144.9631,
      loading: false,
      error: null,
      gettingLocation: false,
      searching: false,
      // suggestions from Nominatim live here; cleared on select or escape
      locationSuggestions: [],
      showSuggestions: false,
      // tiny debounce handle
      searchTimeout: null,
      hasValidLocation: false
    }
  },
  computed: {
    // For now we keep filtering super basic.
    // Later we can actually filter by type here instead of server-side.
    filteredLocations() {
      return this.locations;
    }
  },
  mounted() {
    this.getUserLocation();
    // Click outside to close suggestions
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    // Try to grab the user's coordinates. If it fails, fall back to CBD.
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLatitude = position.coords.latitude;
            this.userLongitude = position.coords.longitude;
            this.hasValidLocation = true;
            this.fetchFacilities();
          },
          (error) => {
            console.log('Using default location (Melbourne CBD):', error);
            // use default location
            this.hasValidLocation = true;
            this.fetchFacilities();
          }
        );
      } else {
        console.log('Geolocation not supported, using default location');
        this.hasValidLocation = true;
        this.fetchFacilities();
      }
    },
    // Debounced search to the Nominatim API for address text input.
    async handleLocationSearch() {
      // Mark as invalid location when user types
      this.hasValidLocation = false;
      
      // Debounce to avoid frequent requests
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      if (!this.locationSearch || this.locationSearch.trim().length < 3) {
        this.locationSuggestions = [];
        return;
      }
      
      this.searchTimeout = setTimeout(async () => {
        try {
          // Use OpenStreetMap Nominatim API for address search (limited to Melbourne area)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(this.locationSearch)},Melbourne,Victoria,Australia` +
            `&format=json&limit=5&countrycodes=au`,
            {
              headers: {
                'User-Agent': 'HayFree-Medical-App'
              }
            }
          );
          
          const results = await response.json();
          this.locationSuggestions = results;
          this.showSuggestions = true;
        } catch (error) {
          console.error('Address search failed:', error);
          this.locationSuggestions = [];
        }
      }, 300); // 300ms debounce delay
    },
    // User clicks one of the suggestions → lock coordinates + close list
    selectLocation(suggestion) {
      this.userLatitude = parseFloat(suggestion.lat);
      this.userLongitude = parseFloat(suggestion.lon);
      this.locationSearch = suggestion.display_name;
      this.showSuggestions = false;
      this.locationSuggestions = [];
      this.hasValidLocation = true;
    },
    // Explicit search button: if no valid pick, send empty coords to backend.
    async searchLocation() {
      if (!this.locationSearch.trim()) {
        alert('Please enter a location or address');
        return;
      }
      
      // If user hasn't selected valid address, pass null coordinates for empty result
      if (!this.hasValidLocation) {
        this.userLatitude = null;
        this.userLongitude = null;
      }
      
      // Call API directly, let backend handle it
      this.fetchFacilities();
    },
    // Shortcut: ask the browser for current position and search immediately.
    getCurrentLocation() {
      this.gettingLocation = true;
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLatitude = position.coords.latitude;
            this.userLongitude = position.coords.longitude;
            this.locationSearch = 'My Current Location';
            this.hasValidLocation = true;
            this.gettingLocation = false;
            this.showSuggestions = false;
            this.fetchFacilities();
          },
          (error) => {
            console.error('Location failed:', error);
            alert('Unable to get your location. Please check browser permissions.');
            this.gettingLocation = false;
          }
        );
      } else {
        alert('Your browser does not support geolocation');
        this.gettingLocation = false;
      }
    },
    // Tiny UX: click outside the wrapper to close suggestions.
    handleClickOutside(event) {
      // Check if click is outside search box
      const searchWrapper = event.target.closest('.service-search-wrapper');
      if (!searchWrapper) {
        this.showSuggestions = false;
      }
    },
    // Core fetch: call our backend with coords + filter, then map to UI items.
    async fetchFacilities() {
      this.loading = true;
      this.error = null;
      
      try {
        // If coordinates are empty, pass null or empty string
        const lat = this.userLatitude !== null ? this.userLatitude : '';
        const lng = this.userLongitude !== null ? this.userLongitude : '';
        
        const response = await fetch(
          `/api/map/facility?latitude=${lat}&longitude=${lng}&type=${this.activeFilter}`
        );
        
        const result = await response.json();
        
        if (result.code === 1 && result.data) {
          // Convert API data format to component required format
          this.locations = result.data.map((item, index) => ({
            id: index + 1,
            name: item.name,
            address: item.address,
            distance: `${item.distance.toFixed(3)} km`,
            type: item.type
          }));
        } else {
          this.error = result.msg || 'Failed to fetch data';
          this.locations = [];
        }
      } catch (error) {
        console.error('Failed to fetch nearby facilities:', error);
        this.error = 'Network error, please try again later';
        this.locations = [];
      } finally {
        this.loading = false;
      }
    },
    // Change active filter and refresh results.
    setFilter(filterId) {
      this.activeFilter = filterId;
      // Refetch data when switching filters
      this.fetchFacilities();
    },
    // Open Google Maps in a new tab with the address.
    navigate(location) {
      // Navigate to map or external navigation app
      const address = encodeURIComponent(`${location.address}, Melbourne, Australia`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    }
  }
}
</script>

<style scoped>
.support-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, 
    #4678A8 0%, 
    #4678A8 40%, 
    #6b9bc2 50%, 
    #8fb3d5 60%, 
    #b8d3e8 70%, 
    #d9e8f5 80%, 
    #f0f6fb 100%);
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60px 112px;
  background: #4678A8;
  min-height: 374px;
  box-sizing: border-box;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 805px;
}

.hero-title {
  font-family: 'Questrial', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
}

.hero-description {
  font-family: 'AR One Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 100%;
  color: #FFFFFF;
  margin: 0;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-illustration {
  width: 280px;
  height: 280px;
  object-fit: contain;
  margin-left: 40px;
}

/* Search section */
.search-section {
  display: flex;
  justify-content: center;
  padding: 40px 112px 80px;
  flex: 1;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1215px;
  background: #FFFDFD;
  border: 1px solid #FFFFFF;
  border-radius: 100px;
  padding: 60px 80px;
  box-sizing: border-box;
}

.search-title {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.1px;
  color: #000000;
  margin: 0 0 40px 0;
}

/* Search Controls */
.search-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-bottom: 40px;
}

.service-search-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 602px;
}

.service-search-wrapper .search-input {
  padding-right: 110px;
}

.search-button,
.location-target-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: #4678A8;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.search-button {
  right: 60px;
}

.location-target-button {
  right: 10px;
}

.search-button:hover:not(:disabled),
.location-target-button:hover:not(:disabled) {
  background: #3a6590;
  transform: translateY(-50%) scale(1.1);
}

.search-button:disabled,
.location-target-button:disabled {
  background: #9ab3c9;
  cursor: not-allowed;
  opacity: 0.7;
}

.search-icon-button {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-icon,
.loading-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  height: 54px;
  padding: 12px 50px 12px 16px;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  color: #1E1E1E;
}

.search-input::placeholder {
  color: #B3B3B3;
}

.search-input:focus {
  outline: 2px solid #4678A8;
  border-color: #4678A8;
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.suggestion-icon {
  margin-right: 12px;
  font-size: 16px;
  flex-shrink: 0;
}

.suggestion-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

/* Filter Chips */
.filter-chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.chip {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  height: 32px;
  background: transparent;
  border: 1px solid #CAC4D0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.1px;
  color: #49454F;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chip:hover {
  background: rgba(70, 120, 168, 0.1);
}

.chip.active {
  background: rgba(70, 120, 168, 0.2);
  border-color: #4678A8;
  color: #4A4459;
}

/* Results container */
.results-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1032px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom scrollbar */
.results-container::-webkit-scrollbar {
  width: 15px;
}

.results-container::-webkit-scrollbar-track {
  background: transparent;
}

.results-container::-webkit-scrollbar-thumb {
  background: #D9D9D9;
  border-radius: 20px;
}

.results-container::-webkit-scrollbar-thumb:hover {
  background: #B3B3B3;
}

/* Location card */
.location-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  width: 100%;
  min-height: 113px;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.location-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-name {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  line-height: 20px;
  letter-spacing: 0.1px;
  color: #000000;
  margin: 0;
}

.location-address {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.1px;
  color: #565656;
  margin: 0;
}

.navigate-button {
  box-sizing: border-box;
  padding: 12px 24px;
  background: #4678A8;
  border: none;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigate-button:hover {
  background: #3a6590;
  transform: scale(1.05);
}

.navigate-button:active {
  transform: scale(0.98);
}

/* No results message */
.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.no-results p {
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  color: #565656;
}

/* Responsive design */
@media (max-width: 1024px) {
  .hero-section {
    padding: 40px 60px;
  }
  
  .search-section {
    padding: 40px 60px;
  }
  
  .search-container {
    padding: 40px 60px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    padding: 40px 20px;
    gap: 30px;
  }
  
  .hero-title {
    font-size: 42px;
  }
  
  .hero-description {
    font-size: 24px;
  }
  
  .hero-image {
    display: none;
  }
  
  .search-section {
    padding: 20px;
  }
  
  .search-container {
    padding: 30px 20px;
    border-radius: 40px;
  }
  
  .search-title {
    font-size: 28px;
    line-height: 1.3;
  }
  
  .search-controls {
    gap: 16px;
  }
  
  .filter-chips {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .location-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }
  
  .navigate-button {
    width: 100%;
  }
}
</style>

