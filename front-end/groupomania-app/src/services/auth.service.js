
import axios from 'axios';
import AuthHeader from './auth-header.js'

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if(response.data.token){
          localStorage.setItem('user',JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    })
  }
  
  modifyUser(user){
    var formData = new FormData();
      if(user.file){
        formData.append("image", user.file, 'avatar')
      }
      formData.append("email",user.email);
      formData.append("avatar", user.avatar);
      return axios.put(API_URL + `users/${ user.userId }`, formData, {
        headers: AuthHeader.authHeaderFile()
      })
      .then(response => {
        let user = JSON.parse(localStorage.getItem('user'));
        user.email = response.data.email;
        user.avatar = response.data.avatar;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      })
  }

  delete(id) {
    return axios.delete(API_URL + `users/${ id }`,{ headers: AuthHeader.authHeader() })
    .then(response => {
      return response.data;
    });
  }
}

export default new AuthService() ;