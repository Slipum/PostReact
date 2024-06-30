<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login', 'register']),
    register() {
      this.register({ username: this.username, password: this.password }).then(() => {
        this.$router.push('/')
      })
    },
    login() {
      this.login({ username: this.username, password: this.password }).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
