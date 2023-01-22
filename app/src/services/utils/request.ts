import auth from '@react-native-firebase/auth';
import axios, { Method } from 'axios';
import { AppDispatch } from '../../../App';
import { setBanner } from '../banner/actions';
import messages from './messages';
import { SIGNOUT_USER } from '../user/actionTypes';
import { SERVERURL } from '../../utils/PATHS';
import { BannerTypes } from '../banner/types';

export function setAuthHeader(authToken: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}

export function removeAuthHeader() {
    axios.defaults.headers.common['Authorization'] = undefined;
}

export async function resetAuthHeader() {
    const user = auth().currentUser;

    if (!user) return false;

    const newAuthToken = await user.getIdToken();

    setAuthHeader(newAuthToken)
    return true;
}

export async function sendRequest(method: Method, path: string, data?: any): Promise<{ data?: any, errorMessage?: string, deniedAccess?: boolean }> {
    const base = {
        method: method,
        url: SERVERURL + path
    }

    let result: any;

    try {
        switch (method) {
            case 'POST':
                result = await axios({
                    ...base,
                    data: data
                })
                break;
            case 'GET':
            default:
                result = await axios({
                    ...base
                })
        }
    } catch (err: any) {
        console.log(err, path)
        if (err.response) {
            const { data } = err.response;
            if (!data.tokenExpired) {
                //check if an html responses gets sent back
                if (data && typeof data === 'string' && data[0] !== '<') {
                    return { errorMessage: data }
                } else {
                    return { errorMessage: messages.defaultError }
                }
            }
            //skips to trying again...
            return { deniedAccess: true }
        }

        if (err.message === 'Network Error') {
            return { errorMessage: 'There was a network error. Please check your internet connection.' }
        }

        if (err.code && err.code === 'ECONNABORTED') {
            return {
                errorMessage: 'The request timed out. Please ensure you have a good network connection.'
            }
        }


        return { errorMessage: messages.defaultError }

    }

    if (result) return result as { data: any };

    return { errorMessage: messages.defaultError }
}

export default async function request(method: Method, path: string, dispatch: AppDispatch, data?: any): Promise<{ data?: any, networkError?: boolean }> {

    //check auth and update if no there
    if (!axios.defaults.headers.common['Authorization']) {
        const isUpdated = await resetAuthHeader();
        if (!isUpdated) {
            //user is logged out
            //will need to relogin
            dispatch({ type: SIGNOUT_USER })
            return {};
        }
    }

    const resultOne = await sendRequest(
        method,
        path,
        data
    )

    if (resultOne.errorMessage) {
        if (resultOne.errorMessage === 'There was a network error. Please check your internet connection.') {
            dispatch(setBanner(BannerTypes.error, resultOne.errorMessage))
            return { networkError: true };
        } else {
            dispatch(setBanner(BannerTypes.error, resultOne.errorMessage))
            return {};
        }
    }

    if (resultOne.data) return resultOne;

    //only try again if deniedAcess is true
    if (!resultOne.deniedAccess) return {};

    //possible token expire try again with new token
    const isUpdated = await resetAuthHeader();

    if (!isUpdated) {
        dispatch({ type: SIGNOUT_USER })
        return {};
    }


    const resultTwo = await sendRequest(
        method,
        SERVERURL + path,
        data
    )

    if (resultTwo.errorMessage) {
        dispatch(setBanner(BannerTypes.error, resultTwo.errorMessage))
        return {};
    }

    if (resultTwo.data) return resultTwo;

    //all attempts
    if (resultOne.deniedAccess) {
        dispatch(setBanner(BannerTypes.error, "Looks like you don't have permission. Try logging in again."))
        return {};
    }

    dispatch(setBanner(BannerTypes.error, messages.defaultError))
    return {}
}