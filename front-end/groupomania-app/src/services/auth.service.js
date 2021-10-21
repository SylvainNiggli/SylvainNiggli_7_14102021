
const API_URL = 'http://localhost:3000/api/auth';

class AuthService {
  login(user) {
    const options = {
      method: "POST",
      body: JSON.stringify({email :user.email, password: user.password}),
      headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
      }     
    };
    fetch(API_URL + `/login`, options)
      .then((res) => {
        if(res.ok){
          return res.json();
        }
      })
      .then((value) => localStorage.setItem("user", JSON.stringify(value)))
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user) {
    const options = {
      method: "POST",
      body: JSON.stringify({pseudo : user.username, email: user.email, password: user.password}),
      headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
      }     
    };
    fetch(API_URL + `/signup`, options)
      .then((res) => {
        if(res.ok){
          return res.json();
        }
      })
      .then((value) => localStorage.setItem("user", JSON.stringify(value)))
  }
}
 /*function login(email, password) {
    var localUser = users.find(user => user.email === email && user.password === password) || null;
    const options = {
      method: "POST",
      body: JSON.stringify({email,password}),
      headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
      }     
    };
    console.log(JSON.stringify({email,password}));
    fetch(API_URL + `/login`, options)
      .then((res) => {
        if(res.ok){
          return res.json();
        }
      })
      .then((value) => console.log(value))
    return localUser;
  }
  
  export { login };*/
  export default new AuthService();