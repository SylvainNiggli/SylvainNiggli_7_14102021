<template>
  <div>
    <App v-if="user" />
    <Login v-else :errorMessage="errorMessage" @submit="login" />
  </div>
</template>

<script>
import App from "../App";
import Login from "../views/Login";
import { login } from "../services/auth.service.js";

export default {
    data() {
        return {
            user: null,
            errorMessage:""
        }
    },

    methods: {
        login({ email, password }) {
            this.user = login(email,password);
            this.errorMessage = this.user ? "" : "Authentification échouée, veuillez réessayer";
        }
    },

    components: { App, Login }
};
</script>