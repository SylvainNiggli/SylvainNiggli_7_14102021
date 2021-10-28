<template>
    <div class="login">
        <div class="login-title">
            <h1>Connexion</h1>
            <p>Connectez-vous avez vos identifiants</p>
        </div>
        <form class="login-form"  @submit.prevent="handleLogin">
            <div v-if="message" class="error">{{ message }}</div>
            <input name="username" type="text" placeholder="Nom d'utilisateur" v-model="user.username"/>
            <span></span>
            <input type="password" placeholder="Mot de passe" v-model="user.password" />
            <span></span>
            <button class="bg-primary" type="submit" :disabled="loading">
                <span>CONTINUER</span>
            </button>
        </form>    
            <p class="mt-3">Vous n'avez pas encore de compte, <a href="#/register">inscrivez-vous</a></p> 
    </div>
</template>


<script>
import User from '../models/user';

export default {
    name: 'Login',
    data(){
        
        return {
            user: new User('',''),
            loading: false,
            message: '',
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    created() {
        if(this.loggedIn) {
            this.$router.push('Home');
        }
    },
    methods: {
        goToRegister(){
            this.$router.push('register')
        },
        validate() {
            return Promise.resolve(true);   
        },
        handleLogin() {
            this.loading =true;
            this.validate().then(isValid => {
                if(!isValid){
                    this.loading = false;
                    return;
                }
                if(this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        () => {
                            this.$router.push('Home');
                        },
                        error => {
                            this.loading = false;
                            this.message = (error.response && error.response.data.error) ||
                                error.message ||
                                error.toString();
                        }
                    );
                }
            });
        },
    },
    components: {

    }
};
</script>

<style lang="scss">
       
    .login{
        height: 50vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &-title{
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            h1{
                font-size: 3em;
            }
            p{
                font-size: 1.5em;
                margin-top: 30px;
            }
        }

        &-form{
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .error{
                color: tomato;
            }
            input{
                width: 500px;
                height: 30px;
                padding: 10px;
                margin-bottom: 30px;
                font-size: 1.2em;
            }

            button{
                width: 30%;
                height: 50px;
                padding: 10px;
                background-color: lightseagreen;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

        }            
    }       
</style>
