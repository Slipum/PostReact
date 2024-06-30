<template>
  <div id="app">
    <header>
      <h1>{{ appName }}</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/posts">Posts</router-link>
        <router-link to="/admin" v-if="isAdmin">Admin</router-link>
        <button v-if="isAuthenticated" @click="logout">Logout</button>
      </nav>
    </header>

    <router-view />

    <footer>
      <p>&copy; 2024 Your App</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appName: 'Your App'
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    isAdmin() {
      return this.$store.state.user.role === 'admin'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/auth')
    }
  }
}
</script>

<style>
/* TODO: Сделать глобальные стили */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
}

header nav {
  display: flex;
  justify-content: flex-end;
}

nav a,
button {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
