import AuthService from '../services/auth.service.js';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? 
{ status: { loggedIn: true }, user } :
{ status: { loggedIn: false}, user: null};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login( { commit }, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        logout( { commit }) {
            AuthService.logout();
            commit('logout');
        },
        register( { commit }, user) {
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess');
                    return Promise.resolve(response);
                },
                error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                }
            );
        },

        modifyUser( { commit }, user){
            return AuthService.modifyUser(user).then(
                response => {
                    commit('modifySuccess', response);
                    return Promise.resolve(response);
                },
                error => {
                    return Promise.reject(error);
                }
            )
        },
        delete( { commit }, id){
            return AuthService.delete(id).then(
                response => {
                    commit('deleteSuccess');
                    return Promise.resolve(response);
                },
                error => {
                    return Promise.reject(error);
                }
            )
        }
    },
    mutations: {
        loginSuccess(state,user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        deleteSuccess(state) {
            state.user = null;
        },
        modifySuccess(state, user) {
            state.user.email = user.email;
            state.user.avatar = user.avatar;
        }
    }
}