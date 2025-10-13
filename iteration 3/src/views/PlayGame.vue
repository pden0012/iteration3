<template>
  <div class="play-game">
    <!-- Welcome Screen -->
    <div v-if="gameState === 'welcome'" class="welcome-screen">
      <div class="game-header">
        <h1 class="game-title">Build Your Allergy-Safe Garden</h1>
        <p class="game-description">
          Discover which trees and flowers are hay fever safe by planting your own virtual garden. 
          Learn through play as your avatar reacts to every choice!
        </p>
      </div>
      
      <div class="welcome-content">
        <div class="welcome-card">
          <div class="speech-bubble">
            <p>Hey there! I'm your garden buddy Alex.</p>
            <p>Welcome to your garden! Try dragging different plants into the garden to see what happens. 
            Some will make me sneeze, while others will keep me happy. Let's find out which ones are hay fever-safe!</p>
          </div>
          <img src="/images/GIF/Alex waving.gif" alt="Alex waving" class="alex-avatar">
          <button class="start-button" @click="startGame">Let's See What Blooms!</button>
        </div>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else class="game-screen">
      <div class="game-header">
        <h1 class="game-title">Build Your Allergy-Safe Garden</h1>
        <p class="game-description">
          Discover which trees and flowers are hay fever safe by planting your own virtual garden. 
          Learn through play as your avatar reacts to every choice!
        </p>
      </div>

      <div class="game-container">
        <!-- Plant Selection Panel -->
        <div class="plant-panel">
          <h3 class="panel-title">Drag a Plant</h3>
          <div class="plant-list">
            <div 
              v-for="plant in plants" 
              :key="plant.id"
              class="plant-item"
              draggable="true"
              @dragstart="onDragStart($event, plant)"
            >
              <img :src="plant.image" :alt="plant.name" class="plant-icon">
              <p class="plant-name">{{ plant.name }}</p>
            </div>
          </div>
        </div>

        <!-- Garden Drop Zone -->
        <div 
          class="garden-area"
          @dragover.prevent
          @drop="onDrop"
        >
          <div class="garden-background">
            <!-- Selected Plant Display -->
            <div v-if="selectedPlant" class="selected-plant-display">
              <img :src="selectedPlant.image" :alt="selectedPlant.name" class="dropped-plant">
              <div class="plant-status" :class="selectedPlant.isSafe ? 'safe' : 'unsafe'">
                <span class="status-icon">{{ selectedPlant.isSafe ? '✓' : '✗' }}</span>
              </div>
            </div>

            <!-- Plant Info Card -->
            <div v-if="selectedPlant && showInfo" class="plant-info-card">
              <h4>{{ selectedPlant.name }}</h4>
              <p class="pollen-risk">Pollen risk: <span :class="selectedPlant.isSafe ? 'low' : 'high'">
                {{ selectedPlant.isSafe ? 'Low' : 'High' }}
              </span></p>
              <p class="plant-detail">{{ selectedPlant.description }}</p>
            </div>
          </div>
        </div>

        <!-- Alex Character and Feedback -->
        <div class="alex-section">
          <div class="alex-feedback">
            <p class="feedback-text">{{ feedbackText }}</p>
          </div>
          <img :src="alexState" alt="Alex" class="alex-character">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayGame',
  data() {
    return {
      gameState: 'welcome', // 'welcome' or 'playing'
      selectedPlant: null,
      showInfo: false,
      plants: [
        {
          id: 1,
          name: 'Australian Oak',
          image: '/images/Game Plants/Australian Oak Trees.png',
          isSafe: false,
          description: 'Oak trees produce large amounts of pollen that can trigger hay fever.'
        },
        {
          id: 2,
          name: 'Ryegrass',
          image: '/images/Game Plants/Ryegrass.png',
          isSafe: false,
          description: 'Grass produce a large amount of pollen that can trigger hay fever.'
        },
        {
          id: 3,
          name: 'Rose',
          image: '/images/Game Plants/Roses.png',
          isSafe: true,
          description: 'Roses have heavy pollen that doesn\'t travel far, making them hay fever-safe!'
        },
        {
          id: 4,
          name: 'Cypress Trees',
          image: '/images/Game Plants/Cypress Trees.png',
          isSafe: false,
          description: 'Cypress trees release significant amounts of allergenic pollen.'
        },
        {
          id: 5,
          name: 'Bottlebrush',
          image: '/images/Game Plants/Bottlebrushes.png',
          isSafe: true,
          description: 'Bottlebrushes are insect-pollinated, so their pollen doesn\'t cause allergies!'
        },
        {
          id: 6,
          name: 'Olive Trees',
          image: '/images/Game Plants/Olive Trees.png',
          isSafe: false,
          description: 'Olive trees are known for producing highly allergenic pollen.'
        },
        {
          id: 7,
          name: 'Iris',
          image: '/images/Game Plants/Irises.png',
          isSafe: true,
          description: 'Irises are insect-pollinated flowers, making them safe for hay fever sufferers.'
        },
        {
          id: 8,
          name: 'London Plane',
          image: '/images/Game Plants/London Plane Trees.png',
          isSafe: false,
          description: 'London Plane trees shed fine hairs that can irritate airways and cause allergies.'
        },
        {
          id: 9,
          name: 'Aster',
          image: '/images/Game Plants/Aster.png',
          isSafe: true,
          description: 'Asters are low-pollen flowers that are generally safe for allergy sufferers.'
        },
        {
          id: 10,
          name: 'Asthma Weed',
          image: '/images/Game Plants/Asthma Weed.png',
          isSafe: false,
          description: 'Asthma Weed is highly allergenic and can trigger severe respiratory symptoms.'
        }
      ]
    }
  },
  computed: {
    alexState() {
      if (!this.selectedPlant) {
        return '/images/GIF/Alex waving.gif';
      }
      return this.selectedPlant.isSafe 
        ? '/images/GIF/Alex happy.gif' 
        : '/images/GIF/Alex sad.gif';
    },
    feedbackText() {
      if (!this.selectedPlant) {
        return 'Drag a plant into the center, then learn if it\'s hay fever safe or not!';
      }
      return this.selectedPlant.isSafe
        ? 'This plant is safe for you to plant in your garden!'
        : 'This plant is not safe for you to plant in your garden!';
    }
  },
  methods: {
    startGame() {
      this.gameState = 'playing';
    },
    onDragStart(event, plant) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('plantId', plant.id);
    },
    onDrop(event) {
      event.preventDefault();
      const plantId = parseInt(event.dataTransfer.getData('plantId'));
      this.selectedPlant = this.plants.find(p => p.id === plantId);
      this.showInfo = false;
      
      // Show info after a short delay for animation
      setTimeout(() => {
        this.showInfo = true;
      }, 300);
    },
    resetGame() {
      this.selectedPlant = null;
      this.showInfo = false;
    },
    backToWelcome() {
      this.gameState = 'welcome';
      this.selectedPlant = null;
      this.showInfo = false;
    }
  }
}
</script>

