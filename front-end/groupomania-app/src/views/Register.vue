<template>
    <div class="register mt-5">
        <div class="register-title mt-5">
            <h1>Inscription</h1>
            <p>Veuillez renseignez les champs ci-dessous</p>
        </div>
        <form class="register-form"  @submit.prevent="handleRegister" novalidate>
            <div v-if="message" class="error">{{ message }}</div>
            <input name="username" type="text" @change="validUsername()" placeholder="Nom d'utilisateur" v-model="user.username" />
            <span class="error">{{messageUsername}}</span>
            <input name="email" type="email" @change="validEmail()" placeholder="Adresse e-mail" v-model="user.email" />
            <span class="error">{{messageEmail}}</span>
            <input type="password" @change="validPassword()" placeholder="Mot de passe" v-model="user.password" />
            <span class="error">{{messagePassword}}</span>
            <div v-if="user.password" class="d-flex flex-column valid-password">
                <span v-if="this.validCharDec" class="valid">1 chiffre</span>
                <span v-else class="error">1 chiffre</span>
                <span v-if="this.validCharMaj" class="valid">1 Majuscule</span>
                <span v-else class="error">1 Majuscule</span>
                <span v-if="this.validCharMin" class="valid">1 Minuscule</span>
                <span v-else class="error">1 Minuscule</span>
                <span v-if="this.valid8Chars" class="valid">8 Caractères</span>
                <span v-else class="error">8 Caractères</span>
            </div>
            <div v-else class="d-flex flex-column valid-password">
                <span>1 chiffre</span>
                <span>1 Majuscule</span>
                <span>1 Minuscule</span>
                <span>8 Caractères</span>
            </div>
            <button class="bg-primary" type="submit">
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
            message: ' ',
            messagePassword:' ',
            messageUsername:' ',
            messageEmail: ' ',
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        validCharDec(){
            return /^(?=.*\d)[0-9a-zA-Z]+$/.test(this.user.password) ? true : false;
        },
        validCharMaj(){
            return /^(?=.*[A-Z])[0-9a-zA-Z]+$/.test(this.user.password) ? true : false;
        },
        validCharMin(){
            return /^(?=.*[a-z])[0-9a-zA-Z]+$/.test(this.user.password) ? true : false;
        },
        valid8Chars(){
            return /^[0-9a-zA-Z]{8,}$/.test(this.user.password) ? true : false;
        },
    },
    created() {
        if(this.loggedIn) {
                this.$router.push('Home');
        }
    },
    methods: {
        validUsername(){
            let rgxUsername= /^([a-zA-Z.-_]){3,25}$/;
            this.messageUsername = !rgxUsername.test(this.user.username) ? 
                                    "Nom d'utilisateur non valide" : '';
            return rgxUsername.test(this.user.username);
        },
        validEmail(){
            let rgxEmail = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            this.messageEmail = !rgxEmail.test(this.user.email) ? 
                                    "Adresse e-mail non valide" : '';
            return rgxEmail.test(this.user.email);
        },
        validPassword(){
            let rgxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            if(!this.user.password){
                return false;
            }
            this.messagePassword = !rgxPassword.test(this.user.password) ? 
                                    "Mot de passe non valide" : '';
            return rgxPassword.test(this.user.password);
        },
        validate() {
            return Promise.resolve(this.validUsername() && this.validEmail() && this.validPassword());   
        },
        handleRegister() {
            this.validate().then(isValid => {
                if(!isValid){
                    this.message = "Des informations sont requisent";
                    return;
                }
                this.messagePassword = '';
                this.messageUsername = '';
                this.messageEmail = '';
                this.message = '';
                this.$store.dispatch('auth/register', this.user).then(
                        () => {
                            this.$store.dispatch('auth/login', this.user).then(
                                () => {
                                    this.$router.push('/');
                                },
                                error => {
                                    this.message = error.response.data.error;
                                }
                            );
                            this.$router.push('/');
                        },
                        error => {
                            this.message = error.response.data.error;
                        }
                    );       
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
            display: flex;
            flex-direction: column;
            align-items: center;

            .valid-password{
                width: 100%;
                margin-top: 5px;
            }
            .error{
                color: tomato;
            }
            .valid{
                color: green;
            }
            input{
                width: 500px;
                height: 30px;
                padding: 10px;
                font-size: 1.2em;
                margin-top: 30px;
            }
            span{
                width: 100%;
                text-align: left;
                margin-left: 10px;
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
