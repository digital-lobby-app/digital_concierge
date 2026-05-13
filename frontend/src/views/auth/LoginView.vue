nnnn<script setup lang="ts">
import Login from './Login.vue';
import { IconDotsFilled } from '@tabler/icons-vue';
import oceanBg from '@/assets/bg-imgs/ocean-bg-imgs/mobile/ocean-bg-1.png'
</script>
<template>
  <div id="login-page" :style="{ backgroundImage: `url(${oceanBg})` }">
    <div class="login-content">
      <h1>Welcome to Alfred!</h1>
      <IconDotsFilled stroke="{2}" />
      <p>Login to continue to your account.</p>
    </div>
    <div class="login-content">
      <Login />
    </div>
  </div>
</template>
<style lang="css" scoped>
#login-page {
  width: 100dvw;
  height: 100dvh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;

  position: relative;
  overflow: hidden;
}
#login-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: center/cover no-repeat;
  z-index: 0;
}
#login-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: aliceblue;

  clip-path: polygon(0 0, 65% 0, 45% 100%, 0% 100%);
  z-index: 1;
}
.login-content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;

  width: 40%;
  margin-left: 4rem;
}
.login-content:first-child {
  text-align: left;
  align-items: flex-start;
}
.login-content:last-child {
  align-items: center;
}

/* mobile */
@media (max-width: 768px) {

  .login-page {
    align-items: center;
  }
  .login-page::after {
    display: none;
  }

  .login-page::before {
    clip-path: none;
  }
  .login-content {
    width: 90%;
    margin-left: 0;
  }
}
</style>
