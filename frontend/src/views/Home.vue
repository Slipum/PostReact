<template>
  <div>
    <h1>Home</h1>
    <p v-if="isAuthenticated">You are logged in!</p>
    <p v-else>You are not logged in. <router-link to="/auth">Login/Register</router-link></p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
