import PostsService from '../services/posts.service.js';

export const posts = {
    namespaced: true,
    state: {
        posts: null ,
        status: {
            postCreated: false,
            commentCreated: false,
            postDeleted: false,
            postModified: false
        }
    },
    actions: {
        getPostsByForum( { commit }, forum) {
            return PostsService.getPostsByForumType(forum)
                .then(
                    posts =>{
                        commit('getPostsByForumSuccess', posts);
                        return Promise.resolve(posts);
                    },
                    error => {
                        commit('getPostsByForumFailure');
                        return Promise.reject(error);
                    }
                );
        },
        getCommentsByPost( { commit }, postId) {
            return PostsService.getCommentsByPost(postId)
                .then(
                    comments =>{
                        commit('getCommentsSuccess', {comments, postId});
                        return Promise.resolve(comments);
                    },
                    error => {
                        commit('getCommentsFailure');
                        return Promise.reject(error, postId);
                    }
                );
        },
        setPost( { commit }, post) {
            return PostsService.setPost(post)
            .then(
                post => {
                    commit('setPostSuccess', post);
                    return Promise.resolve(post);
                },
                error => {
                    commit('setPostFailure');
                    return Promise.reject(error);
                }
            );
        },
        setComment( { commit }, comment) {
            return PostsService.setComment(comment)
            .then(
                comment => {
                    commit('setCommentSuccess', comment);
                    return Promise.resolve(comment);
                },
                error => {
                    commit('setCommentFailure');
                    return Promise.reject(error);
                }
            );
        },
        modifyPost( { commit }, post){
            return PostsService.modifyPost(post)
            .then(
                post => {
                    commit('modifyPostSuccess', post);
                    return Promise.resolve(post);
                },
                error => {
                    commit('modifyPostFailure');
                    return Promise.reject(error);
                }
            );
        },
        deletePost( { commit }, id){
            return PostsService.deletePost(id)
            .then(
                () => {
                    commit('deleteSuccess');
                    return Promise.resolve();
                },
                error => {
                    commit('deleteFailure');
                    return Promise.reject(error);
                }
            )           
        },
    },
    mutations: {
        getPostsByForumSuccess(state,posts) {
            posts.forEach( post => post.comments = []);
            state.posts = posts;
            state.status.postCreated = false;
            state.status.postModified = false;
            state.status.postDeleted = false;
            state.status.commentCreated = false;
        },
        getPostsByForumFailure(state) {
            state.posts = null;
            state.status.postCreated = false;
        },
        getCommentsSuccess(state, payload) {
            var comments = payload.comments;
            var postId = payload.postId;
            if(comments && postId){
                state.posts.find(post => post.id === postId).comments = [];
                state.posts.find(post => post.id === postId).comments.push(...comments);
            } 
            state.status.postCreated = false;
            state.status.postModified = false;
            state.status.postDeleted = false;
            state.status.commentCreated = false;
        },
        getCommentsFailure(state, error, postId) {
            state.posts.find(post => post.id === postId).comments = null;
            state.status.postCreated = false;
        },
        setPostSuccess(state){
            state.status.postCreated = true;
        },
        setPostFailure(state){
            state.status.postCreated = false;
        },
        setCommentSuccess(state){
            state.status.commentCreated = true;
        },
        setCommentFailure(state){
            state.status.commentCreated = false;
        },
        modifyPostSuccess(state){
            state.status.postModified = true;
        },
        modifyPostFailure(state){
            state.status.postModified = false;
        },
        deleteSuccess(state){
            state.status.postDeleted = true;
        },
        deleteFailure(state){
            state.status.postDeleted = false;
        },
    }
}