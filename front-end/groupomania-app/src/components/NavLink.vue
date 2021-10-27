<template>
<div class="bg-primary">
  <div class="container">
    <div class="row">
      <nav class="col nav navbar navbar-expand-lg bg-primary navbar-dark">
        <router-link to="/" class="navbar-brand display-1" >
          <img class="logo" src="../assets/logo.png" width="200"/>
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarContent" class="collapse navbar-collapse" style="justify-content:flex-end">
          <ul class="navbar-nav d-flex align-items-center">
            <li class="nav-item active">
              <router-link to="/" class="nav-link" >Accueil</router-link>
            </li>
            <li v-if="loggedIn" class="nav-item dropdown">
              <router-link to="#" class="nav-link dropdown-toggle" id="navbarForum" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Forum</router-link>
              <div class="dropdown-menu bg-primary" aria-labelledby="navbarForum">
                <router-link to="/forums/medias" class="dropdown-item text-white bg-primary">Medias</router-link>
                <router-link to="/forums/articles" class="dropdown-item text-white bg-primary">Articles</router-link>
              </div>
            </li>
            <li v-if="!loggedIn" class="nav-item">
              <router-link  to="/login" class="nav-link" >Login</router-link>  
            </li>
            <li v-if="loggedIn" class="nav-item dropdown">
              <router-link to="#" class="nav-link dropdown-toggle" id="navbarProfile" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="bg-info rounded-circle" height="30" v-bind:src="user.avatar"/></router-link>
              <div class="dropdown-menu bg-primary" aria-labelledby="navbarProfile">
                <router-link to="/profile" class="dropdown-item text-white bg-primary">Profil</router-link>
                <div class="dropdown-divider"></div>
                <router-link @click="logout" to="#" class="dropdown-item text-white bg-primary">Logout</router-link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</div>
<router-view/>  
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'NavLink',
    data(){
        return {
            message: ''
        }
    },
    computed: {
        ...mapState(
            'auth',
            {
                user: 'user'
            }
        ),
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    methods:{
        logout(){
            this.$store.dispatch('auth/logout')
                .then(
                    () => this.$router.push('/login'),
                    error => {
                        this.message = (error.reponse && error.response.data) ||
                                    error.message ||
                                    error.toString();
                }
            )
        }
    }
}
</script>


<style lang="scss">


</style>