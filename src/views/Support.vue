<template>
  <div class="support-page">
    <!-- 顶部横幅区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">就近帮助，随时随地</h1>
        <p class="hero-description">
          快速访问急救支持中心，为您连接附近的医疗帮助、药房和过敏护理服务。
        </p>
      </div>
      <div class="hero-image">
        <div class="phone-illustration">
          <div class="hospital-icon">🏥</div>
          <div class="location-icon">📍</div>
        </div>
      </div>
    </div>

    <!-- 搜索和结果区域 -->
    <div class="search-section">
      <div class="search-container">
        <h2 class="search-title">快速安全地搜索附近的医疗支持</h2>
        
        <!-- 搜索框和筛选器 -->
        <div class="search-controls">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索附近的服务"
              class="search-input"
              @input="handleSearch"
            >
            <span class="search-icon">🔍</span>
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

        <!-- 结果列表 -->
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
              导航
            </button>
          </div>

          <!-- 如果没有结果 -->
          <div v-if="filteredLocations.length === 0" class="no-results">
            <p>未找到相关医疗机构</p>
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
      searchQuery: '',
      activeFilter: 'all',
      filters: [
        { id: 'all', label: '全部' },
        { id: 'hospitals', label: '医院' },
        { id: 'clinics', label: '诊所' }
      ],
      locations: [
        {
          id: 1,
          name: 'Alfred Health',
          address: '300 Grattan St, Parkville',
          distance: '2.1 km',
          type: 'hospital'
        },
        {
          id: 2,
          name: 'Remedy Healthcare',
          address: '400 Grattan St, Parkville',
          distance: '4.2 km',
          type: 'clinic'
        },
        {
          id: 3,
          name: 'St Vincents Private Hospital Ltd',
          address: '500 Grattan St, Parkville',
          distance: '5.1 km',
          type: 'hospital'
        }
      ]
    }
  },
  computed: {
    filteredLocations() {
      let results = this.locations;
      
      // 按类型筛选
      if (this.activeFilter !== 'all') {
        results = results.filter(loc => {
          if (this.activeFilter === 'hospitals') return loc.type === 'hospital';
          if (this.activeFilter === 'clinics') return loc.type === 'clinic';
          return true;
        });
      }
      
      // 按搜索关键词筛选
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        results = results.filter(loc => 
          loc.name.toLowerCase().includes(query) ||
          loc.address.toLowerCase().includes(query)
        );
      }
      
      return results;
    }
  },
  methods: {
    handleSearch() {
      // 搜索处理逻辑
    },
    setFilter(filterId) {
      this.activeFilter = filterId;
    },
    navigate(location) {
      // 导航到地图或外部导航应用
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
  background: linear-gradient(180deg, #4678A8 0%, rgba(70, 120, 168, 0.5) 36.55%, rgba(255, 255, 255, 0.5) 100%);
}

/* 顶部横幅区域 */
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

.phone-illustration {
  position: relative;
  width: 200px;
  height: 250px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hospital-icon {
  font-size: 80px;
  position: absolute;
  top: 20px;
  right: -20px;
}

.location-icon {
  font-size: 60px;
}

/* 搜索区域 */
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

/* 搜索控件 */
.search-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
}

.search-input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 602px;
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

.search-icon {
  position: absolute;
  right: 16px;
  font-size: 20px;
  pointer-events: none;
}

/* 筛选chips */
.filter-chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
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

/* 结果容器 */
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

/* 自定义滚动条 */
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

/* 位置卡片 */
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
  font-size: 24px;
  line-height: 20px;
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

/* 无结果提示 */
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

/* 响应式设计 */
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

