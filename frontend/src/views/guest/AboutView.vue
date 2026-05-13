<script setup lang="ts">
import {
  IconClock,
  IconWifi,
  IconBaguette,
  IconPhone,
} from '@tabler/icons-vue';
import { useHotelStore } from '@/stores/hotel';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const hotel = useHotelStore()
const aboutContent = hotel.aboutContent.content

const SCREEN_WIDTH_MAX = 520;
const windowWidth = ref(window.innerWidth)

const onResize = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

const isMobile = computed(() => windowWidth.value <= SCREEN_WIDTH_MAX)
</script>

<template>
  <div id="about-us">
    <div class="content">
      <header class="hotel-header">
        <h2>Welcome to {{ hotel.name }}</h2>
        <p>
          {{ aboutContent.welcomeMessage }}
        </p>
      </header>


      <div class="sections">
        <section class="hotel-section">
          <h3><IconClock :size="18" stroke="1.5" /> Stay</h3>
          <dl>
            <div class="info-row">
              <dt>Check-in</dt>
              <dd>{{aboutContent.checkIn}}</dd>
            </div>
            <div class="info-row">
              <dt>Check-out</dt>
              <dd>{{ aboutContent.checkOut }}</dd>
            </div>
          </dl>
        </section>

        <section class="hotel-section">
          <h3><IconBaguette :size="18" stroke="1.5" /> Breakfast</h3>
          <dl>
            <div class="info-row">
              <dt>Served</dt>
              <dd>{{aboutContent.breakfast}}</dd>
            </div>
          </dl>
        </section>

        <section class="hotel-section">
          <h3><IconWifi :size="18" stroke="1.5" /> Wi-Fi</h3>
          <dl>
            <div class="info-row">
              <dt>Network</dt>
              <dd>{{ aboutContent.wifiName}}</dd>
            </div>
            <div class="info-row">
              <dt>Password</dt>
              <dd>{{aboutContent.wifiPassword}}</dd>
            </div>
          </dl>
        </section>
      </div>
      <footer v-if="isMobile" class="welcome-footer">
        <a class="call-button" :href="`tel:${aboutContent.receptionPhone}`">
          <IconPhone :size="18" stroke="1.5" /> Call Reception
        </a>
      </footer>
      <footer v-else class="welcome-footer">
        <p>Please call us for more information!</p>
        <a class="call-button" :href="`tel:${aboutContent.receptionPhone}`">
          <IconPhone :size="16" stroke="1.5" />
          {{ aboutContent.receptionPhone }}
        </a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
#about-us {
  color: var(--text);
  font-family: var(--font);
}

.content {
  padding: 0.5rem;
}

/* Header */
.hotel-header {
  color: var(--text);
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  margin-bottom: 1.5rem;
}

.hotel-header h2 {
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
}

.hotel-header p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  width: 28rem;
}

/* Sections */
.sections {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.hotel-section {
  flex: 1;
  border: 1px solid var(--secondary);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  background: var(--surface);
}

.hotel-section h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--secondary);
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
}

dl {
  margin: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

dt {
  font-size: 0.9rem;
  color: var(--text);
}

dd {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
}

/* Footer */
.welcome-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.call-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 13rem;
  padding: 0.85rem 1.75rem;
  background: var(--secondary);
  color: var(--text);
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.95rem;
  white-space: nowrap;
}


/* mobile adaption */

@media (max-width: 768px) {
  .sections {
    flex-direction: column;
  }
  .hotel-section {
    padding: 1rem 1.25rem;
  }
  .welcome-footer {
    justify-content: center;
  }
  .dl {
    margin: 0 0 0 0;
  }
  .hotel-header p {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .welcome-footer {
    flex-direction: row;
  }
}
</style>
