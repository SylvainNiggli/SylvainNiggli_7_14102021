<template>
    <div class="profile">
        <div class="row">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="card mt-4">
                    <div class="card-header">
                        <div class="card-title h1">Gestion du compte</div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                                <div class="border border-1">
                                    <div>
                                        <img v-if="user" class="rounded-circle border mt-3" width="200" v-bind:src="user.avatar">
                                    </div>
                                    <div v-if="!this.avatarInModification" class="mt-3">
                                        <a href="#" @click.prevent.stop="onAvatarModificationClick()" class="card-link"><i class="fa fa-pen"></i> Modifier</a>
                                    </div>
                                    <div v-if="this.avatarInModification" class="mt-3 mb-2">
                                        <div class="custom-file mb-2">
                                            <input type="file" class="custom-file-input boder" name="avatar" ref="file" id="avatar" accept="image/*" @change="onAvatarChange()">
                                            <label class="custom-file-label text-left" for="avatar">Choisir un fichier</label>
                                            <p v-if="newAvatarImage" class="text-left">{{ newAvatarImage.name }}<a @click.prevent.stop="this.newAvatarImage = ''" class="card-link ml-2 h5" href="#">x</a></p>
                                        </div>
                                        <button class="btn btn-primary ml-1" @click="this.avatarInModification = false">Annuler</button>
                                        <button class="btn btn-primary ml-1" @click="onAvatarValidClick()">Valider</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="border">
                                    <div class="text-left ml-3 mt-3">
                                        <h2>Nom d'utilisateur:</h2>
                                        <p v-if="user" class="pl-2">{{ user.username }}</p>
                                    </div>
                                    <div class="text-left ml-3">
                                        <h2>Adresse e-mail:</h2>
                                        <div v-if="!this.emailInModification" class="pl-2">
                                            <p v-if="user">{{ user.email }} <a href="#" @click.prevent.stop="onEmailModificationClick()" class="card-link ml-2"><i class="fa fa-pen"></i> Modifier</a></p>
                                        </div>   
                                        <div v-if="this.emailInModification" class="pl-2 mb-2">
                                            <input type="text" width="50" v-model="this.newEmail">
                                            <button class="btn btn-primary ml-2" @click="this.emailInModification = false">Annuler</button>
                                            <button class="btn btn-primary ml-1" @click="onEmailValidClick()">Valider</button>
                                        </div>
                                    </div>                            
                                </div>
                                <div class="mt-4 text-right">
                                        <button class="btn btn-danger" @click="onDeleteClick()">Supprimer le compte</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-2">
                
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data(){
        return {
            emailInModification: false,
            avatarInModification: false,
            newEmail: '',
            newAvatarImage: '',
            message: '',
            userId: 0,
        }
    },
    computed: {
        ...mapState(
            'auth',
            {
                user: 'user'
            }
        ),
        getImage(){
            return this.$store.state.auth.user.avatar
        }
    },
    methods:{
        onAvatarChange(){
            this.newAvatarImage = document.getElementById('avatar').files[0];
        },
        onEmailModificationClick(){
            this.emailInModification = true;
            this.newEmail = this.user.email;
        },
        onAvatarModificationClick(){
            this.avatarInModification = true;
        },
        onEmailValidClick(){
            this.$store.dispatch('auth/modifyUser', {
                file: null,
                avatar: this.user.avatar,
                email: this.newEmail,
                userId: this.user.userId
            })
                .then(
                    () => {
                        this.newEmail = null;
                        this.emailInModification = null;
                    },
                    error => {
                        this.message = (error.reponse && error.response.data) ||
                                    error.message ||
                                    error.toString();
                }
            )
        },
        onAvatarValidClick(){
            this.$store.dispatch('auth/modifyUser', {
                file: this.newAvatarImage,
                avatar: this.user.avatar,
                email: this.user.email,
                userId: this.user.userId
            })
                .then(
                    () => {
                        this.newAvatarImage = null;
                        this.avatarInModification = null;
                    },
                    error => {
                        this.message = (error.reponse && error.response.data) ||
                                    error.message ||
                                    error.toString();
                }
            )
        },
        onDeleteClick(){
            if(!confirm("Cette action supprimera votre compte")){
                return
            }
            this.$store.dispatch('auth/delete',this.user.userId)
                .then(
                    () => this.$store.dispatch('auth/logout')
                        .then(
                            () => this.$router.push('/login'),
                            error => {
                                this.message = (error.reponse && error.response.data) ||
                                                error.message ||
                                                error.toString();
                            }
                        ),
                    error => {
                        this.message = (error.reponse && error.response.data) ||
                                    error.message ||
                                    error.toString();
                }
            )
        },
    }
}
</script>