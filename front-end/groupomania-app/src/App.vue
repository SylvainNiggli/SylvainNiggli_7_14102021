<template>
  <NavLink/>
</template>

<script>
import NavLink from './components/NavLink.vue'

export default ({
  name: 'App',
  components: {
    NavLink
  }
})
</script>

<style lang="scss">
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