<style scoped>
.play-game {
  width: 100%;
  min-height: 100vh;
  background: rgba(130, 146, 121, 0.1);
}

/* Welcome Screen */
.welcome-screen {
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e9ecef;
}

.game-header {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 425px;
  padding: 40px 20px;
  background: linear-gradient(rgba(35, 167, 119, 0.5), rgba(35, 167, 119, 0.8)), url('/images/game epic header.webp');
  background-size: cover;
  background-position: center 20%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  color: white;
}

.game-title {
  font-family: 'Questrial', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 80px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  margin: 0 0 20px 0;
  max-width: 1100px;
}

.game-description {
  font-family: 'AR One Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  max-width: 970px;
  margin: 0 auto;
}

.welcome-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 112px;
  position: relative;
  flex: 1;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('/images/garden image.png') center/cover;
  background-size: cover;
  background-position: center;
  padding: 40px;
  width: 100%;
  max-width: 1100px;
  height: 650px;
  text-align: center;
  position: relative;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.alex-avatar {
  width: 230px;
  height: 349px;
  object-fit: contain;
  margin: 0 0 30px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.speech-bubble {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
  position: relative;
  max-width: 705px;
  background: #F2FF8D;
  border: 1px solid rgba(120, 120, 128, 0.16);
  box-shadow: 0px 1px 4px rgba(12, 12, 13, 0.1), 0px 1px 4px rgba(12, 12, 13, 0.05);
  border-radius: 8px;
  margin: 0 0 20px;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  height: 16px;
  background: #F2FF8D;
  border-right: 1px solid rgba(120, 120, 128, 0.16);
  border-bottom: 1px solid rgba(120, 120, 128, 0.16);
}

.speech-bubble p {
  margin: 0 0 12px 0;
  font-family: 'AR One Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  color: #000000;
}

.speech-bubble p:last-child {
  margin-bottom: 0;
}

.start-button {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 40px;
  gap: 8px;
  min-width: 433px;
  height: 62px;
  background: #FFFFFF;
  border: 1px solid #228700;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 120%;
  letter-spacing: -0.02em;
  color: #156B00;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover {
  background: #f0fff0;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(34, 135, 0, 0.2);
}

/* Game Screen */
.game-screen {
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e9ecef;
}

.game-container {
  display: flex;
  gap: 20px;
  padding: 40px;
  margin: 60px auto;
  max-width: 1100px;
  width: 1100px;
  background: url('/images/garden image.png') center/cover;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 650px;
}

/* Plant Panel */
.plant-panel {
  flex: 0 0 auto;
  width: fit-content;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 20px 18px 20px 20px;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  align-self: flex-start;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.panel-title {
  font-family: 'Questrial', sans-serif;
  font-size: 22px;
  margin: 0 0 20px 0;
  text-align: center;
  color: #2e7d32;
  font-weight: 600;
  padding: 0;
}

.plant-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plant-item {
  background: transparent;
  border: none;
  border-radius: 15px;
  padding: 10px;
  cursor: move;
  transition: all 0.3s ease;
  text-align: center;
}

.plant-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.5);
}

