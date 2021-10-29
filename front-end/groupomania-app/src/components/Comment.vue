<template>
    <div class="comment pt-3 mb-3 border-top">
        <div v-for="comment in getComments()" :key="comment.id">
            <div class="row border-0">
                <div class="col-1">
                    <img class="rounded-circle" width="30" v-bind:src="comment.avatar" alt="">
                </div>
                <div class="col-10 p-0">
                    <div class="card">
                        <div class="card-body p-1 rounded-lg">
                            <p class="card-text text-left h7 mb-0 text-primary">{{ comment.username }}</p>
                            <p v-if="inModification !== comment.id" class="card-text text-left h6 mt-1">
                                {{comment.comment}}
                            </p>
                            <div v-if="inModification === comment.id">
                                <label class="sr-only" for="newComment">commentaire à modifier</label>
                                <textarea class="form-control" id="newComment" v-model="this.newComment" rows="2" @change="validNewComment()"></textarea>
                                <span class="error">{{messageNewComment}}</span>
                                <div class="mt-2 d-flex justify-content-end">
                                    <button class="btn btn-primary mr-1" @click="this.inModification = 0">Annuler</button>
                                    <button class="btn btn-primary ml-1" @click="modifyComment(comment)">Valider</button>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer d-flex justify-content-start p-0 mb-1">
                            <ul class="list-inline text-center mb-0 pl-3">
                                <li class="list-inline-item"><a href="#" @click.prevent.stop="" class="card-link border-bottom border-primary h7">J'aime</a></li>
                                <li class="list-inline-item">&middot;</li>
                                <li class="list-inline-item"><a href="#" @click.prevent.stop="" class="card-link h7">{{comment.timeAgo}}</a></li>
                            </ul>
                        </div>
                    </div>          
                </div>
                <div class="col-1 d-flex align-items-center pl-0">
                    <div v-if="user.userId === comment.user_id || user.privilege ===1" class="dropdown">
                      <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-h"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                        <a class="dropdown-item h7" @click.prevent="modificationInProgress(comment)" href="#">Modifier</a>
                        <a class="dropdown-item h7" @click.prevent="deletePost(comment.id)" href="#">Supprimer</a>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Comment',
    props: {
        postParentId: Number,
    },
    data(){
        return {
            message:'',
            messageNewComment:'',
            inModification: 0,
            inComment: 0,
            newComment: '',
        }
    },
    computed: {
        ...mapState(
            'posts',
            {
                posts: 'posts'
            },   
        ),
        ...mapState(
            'auth',
            {
                user: 'user'
            },   
        ),
    },
    methods: {
        validNewComment(){
          this.messageNewComment = !this.newComment ? 'Ce champ est nécéssaire': '';
          return this.newComment;
        },
        validate() {
            return Promise.resolve(this.validNewComment());
        },
        getComments(){
            return this.posts.find(post => post.id === this.postParentId).comments;
        },
        updateComments(){
            this.$store.dispatch('posts/getCommentsByPost',this.postParentId)
            .then(
                () => {},
                error => {
                    this.message = error.response.data.error;
                } 
            ) 
        },
        modificationInProgress(comment){
            this.inComment = 0;
            this.inModification = comment.id;
            this.newComment = comment.comment;
        },
        modifyComment(comment){ 
            this.validate().then(isValid => {
                if(!isValid){
                    return;
                }
                this.messageNewComment = '';
                this.message = '';
                this.$store.dispatch('posts/modifyPost', {
                    id: comment.id,
                    userId: comment.user_id,
                    forum: 'articles',
                    article: this.newComment,  
                })
                .then(
                    () => {
                        this.inModification = 0;
                        this.newComment = null;
                        this.updateComments();
                    },
                    error => {
                        this.message = error.response.data.error;
                    } 
                )
            })
        },
        deletePost(id){
            if(!confirm("Cette action supprimera ce commentaire")){
                return
            }
            this.inComment = 0;
            this.newComment = null;
            this.inModification = 0;
            this.$store.dispatch('posts/deletePost', id)
            .then(
                () => {
                    this.updateComments();
                },
                error => {
                    this.message = error.response.data.error;
                } 
            )
        },
    }
}
</script>

<style lang="scss">

</style>