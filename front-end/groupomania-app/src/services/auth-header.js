class AuthHeader{
    authHeader() {
        let user = JSON.parse(localStorage.getItem("user"));
    
        if(user && user.token) {
            return {'Authorization' : 'Bearer ' + user.token };
            
        } else {
            return {};
        }
    }
    authHeaderFile(){
        let user = JSON.parse(localStorage.getItem("user"));
    
        if(user && user.token) {
            return {
                'Authorization' : 'Bearer ' + user.token ,
                'Content-Type': 'multipart/form-data'
            };
            
        } else {
            return {};
        }
    }
}

export default new AuthHeader();