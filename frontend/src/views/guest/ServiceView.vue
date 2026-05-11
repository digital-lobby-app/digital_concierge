<script setup lang="ts">
import { IconSend } from '@tabler/icons-vue';
</script>

<template>
  <div class="chat-root">

    <header class="chat-header">
      <img
        src="../../assets/chatbot/alfred.jpeg"
        class="header-image"
        alt="alfred"
      />
      <div class="header-info-box">
        <h3>Hotel name is here</h3>
        <div class="header-info-subline">
          <div class="header-dot" />
          <p class="header-status">online</p>
        </div>
      </div>
    </header>

  
    <div class="chat-messages">
      <div class="message-row user">
        <div class="bubble">Hey alfred, can you help me?</div>
      </div>
      <div class="message-row assistant">
        <div class="bubble">Of course! What do you need?</div>
      </div>
      <div class="message-row user">
        <div class="bubble">Just checking how this looks.</div>
      </div>
    </div>


    <footer class="chat-input-bar">
      <textarea class="chat-input" placeholder="Type a message…" rows="1" />
      <button class="send-btn" aria-label="Send">
        <IconSend stroke={1} />
      </button>
    </footer>
  </div>
</template>

<style scoped>
.chat-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--text);
  font-size: 0.875rem;
}

/* header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-info-box {
  display: inline-flex;
  flex-direction: column;
}
.header-info-subline {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.header-image {
  border-radius: 99rem;
  height: 3rem;
}

.header-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
}

.header-status {
  font-size: 0.7rem;
}

/* messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}


.message-row {
  display: flex;
}

.message-row.user      { justify-content: flex-end; }
.message-row.assistant { justify-content: flex-start; }

.bubble {
  padding: 0.65rem 1rem;
  border-radius: 8px;
}

.message-row.user .bubble {
  background: var(--accent);
  color: var(--font);
  border-bottom-right-radius: 0px;
}

.message-row.assistant .bubble {
  background: var(--text);
  color: var(--bg);
  border-bottom-left-radius: 0px;
}

/* input bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0.5rem;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  background: var(--accent);
  border-radius: 12px;
  color: var(--text);
  padding: 0.6rem 0.9rem;
  resize: none;
  outline: none;
}

.send-btn {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: var(--accent);
  color: var(--text);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
