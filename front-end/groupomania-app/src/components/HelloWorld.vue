<template>
  <div class="hello">
    <h1 class="pb-5">{{ msg }}</h1>
    <div v-if="!user" class="row mt-5">
      <div class="col-2"></div>
        <div class="col-4">
          <h2 class="mb-3">Vous possedez déjà un compte ?</h2>
          <p class="h5 mb-3">Vous pouvez vous connecter</p>
          <button class="btn btn-primary" @click="this.$router.push('Login')"><p class="h5 m-2">Se connecter</p></button>
        </div>
        <div class="col-4">
          <h2 class="mb-3">Vous effectuez votre première visite ?</h2>
          <p class="h5 mb-3">Vous devez d'abord vous inscrire</p>
          <button class="btn btn-primary" @click="this.$router.push('Register')"><p  class="h5 m-2">S'inscrire</p></button>
        </div>
      <div class="col-2"></div>
    </div>
    <div v-else class="row mt-5">
      <div class="col-2"></div>
      <div class="col-4">
        <h3 class="mb-3">Vous voulez échanger des photos et images ?</h3>
        <p class="h5 mb-3">Rendez-vous sur le forum multimedia</p>
        <button class="btn btn-primary" @click="this.$router.push('/forums/medias')"><p class="h5 m-2">Forum medias</p></button>
      </div>
      <div class="col-4">
        <h3 class="mb-3">Vous voulez partager des articles et échanger sur des sujets ?</h3>
        <p class="h5 mb-3">Rendez-vous sur le forum articles</p>
        <button class="btn btn-primary" @click="this.$router.push('/forums/articles')"><p  class="h5 m-2">Forum articles</p></button>
      </div>
      <div class="col-2"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    ...mapState(
            'auth',
            {
                user: 'user'
            },   
        ),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
