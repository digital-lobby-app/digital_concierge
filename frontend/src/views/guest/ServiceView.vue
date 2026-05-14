<script setup lang="ts">
import { IconSend } from '@tabler/icons-vue';
import gsap from 'gsap';
import { nextTick, onMounted, ref } from 'vue';
import { useHotelStore } from '@/stores/hotel';
import { postChatbotMessages, type ApiMessage } from '@/services/chatbot.service';
import Messages, { type Message } from '@/components/chatbot/Messages.vue';

const dotRef = ref<HTMLElement | null>(null)
const messagesContainerRef = ref<HTMLElement | null>(null)

const hotel = useHotelStore();

const draft = ref('')
const isSending = ref(false)

const messages = ref<Message[]>([
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `Hi! I'm Alfred from ${hotel.name ?? 'the hotel'}. How can I help you today?`,
  },
])

onMounted(() => {
  const tl = gsap.timeline()
  tl.fromTo(dotRef.value,
    { opacity: 0.6 },
    { opacity: 1, duration: 1, ease: 'power3.in', repeat: -1, yoyo: true }
  )
})

function scrollToBottom() {
  nextTick(() => {
    const el = messagesContainerRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function buildApiHistory(uiMessages: Message[]): ApiMessage[] {
  const valid = uiMessages.filter(
    (m) => !m.pending && !m.error && m.content.trim().length > 0,
  )
  let endIdx = valid.length - 1
  while (endIdx >= 0 && valid[endIdx].role !== 'user') endIdx--
  if (endIdx < 0) return []

  const out: ApiMessage[] = []
  let expected: 'user' | 'assistant' = 'user'
  for (let i = endIdx; i >= 0; i--) {
    const m = valid[i]
    if (m.role !== expected) break
    out.unshift({ role: m.role, content: m.content })
    expected = expected === 'user' ? 'assistant' : 'user'
  }
  if (out.length > 0 && out[0].role === 'assistant') out.shift()
  return out
}

async function fetchAssistantReply(): Promise<string> {
  if (!hotel.slug) {
    throw new Error('Hotel slug is missing — cannot call chatbot.')
  }
  const history = buildApiHistory(messages.value)
  const { reply } = await postChatbotMessages(hotel.slug, history)
  return reply
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || isSending.value) return

  // Pin message directly
  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    content: text,
  }
  messages.value.push(userMsg)
  draft.value = ''
  scrollToBottom()

  // show pending bubble
  const pendingId = crypto.randomUUID()
  messages.value.push({
    id: pendingId,
    role: 'assistant',
    content: '',
    pending: true,
  })
  scrollToBottom()

  // call backend + swap reply
  isSending.value = true
  try {
    const reply = await fetchAssistantReply()
    const idx = messages.value.findIndex(m => m.id === pendingId)
    if (idx !== -1) {
      messages.value[idx] = {
        id: pendingId,
        role: 'assistant',
        content: reply,
      }
    }
  } catch (err) {
    console.error(err)
    const idx = messages.value.findIndex(m => m.id === pendingId)
    if (idx !== -1) {
      messages.value[idx] = {
        id: pendingId,
        role: 'assistant',
        content: 'Sorry, something went wrong reaching the server. Please try again.',
        error: true,
      }
    }
  } finally {
    isSending.value = false
    scrollToBottom()
  }
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
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
        <h3>{{ hotel.name }}</h3>
        <div class="header-info-subline">
          <div ref="dotRef" class="header-dot" />
          <p class="header-status">online</p>
        </div>
      </div>
    </header>

    <div ref="messagesContainerRef" class="chat-messages">
      <Messages
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
      />
    </div>

    <footer class="chat-input-bar">
      <textarea
        ref="inputRef"
        v-model="draft"
        class="chat-input"
        placeholder="Type a message…"
        rows="1"
        :disabled="isSending"
        @keydown="onInputKeydown"
      />
      <button
        class="send-btn"
        aria-label="Send"
        :disabled="isSending || !draft.trim()"
        @click="sendMessage"
      >
        <IconSend stroke="1" />
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
  padding: 0.5rem 0rem;
}
.chat-messages::-webkit-scrollbar {
  display: none;
}

/* input bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0rem 0.5rem;
  margin: 2rem 0rem;
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
  border: none;
  font-family: inherit;
  font-size: inherit;
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

@media (max-width: 768px) {

  .chat-input-bar {
    margin: 0.4rem 0rem;
  }
}
</style>
