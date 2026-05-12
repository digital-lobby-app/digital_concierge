<script setup lang="ts">
import {
  IconClock,
  IconWifi,
  IconBaguette,
  IconPhone,
} from '@tabler/icons-vue';
import { useHotelStore } from '@/stores/hotel';

const hotel = useHotelStore()
const aboutContent = hotel.aboutContent.content
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

      <footer class="hotel-footer">
        <a href='tel: {{ aboutContent.phoneNumber }}'>
          <IconPhone :size="18" stroke="1.5" /> Call Reception
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
}

/* Sections */
.sections {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.hotel-section {
  border: 1px solid var(--secondary);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: var(--surface);
}

.hotel-section h3 {
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text);
}

dl {
  margin: 0;
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
.hotel-footer {
  display: flex;
  justify-content: center;
}

.hotel-footer a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: var(--secondary);
  color: var(--text);
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.95rem;
}
</style>
