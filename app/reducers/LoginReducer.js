'use-strict'

import Immutable from 'immutable';
import * as types from '../actions/ActionTypes';

import {
    Map,
    List,
    fromJS
} from 'immutable';

const initialState = Immutable.fromJS({
    username: null,
    accessToken: null,
    refreshToken: null,
    expiresOn: null, //time millis in long format
    pushToken: null,
    pushTokenOS: null,
    isLoggedIn: false,
    roles: null,
    email: null,
    fullname: null,
    mobileNo: null,
    error: null,
    previousUsername: null,
    isLoading: false,
    namaKantor: null,
    kodeKantor: null
}, );

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_SET_INFO:
            state = state.set('isLoading', true)
                .set('error', null);
            break;

        case types.AUTH_SET_TOKEN:

            const currentTime = new Date();

            // hard code for testing session expiration
            // const expTime = currentTime.getTime() + 60 * 1000;
            const expTime = currentTime.getTime() + action.token.expires_in * 1000;
            console.log("Token current time: " + currentTime);
            console.log("Token expire time: " + new Date(expTime));
            
            state = state.set('accessToken', action.token.access_token)
                .set('refreshToken', action.token.refresh_token)
                .set('expiresOn', expTime)
                .set('username', action.username)
                .set('roles', action.token.roles)
                .set('email', action.token.email)
                .set('fullname', action.token.full_name)
                .set('mobileNo', action.token.mobile_no)
                .set('namaKantor', action.token.nama_kantor)
                .set('kodeKantor', action.token.kode_kantor)
                .set('error', null)
                .set('isLoggedIn', true)
                .set('isLoading', false);

            break;

        case types.AUTH_TOKEN_VERIFIED:
            //state = state.set('accessToken', action.token.access_token);
            state = state.set('error', null)
                .set('isLoggedIn', true)
                .set('isLoading', false);
            break;

        case types.AUTH_TOKEN_EXPIRED:
            state = state.set('accessToken', null)
                .set('isLoggedIn', false)
                .set('error', null)
                .set('expiresOn', null)
                .set('isLoading', false);
            break;

        case types.AUTH_REMOVE_TOKEN:
            console.log("Removing Token");
            var previousUsername = state.get('username');
            state = state.set('accessToken', null)
                .set('refreshToken', null)
                .set('username', null)
                .set('roles', null)
                .set('email', null)
                .set('fullname', null)
                .set('mobileNo', null)
                .set('namaKantor', null)
                .set('kodeKantor', null)
                .set('expiresOn', null)
                .set('error', null)
                .set('isLoggedIn', false)
                .set('isLoading', false)
                .set('previousUsername', previousUsername);

            break;

        case types.AUTH_LOGIN_ERROR:
            state = state.set('error', action.error.cause || action.error)
                .set('isLoggedIn', false)
                .set('isLoading', false);
            break;


        case types.PUSH_NOTIFICATION_SET_TOKEN:
            state = state.set('pushToken', action.token.token)
                .set('pushTokenOS', action.token.os);

            break;


    }

    return state;

}

export default loginReducer;
