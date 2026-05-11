<script setup lang="ts">
import { IconClock } from '@tabler/icons-vue';
import { IconWifi } from '@tabler/icons-vue';
import { IconBaguette } from '@tabler/icons-vue';
import { IconPhone } from '@tabler/icons-vue';
</script>

<template>
  <div id="about-us">
    <div class="content">
      <header class="hotel-header">
        <p>
          Welcome to our wooden huts in the hills bordering Italy. It's a fine
          day to be a rabbit. We're thrilled you chose to join us where you're
          blessed with our great vistas and vegetation. NOTE: Strict zero bird
          policy. All birds will be shot on-site.
        </p>
      </header>

      <div class="sections">
        <section class="hotel-section">
          <h3><IconClock stroke="{1}" /> Stay</h3>
          <dl>
            <div class="info-row">
              <dt>Check-in</dt>
              <dd>15:00</dd>
            </div>
            <div class="info-row">
              <dt>Check-out</dt>
              <dd>11:00</dd>
            </div>
          </dl>
        </section>

        <section class="hotel-section">
          <h3><IconBaguette stroke="{1}" />Breakfast</h3>
          <dl>
            <div class="info-row">
              <dt>Served</dt>
              <dd>07:00 – 10:30</dd>
            </div>
          </dl>
        </section>

        <section class="hotel-section">
          <h3><IconWifi stroke="{1}" /> Wi-Fi</h3>
          <dl>
            <div class="info-row">
              <dt>Network</dt>
              <dd>HotelGuest</dd>
            </div>
            <div class="info-row">
              <dt>Password</dt>
              <dd>welcome2024</dd>
            </div>
          </dl>
        </section>
      </div>

      <footer class="hotel-footer">
        <a href="tel:+1234567890">
          <IconPhone stroke="{1}" /> Call Reception
        </a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
#about-us {
  color: black;
}

.content {
  padding: 0rem 0.5rem;
}

.hotel-header {
  margin-bottom: 1rem;
}

.hotel-header h2 {
  font-size: 2rem;
  margin: 0 0 0.4rem;
}


.sections {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.hotel-section {
  padding: 1rem 0;
  /* box-shadow: 0 4px 30px color-mix(in srgb, var(--color) 15%, transparent); */
  box-shadow: 0 4px 30px color-mix(in srgb, black 15%, transparent);
  border-radius: 8px;
  margin: 0.5rem 0;
  padding: 1rem;
}

.hotel-section h3 {
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}


dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

dt {
  font-size: 0.9rem;
}

dd {
  margin: 0;
  font-size: 0.9rem;
}

.hotel-footer a {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: black;
  color: white;
  border-radius: 100px;
  text-decoration: none;
}
</style>
