<script setup lang="ts">
import { clientSock } from '@/main'
</script>

<template>
  <v-container fluid>
    <v-form @submit.prevent="sendMessage()">
      <template v-for="(message, index) in messages">
        <v-row class="text-red">{{ message.author }}</v-row>
        <v-row>{{ message.message }}</v-row>
      </template>

      <v-row>
        <v-text-field v-model="messageToSend"> </v-text-field>
        <v-btn type="submit">SEND</v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      messages: new Array<{ author: string; message: string }>(),
      fakeUserDetails: {
        username: 'anon'
      },
      messageToSend: ''
    }
  },
  mounted() {
    let roomToJoin = this.$route.params.room ? this.$route.params.room : 'generalRoom'
    alert(`will join ${roomToJoin}`)
    clientSock.emit('joinRoom', roomToJoin, this.fakeUserDetails)
    clientSock.on('joinRoom', (message) => {
      this.messages.push(message)
    })
    clientSock.on('message', (message) => {
      this.messages.push(message)
    })

    clientSock.on('userDisconnect', (message) => {
      console.log(`disconnect ${message}`)
      this.messages.push(message)
    })
  },
  methods: {
    sendMessage() {
      clientSock.emit('message', this.messageToSend)
      this.messageToSend = ''
    }
  }
}
</script>