.plant-icon {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 8px;
  border-radius: 6px;
}

.plant-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

/* Garden Area */
.garden-area {
  flex: 1;
  background: transparent;
  border-radius: 20px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 3px dashed #43a047;
  transition: all 0.3s ease;
}

.garden-area:hover {
  border-color: #2e7d32;
  background-color: rgba(255, 255, 255, 0.1);
}

.garden-background {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.selected-plant-display {
  position: relative;
  animation: plantDrop 0.5s ease-out;
  margin-top: -80px;
  margin-bottom: 20px;
}

@keyframes plantDrop {
  from {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.dropped-plant {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.plant-status {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  animation: statusPop 0.4s ease-out 0.3s both;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

@keyframes statusPop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.plant-status.safe {
  background: #4caf50;
  color: white;
}

.plant-status.unsafe {
  background: #f44336;
  color: white;
}

.plant-info-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 80px);
  background: white;
  border-radius: 15px;
  padding: 20px;
  max-width: 350px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: infoSlideUp 0.4s ease-out;
}

@keyframes infoSlideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 120px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 80px);
  }
}

.plant-info-card h4 {
  margin: 0 0 12px 0;
  font-family: 'Questrial', sans-serif;
  font-size: 20px;
  color: #2e7d32;
}

.pollen-risk {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.pollen-risk .low {
  color: #4caf50;
}

.pollen-risk .high {
  color: #f44336;
}

.plant-detail {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin: 0;
}

/* Alex Section */
.alex-section {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: flex-start;
  margin-top: 80px;
}

.alex-feedback {
  background: #fff9c4;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(120, 120, 128, 0.16);
}

.feedback-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin: 0;
  text-align: center;
}

.alex-character {
  width: 400px;
  height: 400px;
  object-fit: contain;
  animation: alexBounce 0.6s ease-out;
}

@keyframes alexBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Scrollbar Styling */
.plant-panel::-webkit-scrollbar {
  width: 6px;
}

.plant-panel::-webkit-scrollbar-track {
  background: transparent;
  margin: 20px 0;
  border-radius: 10px;
}

.plant-panel::-webkit-scrollbar-thumb {
  background: rgba(67, 160, 71, 0.5);
  border-radius: 10px;
  margin: 20px 0;
}

.plant-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(46, 125, 50, 0.7);
}

.plant-panel::-webkit-scrollbar-corner {
  background: transparent;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .game-container {
    flex-direction: column;
    margin: 40px 60px;
  }
  
  .plant-panel {
    flex: none;
    max-height: 300px;
  }
  
  .alex-section {
    flex: none;
    flex-direction: row;
    justify-content: center;
  }
  
  .alex-character {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .game-title {
    font-size: 42px;
  }
  
  .game-description {
    font-size: 20px;
    line-height: 120%;
  }
  
  .welcome-content {
    padding: 20px;
  }
  
.welcome-card {
    min-height: 600px;
    padding: 30px 20px;
    border-radius: 15px;
    max-width: 95%;
  }
  
  .alex-avatar {
    width: 180px;
    height: auto;
  }
  
  .speech-bubble {
    max-width: 100%;
    padding: 16px 20px;
  }
  
  .speech-bubble p {
    font-size: 16px;
    line-height: 120%;
  }
  
  .start-button {
    min-width: 100%;
    font-size: 24px;
    height: 52px;
  }
  
  .game-container {
    margin: 20px;
    padding: 20px;
    max-width: 95%;
  }
  
  .plant-panel {
    flex: 0 0 100%;
    max-height: 200px;
  }
  
  .plant-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .plant-item {
    flex: 0 0 calc(50% - 4px);
  }
  
  .plant-icon {
    width: 80px;
    height: 80px;
  }
  
  .alex-section {
    flex-direction: column;
    margin-top: 20px;
  }
}
</style>

