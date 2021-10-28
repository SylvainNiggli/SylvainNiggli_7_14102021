<template>
    <div class="articles">
      <div class="row">
        <div class="col-md-3">

        </div>
        <div class="col-md-6">
          <div class="card mt-4">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="posts-tab" data-toggle="tab" href="#posts" role="tab" aria-controls="posts" aria-selected="true">
                    Ecrire un article</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="images-tab" data-toggle="tab" role="tab" aria-controls="images" aria-selected="false" href="#images">Images</a>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                  <div class="form-group">
                    <label class="sr-only" for="message">article</label>
                    <textarea class="form-control" id="message" v-model="this.article" rows="4" placeholder="Que voulez-vous partager ?"></textarea>
                  </div>
                </div>
                <div class="tab-pane fade" id="images" role="tabpanel" aria-labelledby="images-tab">
                  <div class="form-group">
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" name="image" ref="file" id="customFile" accept="image/*" @change="handleFileUpload()">
                      <label class="custom-file-label" for="customFile">Ajouter une image</label>
                      <p v-if="file" class="text-left">{{ file.name }}<a @click.prevent.stop="this.file = ''" class="card-link ml-2 h5" href="#">x</a></p>
                    </div>
                  </div>
                  <div class="py-4"></div>
                </div>
              </div>
              <div class="btn-toolbar justify-content-between">
                <div class="btn-group">
                  <button v-if="user" @click="setPost" class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="user">
            <div v-for="post of posts" :key="post.id">
            <div class="card mt-5">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center ">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                      <img class="rounded-circle" width="60" v-bind:src="post.avatar" alt="">
                    </div>
                    <div class="ml-2">
                      <div class="h5 m-0">{{ post.username}}</div>
                    </div>
                  </div>
                  <div>
                    <div class="dropdown">
                      <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-h"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                        <div class="h6 dropdown-header">Configuration</div>
                        <a v-if="user.userId === post.user_id || user.privilege ===1" class="dropdown-item" @click.prevent="onModificationClick(post)" href="#">Modifier</a>
                        <a class="dropdown-item" @click.prevent="" href="#">Partager</a>
                        <a v-if="user.userId === post.user_id || user.privilege ===1" class="dropdown-item" @click.prevent="deletePost(post.id)" href="#">Supprimer</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div v-if="inModification === post.id">
                    <label class="sr-only" for="newArticle">article à modifier</label>
                    <textarea class="form-control" id="newArticle" v-model="this.newArticle" rows="4"></textarea>
                    <div class="mt-2 d-flex justify-content-end">
                      <button class="btn btn-primary mr-1" @click="this.inModification = 0">Annuler</button>
                      <button class="btn btn-primary ml-1" @click="modifyPost(post)">Valider</button>
                  </div>
                </div>
                <div v-if="inModification !== post.id" class="d-flex flex-column justify-content-between align-items-start">
                  <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>{{ post.timeAgo }}</div>
                  <a class="card-link" @click.prevent="" href="#">
                    <h5 class="card-title">{{ post.title }}</h5>
                  </a>
                  <p class="card-text text-left">
                    {{ post.comment }}
                  </p>       
                </div> 
              </div>
              <div class="mb-4" v-if="post.media_url">
                    <img width="500" v-bind:src="post.media_url" alt="">
              </div>
              <div class="card-footer">
                <div v-if="this.inModification === 0">
                  <a href="#" @click.prevent.stop="" class="card-link"><i class="fa fa-gittip"></i> J'aime</a>
                  <a href="#" @click.prevent.stop="onCommentClick(post.id)" class="card-link"><i class="fa fa-comment"></i> Commenter</a>
                </div>
                <div class="mt-2" v-if="post.comments">
                  <Comment v-bind:postParentId="post.id"/>
                </div>
              
                <div v-if="this.inModification === 0">
                  <label class="sr-only" v-bind:for="'comment-' + post.id">commentaire</label>
                  <textarea class="form-control" v-bind:id="'comment-' + post.id" v-model="this.response" rows="2" risize="none" placeholder="Ecrire un commentaire..."></textarea>
                  <div class="mt-2 d-flex justify-content-end">
                    <button class="btn btn-primary ml-1" @click="setComment(post.id)">Valider</button>
                  </div>
                </div>
              </div>
            </div>
          </div> 
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Comment from '../components/Comment.vue';

export default {
    data(){
        return {
            message: '',
            article: '',
            newArticle: '',
            response: '',
            newResponse: '',
            inModification: 0,
            inComment: 0,
            status: '',
            file: '',
        }
    },
    beforeCreate(){
        this.$store.dispatch('posts/getPostsByForum','articles')
            .then(
                posts => {
                  posts.forEach(post => {
                    this.$store.dispatch('posts/getCommentsByPost',post.id)
                      .then(
                        () => {},
                        error => {
                          console.log(error);
                          this.message = (error.response && error.response.data.error) ||
                                          error.message ||
                                          error.toString();
                        } 
                      ) 
                  })
                },
                error => {
                  this.message = (error.response && error.response.data.error) ||
                                  error.message ||
                                  error.toString();
                });    
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
    methods:{
        handleFileUpload(){
          this.file = document.getElementById('customFile').files[0];
        },
        onCommentClick(id){
          this.inComment = id; 
          document.getElementById(`comment-${id}`).focus();
          
        },
        cancelModification(){
          this.inModification = 0;
          this.newArticle = null;
        },
        onModificationClick(post){
            this.inComment = 0;
            this.response = null;
            this.inModification = post.id;
            this.newArticle = post.comment;
        },
        updatePosts(){
          this.$store.dispatch('posts/getPostsByForum','articles')
            .then(
                posts => {
                  posts.forEach(post => {
                    this.$store.dispatch('posts/getCommentsByPost',post.id)
                      .then(
                        () => {},
                        error => {
                          this.message = (error.response && error.response.data.error) ||
                                          error.message ||
                                          error.toString();
                        } 
                      ) 
                  })
                },
                error => {
                  this.message = (error.response && error.response.data.error) ||
                                  error.message ||
                                  error.toString();
                });
        },
        setPost(){
          if(this.file){
            let formData = new FormData();
            formData.append('post','salut');
            for (var key of formData.entries()) {
              console.log(key[0] + ', ' + key[1]);
            }
          }
            this.$store.dispatch('posts/setPost', {
                file:this.file,
                userId: this.user.userId,
                forum: 'articles',
                article: this.article,  
            })
            .then(
                () => {
                  this.article = null;
                  this.file = '';
                  this.updatePosts();
                },
                error => {
                    this.message = (error.response && error.response.data.error) ||
                                    error.message ||
                                    error.toString();
                    console.log(this.message);
                } 
            )
        },
        setComment(postId){
            this.$store.dispatch('posts/setComment', {
                postId: postId,
                userId: this.user.userId,
                forum: 'articles',
                response: this.response,  
            })
            .then(
                () => {
                  this.response = null;
                  this.inComment = 0;
                  this.updatePosts(); 
                },
                error => {
                    this.message = (error.response && error.response.data.error) ||
                                    error.message ||
                                    error.toString();
                } 
            )
        },
        deletePost(id){
            this.inComment = 0;
            this.response = null;
            this.inModification = 0;
            this.newArticle = null;
            this.$store.dispatch('posts/deletePost', id)
            .then(
                () => {
                    this.updatePosts();
                },
                error => {
                    this.message = (error.response && error.response.data.error) ||
                                    error.message ||
                                    error.toString();
                } 
            )
        },
        modifyPost(post){ 
            this.$store.dispatch('posts/modifyPost', {
                id: post.id,
                userId: post.user_id,
                forum: 'articles',
                article: this.newArticle,  
            })
            .then(
                () => {
                    this.inModification = 0;
                    this.newArticle = null;
                    this.updatePosts();
                },
                error => {
                    this.message = (error.response && error.response.data.error) ||
                                    error.message ||
                                    error.toString();
                } 
            )
        },
    },
    components:{
      Comment
    }
}
</script>
<style lang="scss">
  body{
    textarea{
      resize: none;
    }
    .h7{
      font-size: 0.8rem;
    }
  }
</style>
