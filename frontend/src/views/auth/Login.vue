<script setup lang="ts">
import { ref } from "vue"
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { adminLogin } from "@/services/auth.service"

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function guestLogin() {
  router.push('/dev-hotel/guest-dashboard')
}

const email = ref("")
const password = ref("")
const showPassword = ref(false)

const loading = ref(false)
const errorMessage = ref("")


const handleLogin = async () => {
  errorMessage.value = ""
  loading.value = true
  try {
    const res = await adminLogin({ email: email.value, password: password.value})

    auth.setSession(res)

    router.push({ name: 'admin-dashboard' })

  } catch (err) {
    errorMessage.value = "Login failed"
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div id="form-wrapper">

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email address</label>
        <div class="input-wrapper">
          <IconMail class="icon" />
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label>Password</label>
        <div class="input-wrapper">
          <IconLock class="icon" />

          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            minlength="6"
            maxlength="20"
            oninvalid="this.setCustomValidity('Password too short')"
            oninput="this.setCustomValidity('')"
            pattern="^(?=.*[A-Z])(?=.*\d).+$"
            required
          />

          <button
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            <IconEye class="icon" v-if="!showPassword" />
            <IconEyeOff class="icon" v-else />
          </button>
        </div>
      </div>

      <p v-if="errorMessage">{{ errorMessage }}</p>

      <button :disabled="loading">
        {{ loading ? "loading..." : "Login" }}
      </button>
    </form>
  </div>
  <!-- <button @click="guestLogin">Guest login</button> -->
</template>

<style lang="css" scoped>

form {
  display: grid;
  gap: 1.2rem;
}

.input-wrapper {
  position: relative;
}

.icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  height: 1.5rem;
  color: #888;
}

input {
  border-radius: 10px;
  border: 0.5px solid lightgrey;
  padding: 1rem;
  padding-left: 4rem;
  background-color: #123A66;
  color: aliceblue;
}

button {
  margin-top: 1rem;
  padding: 1rem;
  color: white;
  background:
    linear-gradient(180deg, #175496 0%,  #236cb9 100%);
  border-radius: 8px;
}
.toggle-password {
  position: absolute;
  right: 2rem;

  background: transparent;
  border: none;
}

/* mobile */
@media (max-width: 768px) {
  form {
    border-radius: 8px;
    backdrop-filter: blur(10px);
    padding: 4rem 1rem;
  }
}
</style>
