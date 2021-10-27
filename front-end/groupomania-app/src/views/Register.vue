<template>
    <div class="register">
        <div class="register-title">
            <h1>Inscription</h1>
            <p>Veuillez renseignez les champs ci-dessous</p>
        </div>
        <form class="register-form"  @submit.prevent="handleRegister">
            <div v-if="message" class="error">{{ message }}</div>
            <input name="username" type="text" placeholder="Nom d'utilisateur" v-model="user.username"/>
            <span></span>
            <input name="email" type="email" placeholder="Adresse e-mail" v-model="user.email"/>
            <span></span>
            <input type="password" placeholder="Mot de passe" v-model="user.password" />
            <span></span>
            <button class="bg-primary" type="submit" :disabled="loading">
                <span>CONTINUER</span>
            </button>
        </form>    
    </div>
</template>


<script>
import User from '../models/user';

export default {
    name: 'Register',
    data(){
        
        return {
            user: new User('','',''),
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
        validate() {
            return Promise.resolve(true);   
        },
        handleRegister() {
            this.loading =true;
            this.validate().then(isValid => {
                if(!isValid){
                    this.loading = false;
                    return;
                }
                if(this.user.username && this.user.email && this.user.password) {
                    this.$store.dispatch('auth/register', this.user).then(
                        () => {
                            this.$store.dispatch('auth/login', this.user).then(
                                () => {
                                    this.$router.push('/');
                                },
                                error => {
                                    this.loading = false;
                                    this.message = (error.reponse && error.response.data) ||
                                                    error.message ||
                                                    error.toString();
                                }
                            );
                            this.$router.push('/');
                        },
                        error => {
                            this.loading = false;
                            this.message = (error.reponse && error.response.data) ||
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
    .register{
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
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        }            
    }       
</style>
