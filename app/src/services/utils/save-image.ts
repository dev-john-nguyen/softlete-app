import storage from '@react-native-firebase/storage';
import { AppDispatch } from '../../../App';
import { setBanner } from '../banner/actions';
import { BannerTypes } from '../banner/types';
import messages from './messages';

export default (base64: string, path: string) => async (dispatch?: AppDispatch) => {
    //create full path
    const storageRef = storage().ref(path);

    try {
        await storageRef.putString(base64, 'base64')
    } catch (err: any) {
        console.log(err)
        switch (err.code) {
            case 'storage/unauthorized':
                dispatch && dispatch(setBanner(BannerTypes.error, messages.permissionDenied))
                break;
            case 'storage/canceled':
                dispatch && dispatch(setBanner(BannerTypes.error, messages.cancel))
                break;
            default:
                dispatch && dispatch(setBanner(BannerTypes.error, messages.defaultImageError))
        }
        return '';
    }

    let uri = ''

    try {
        uri = await storageRef.getDownloadURL()
    } catch (err) {
        console.log(err)
        return '';
    }

    return uri;
}