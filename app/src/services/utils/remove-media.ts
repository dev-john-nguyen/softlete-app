import storage from '@react-native-firebase/storage';

const removeMedia = async (uris?: (string | undefined)[]) => {
    //create full path
    if (!uris) return;
    try {
        for (let i = 0; i < uris.length; i++) {
            const uri = uris[i]
            if (!uri) continue;
            const storageRef = storage().refFromURL(uri)
            await storageRef.delete()
        }
    } catch (err) {
        console.log(err)
    }
}

export default removeMedia;