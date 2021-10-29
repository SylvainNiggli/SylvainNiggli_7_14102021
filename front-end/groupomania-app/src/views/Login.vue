<template>
    <div class="login mt-5">
        <div class="login-title">
            <h1>Connexion</h1>
            <p>Connectez-vous avez vos identifiants</p>
        </div>
        <form class="login-form"  @submit.prevent="handleLogin" novalidate>
            <div v-if="message" class="error">{{ message }}</div>
            <input name="username" type="text" placeholder="Nom d'utilisateur" v-model="user.username"/>
            <input type="password" placeholder="Mot de passe" v-model="user.password" />
            <button class="bg-primary" type="submit">
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
        validUsername(){
            let rgxUsername= /^([a-zA-Z.-_]){3,25}$/;
            return rgxUsername.test(this.user.username);
        },
        validPassword(){
            let rgxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            return rgxPassword.test(this.user.password);
        },
        validate() {
            return Promise.resolve(this.validUsername() && this.validPassword());
        },
        handleLogin() {
            this.validate().then(isValid => {
                if(!isValid){
                    this.message = "Nom d'utilisateur ou mot de passe incorrect";
                    return;
                }
                this.message = '';
                if(this.user.username && this.user.password) {
                    this.$store.dispatch('auth/login', this.user).then(
                        () => {
                            this.$router.push('Home');
                        },
                        error => {
                            this.message = error.response.status === 404 ? 
                                            "Nom d'utilisateur ou mot de passe incorrect" : 
                                            error.response.data.error;
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
