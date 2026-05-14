nnnn<script setup lang="ts">
import Login from './Login.vue';
import { IconBuildingCommunity } from '@tabler/icons-vue';
</script>
<template>
  <div id="login-page">
    <div class="login-content">
      <img src="../../assets/logo.png" alt="">
      <h1>Alfred</h1>
      <h3>BOUTIQUE HOTEL MANAGEMENT</h3>
      <br>
      <div class="icon-wrapper">
        <div class="divider" aria-hidden="true"></div>
        <IconBuildingCommunity stroke='1.5' color="#a88d46" height="2rem" width="2rem"/>
        <div class="divider" aria-hidden="true"></div>
      </div>

      <br>
      <p>Everything you need to run exceptional stays.</p>
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
  /* justify-content: center; */
  align-items: center;
  gap: 2rem;

  position: relative;
  overflow: hidden;

  padding: 1rem;

  color: aliceblue;
  font-family: "Noto Sans", sans-serif;

  background:
    radial-gradient(circle at 50% 0%, rgba(42, 112, 190, 0.35), transparent 38%),
    linear-gradient(180deg, #123A66 0%, #0B2545 45%, #061A33 100%);
}

img {
  max-height: 5rem;
}
h1 {
  font-family: "Sora", sans-serif;
}

h3 {
  color: #a88d46;
  font: inherit;
  font-weight: bold;
  font-size: 0.85rem;
}
p {
  font-size: 0.9rem;
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

  clip-path: polygon(0 0, 65% 0, 45% 100%, 0% 100%);
  z-index: 1;
}
.login-content {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  width: 40%;
}
.login-content:first-child {
  align-items: center;
  text-align: center;
}
.login-content:last-child {
  align-items: center;
}

.divider{
  display: flex;
  align-items: center;
  width: 40%;
}

.divider::before,
.divider::after{
  content: "";
  flex: 1;
  height: 1px;
  background: #a88d46;
}

.icon-wrapper {
  display: flex;
  height: 2rem;
  width: 100%;
  justify-content: space-between;
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
