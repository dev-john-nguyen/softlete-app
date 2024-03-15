import auth from '@react-native-firebase/auth';
import axios, { Method } from 'axios';
import { setBanner } from '../banner/actions';
import messages from './messages';
import { SIGNOUT_USER } from '../user/actionTypes';
import { SERVERURL } from '../../utils/PATHS';
import { BannerTypes } from '../banner/types';
import { defaultErrorMsg } from 'src/utils/Constants';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const undefinedResult = { data: undefined };

export function getRequestURL(path: string) {
  return SERVERURL + path;
}

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

  setAuthHeader(newAuthToken);
  return true;
}

export async function sendRequest(
  method: Method,
  path: string,
  data?: any,
): Promise<{ data: any; errorMessage?: string; deniedAccess?: boolean }> {
  const base = {
    method: method,
    url: SERVERURL + path,
  };

  let result: any;

  try {
    switch (method) {
      case 'POST':
        result = await axios({
          ...base,
          data: data,
        });
        break;
      case 'GET':
      default:
        result = await axios({
          ...base,
        });
    }
  } catch (err: any) {
    console.log(err, path);
    if (err.response) {
      const { data } = err.response;
      if (!data.tokenExpired) {
        //check if an html responses gets sent back
        if (data && typeof data === 'string' && data[0] !== '<') {
          return { errorMessage: data, ...undefinedResult };
        } else {
          return { errorMessage: messages.defaultError, ...undefinedResult };
        }
      }
      //skips to trying again...
      return { deniedAccess: true, ...undefinedResult };
    }

    if (err.message === 'Network Error') {
      return {
        errorMessage: defaultErrorMsg,
        ...undefinedResult,
      };
    }

    if (err.code && err.code === 'ECONNABORTED') {
      return {
        errorMessage:
          'The request timed out. Please ensure you have a good network connection.',
        ...undefinedResult,
      };
    }

    return { errorMessage: messages.defaultError, ...undefinedResult };
  }

  if (result) return result as { data: any };

  return { errorMessage: messages.defaultError, ...undefinedResult };
}

export interface Request<DataType = undefined> {
  data: DataType;
  networkError?: boolean;
}

export default async function request<DataType>(
  method: Method,
  path: string,
  dispatch: any,
  data?: any,
): Promise<Request<DataType>> {
  //check auth and update if no there
  if (!axios.defaults.headers.common['Authorization']) {
    const isUpdated = await resetAuthHeader();
    if (!isUpdated) {
      //user is logged out
      //will need to relogin
      dispatch({ type: SIGNOUT_USER });
      return undefinedResult as Request<DataType>;
    }
  }

  const resultOne = await sendRequest(method, path, data);

  if (resultOne.errorMessage) {
    if (resultOne.errorMessage === defaultErrorMsg) {
      dispatch(setBanner(BannerTypes.error, resultOne.errorMessage));
      return { networkError: true, data: undefined } as Request<DataType>;
    } else {
      dispatch(setBanner(BannerTypes.error, resultOne.errorMessage));
      return undefinedResult as Request<DataType>;
    }
  }

  if (resultOne.data) return resultOne;

  // only try again if deniedAcess is true
  if (!resultOne.deniedAccess) return undefinedResult as Request<DataType>;

  // possible token expire try again with new token
  const isUpdated = await resetAuthHeader();

  if (!isUpdated) {
    dispatch({ type: SIGNOUT_USER });
    return undefinedResult as Request<DataType>;
  }

  await sleep(3000);

  const resultTwo = await sendRequest(method, path, data);

  if (resultTwo.errorMessage) {
    dispatch(setBanner(BannerTypes.error, resultTwo.errorMessage));
    return undefinedResult as Request<DataType>;
  }

  if (resultTwo.data) return resultTwo;

  // all attempts
  if (resultOne.deniedAccess) {
    dispatch(
      setBanner(
        BannerTypes.error,
        "Looks like you don't have permission. Try logging in again.",
      ),
    );
    return undefinedResult as Request<DataType>;
  }

  dispatch(setBanner(BannerTypes.error, messages.defaultError));
  return undefinedResult as Request<DataType>;
}
