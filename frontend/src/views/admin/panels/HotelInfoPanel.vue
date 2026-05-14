<script setup lang="ts">
import {
  IconClock,
  IconWifi,
  IconBaguette,
  IconLock,
  IconDeviceFloppy
} from '@tabler/icons-vue';
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useHotelStore } from '@/stores/hotel'
import { useAuthStore } from '@/stores/auth'
import router from '@/router/index';

const emit = defineEmits<{ back: [] }>()

const hotelStore = useHotelStore()
const { aboutContent } = storeToRefs(hotelStore)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const hotelTitle = ref('')
const welcomeMessage = ref('')
const phoneNumber = ref('')
const checkIn = ref('15:00')
const checkOut = ref('09:45')
const breakfastStart = ref('07:00')
const breakfastEnd = ref('10:00')
const wifiName = ref('')
const wifiPassword = ref('')

watch(
  aboutContent,
  (mod) => {
    const c = mod?.content
    if (!c) return

    hotelTitle.value = hotelStore.name ?? ''
    welcomeMessage.value = c.welcomeMessage ?? ''
    phoneNumber.value = c.receptionPhone ?? ''

    checkIn.value = c.checkIn ?? checkIn.value
    checkOut.value = c.checkOut ?? checkOut.value

    const parts = String(c.breakfast ?? '').split('-').map(s => s.trim())
    breakfastStart.value = parts[0] ?? ''
    breakfastEnd.value = parts[1] ?? ''

    wifiName.value = c.wifiName ?? ''
    wifiPassword.value = c.wifiPassword ?? ''
  },
  { immediate: true }
)

const saving = ref(false)

async function onSave() {
  saving.value = true
  try {
    const supabaseUserId = user.value?.id
    if (!supabaseUserId) {
      alert("Not logged in")
      return
    }

    await hotelStore.saveAboutContent(supabaseUserId, {
      hotelName: hotelTitle.value,
      welcomeMessage: welcomeMessage.value,
      receptionPhone: phoneNumber.value,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      breakfast: `${breakfastStart.value} - ${breakfastEnd.value}`,
      wifiName: wifiName.value,
      wifiPassword: wifiPassword.value,
    })

   emit('back')
  } catch (e) {
    console.error(e)
    alert("Save failed. Check console.")
  } finally {
    saving.value = false
  }
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});


</script>

<template>
  <div id="info-container">
    <div class="info-group" id="welcome-txt">
      <h4>WELCOME MESSAGE</h4>
      <div class="form-group">
        <label for="welcome-title">Hotel name</label>
        <input v-model="hotelTitle" type="text" id="welcome-title">
      </div>
      <div class="form-group">
        <label for="welcome-txt">Message</label>
        <textarea v-model="welcomeMessage" name="welcome-txt" rows="7"></textarea>
      </div>
      <div class="form-group">
        <label for="phone">Phone number</label>
        <input v-model="phoneNumber" type="tel" id="phone">
      </div>
    </div>
    <div class="info-group" id="stay-time">
      <h4>STAY TIMES</h4>
      <div class="info-subgroup">
        <div class="icon-div"><IconClock stroke="1.5" /></div>
        <label for="check-in">Check-in time</label>
        <select v-model="checkIn">
          <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="info-subgroup">
        <div class="icon-div"><IconClock stroke="1.5"/></div>
        <label for="check-out">Check-out time</label>
        <select v-model="checkOut">
          <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>
    <div class="info-group" id="breakfast-time">
      <h4>BREAKFAST</h4>
      <div class="info-subgroup">
        <div class="icon-div"><IconBaguette stroke="1.5"/></div>
        <label for="breakfast">Breakfast start</label>
        <select v-model="breakfastStart">
          <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="info-subgroup">
        <div class="icon-div"><IconBaguette stroke="1.5"/></div>
        <label for="breakfast">Breakfast end</label>
        <select v-model="breakfastEnd">
          <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>
    <div class="info-group" id="wifi">
      <h4>WI-FI</h4>
      <div class="form-group">
        <label class="info-subgroup" for="wifi-name"><div class="icon-div"><IconWifi stroke="1.5"/></div>Network name</label>
        <input v-model="wifiName" type="text" id="wifi-name">
      </div>
      <div class="form-group">
        <label class="info-subgroup" for="password"><div class="icon-div"><IconLock stroke="1.5"/></div>Password</label>
        <input v-model="wifiPassword" type="text" id="password">
      </div>
    </div>

  <button type="submit" class="submit-btn" @click="onSave" :disabled="saving">
  <IconDeviceFloppy stroke="2" />
  <span>{{ saving ? "Saving..." : "Save" }}</span>
  </button>
  </div>
</template>

<style lang="css" scoped>
input, textarea {
  border-radius: 0.5rem;
  background-color: var(--bg);
  border: 1px solid var(--secondary);
  color: var(--text);
  resize: none;
  padding: 0.5rem;
}

input {
  height: 2rem;
}

select {
  background-color: var(--bg);
  border: solid 1px var(--secondary);
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  color: var(--text);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  width: 5.2rem;
}

button[type="submit"] {
  background-color: var(--accent);
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: var(--icon-on-primary);
  font-weight: bold;
  font-size: 1.2rem;
}

#info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--bg);
}

.info-group {
  background-color: var(--surface);
  border-radius: var(--main-border-radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#welcome-txt {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: grid;
  gap: 0.5rem;
 }

.info-subgroup {
  display: flex;
  gap: 0.5rem;
  align-items: center;
 }

.icon-div{
  background-color: var(--secondary);
  color: var(--icon-on-primary);
  border-radius: 50%;
  min-height: 2rem;
  min-width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

#time-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
}

#time-wrapper select {
  margin-right: auto;
}

</style>