<template>
    <div class="container">
        <div class="logo">
            <img src="../assets/logo_groupomania.png" alt="logo">
        </div>
        <div class="login">
            <div class="login-title">
                <h1>Connexion</h1>
                <p>Connectez-vous avez vos identifiants</p>
            </div>
            
            <form class="login-form" @submit.prevent.stop="submit()">
                <p v-if="errorMessage" class="error">{{errorMessage}}</p>
                <input type="email" placeholder="Adresse e-mail" v-model="email"/>
                <input type="password" placeholder="Mot de passe" v-model="password"/>
                <button type="submit">CONTINUER</button>
            </form>    
            <p>Vous n'avez pas encore de compte, <a href="#">inscrivez-vous</a></p> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    props:{
        errorMessage:{
            type: String,
            default:""
        }
    },
    data(){
        return {
            email: "",
            password: ""
        }
    },

    methods: {
        submit() {
            this.$emit("submit", {
                email: this.email,
                password: this.password
            });
        }
    }
}
</script>

<style lang="scss">
    .container{
        height: 70vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
        position: relative;
    }
    .logo{
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80vw;
        top: -50px;
        img{        
            height: 200px;
        }
    }
        
    .login{
        height: 50vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &-title{
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
                background-color: lightseagreen;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        }            
    }       
</style>
