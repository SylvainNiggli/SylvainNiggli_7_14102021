<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">Forum</router-link>
  </div>
  <router-view/>
</template>

<script>
export default {
    name: 'NavLink'
}
</script>


<style lang="scss">


#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>