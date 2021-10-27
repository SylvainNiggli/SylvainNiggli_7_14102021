import axios from 'axios';
import AuthHeader from './auth-header.js'

const API_URL = 'http://localhost:3000/api/posts/';

class PostsService {
    getPostsByForumType(forum) {
        return axios
            .get(API_URL + `forum/${forum}`, { headers: AuthHeader.authHeader() })
            .then(response => {
                if (response.data) {
                    response.data.forEach( post => {
                        post.title = post.comment.slice(0,40);
                        post.timeAgo = this.getTimeAgo(post);
                    })
                }
                return response.data;
        });
    }

    getCommentsByPost(postId) {
        return axios
            .get(API_URL + `${postId}/comments`, { headers: AuthHeader.authHeader() })
            .then(response => {
                if (response.data) {
                    response.data.forEach( post => {
                        post.timeAgo = this.getTimeAgo(post);
                    })
                }
                return response.data;
        });
    }

    getTimeAgo(post){
            let now = new Date();
            let chaineTime = '';
            if(post.date_modification === null){
                let differenceTime = (now - Date.parse(post.date_creation)) / 1000;
                if(differenceTime > 31536000 ){
                    chaineTime = ` ${ Math.floor(differenceTime / 31536000) } a`;
                }else if(differenceTime > 2592000){
                    chaineTime = ` ${ Math.floor(differenceTime / 2592000) } m`;
                }else if(differenceTime > 86400){
                    chaineTime = ` ${ Math.floor(differenceTime / 86400) } j`;
                }else if(differenceTime > 3600){
                    chaineTime = ` ${ Math.floor(differenceTime / 3600) } h`;
                }else if(differenceTime > 60){
                    chaineTime = ` ${ Math.floor(differenceTime / 60) } min`;
                }else{
                    chaineTime = ' <1 min';
                }
            }else{
                let differenceTime = (now - Date.parse(post.date_modification)) / 1000;
                chaineTime = ' modifié il y a';
                if(differenceTime > 31536000 ){
                    chaineTime += ` ${ Math.floor(differenceTime / 31536000) } a`;
                }else if(differenceTime > 2592000){
                    chaineTime += ` ${ Math.floor(differenceTime / 2592000) } m`;
                }else if(differenceTime > 86400){
                    chaineTime += ` ${ Math.floor(differenceTime / 86400) } j`;
                }else if(differenceTime > 3600){
                    chaineTime += ` ${ Math.floor(differenceTime / 3600) } h`;
                }else if(differenceTime > 60){
                    chaineTime += ` ${ Math.floor(differenceTime / 60) } min`;
                }else{
                    chaineTime += ' <1 min';
                }
            }
            return chaineTime;
        }

    setPost(post){
        var formData = new FormData();
            if(post.file){
                formData.append("image", post.file, 'imagePost');           
            }
            formData.append("post[userId]", post.userId);
            formData.append("post[forum]", post.forum);
            formData.append("post[comment]", post.article);
    
            return axios.post(API_URL, formData , {
                headers: AuthHeader.authHeaderFile()
            })
    }

    setComment(comment){
        return axios.post(API_URL + `${ comment.postId }/comments`, { comment: {
            userId: comment.userId,
            forum: comment.forum,
            comment: comment.response,
        }},
        { headers: AuthHeader.authHeader() });
    }

    modifyPost(post){
        return axios.put(API_URL + `${post.id}`, { post: {
            userId: post.userId,
            forum: post.forum,
            comment: post.article,
        }},
        { headers: AuthHeader.authHeader() });
    }

    deletePost(id){
        return axios.delete(API_URL + `${id}` , { headers: AuthHeader.authHeader() });
    }
}

export default new PostsService() ;