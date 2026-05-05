<script setup lang="ts">
import { ref } from "vue"
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-vue'
const email = ref("")
const password = ref("")
const showPassword = ref(false)

const loading = ref(false)
const errorMessage = ref("")


const handleLogin = async () => {
  errorMessage.value = ""
  loading.value = true

  console.log('handle login')
  try {
    // TODO: post to endpoint
    console.log(email.value, password.value)

  } catch (err) {
    errorMessage.value = "Login failed"
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <form @submit.prevent="handleLogin">
    <div>
      <label>Email address</label>
      <div class="input-wrapper">
        <IconMail class="icon" />
        <input v-model="email" type="email" placeholder="you@example.com" />
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
</template>

<style lang="css" scoped>
form {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 4rem 0rem;
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
}

button {
  margin-top: 1rem;
  padding: 1rem;
  color: white;
  background-color: rgb(15, 10, 76);
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
