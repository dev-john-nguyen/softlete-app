import React, { useContext } from 'react';
import { View, StyleSheet, Pressable, Keyboard } from 'react-native';
import StyleConstants from '../../tools/StyleConstants';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';;
import { WorkoutProps, WorkoutStatus } from '../../../services/workout/types';
import Input from '../../elements/Input';
import { ImageProps } from '../../../services/user/types';
import ReflectionImage from './ReflectionImage';
import WorkoutContext from '../../../screens/context/workout/Context';


interface Props {
    workout: WorkoutProps;
    setImage: (img: ImageProps) => void;
    image?: ImageProps;
}

const WorkoutReflection = ({ workout, image, setImage }: Props) => {
    const { reflection, setReflection } = useContext(WorkoutContext);
    return (
        <View style={styles.container}>
            <Pressable onPress={() => Keyboard.dismiss()}>
                <ReflectionImage
                    setImage={setImage}
                    image={image}
                    imageUri={workout.imageUri ? workout.imageUri : workout.localImageUri}
                    allowUpload={workout.status === WorkoutStatus.inProgress}
                />
                <Input
                    value={reflection}
                    onChangeText={(txt) => setReflection?.(txt)}
                    placeholder='Write a caption...'
                    multiline={true}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    blurOnSubmit={true}
                    maxLength={200}
                    styles={{ marginTop: StyleConstants.baseMargin, borderRadius: 0 }}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
        alignSelf: 'flex-end',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    completeContainer: {
        padding: 15,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'center',
        margin: StyleConstants.baseMargin
    },
    completeText: {
        fontSize: StyleConstants.smallFont,
        textTransform: 'uppercase',
        color: BaseColors.white,
        letterSpacing: 1
    },
    label: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite,
        marginBottom: 5
    },
    txtContainer: {
        marginBottom: StyleConstants.baseMargin,
    },
    txt: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite,
        padding: StyleConstants.baseMargin
    },
    shareContainer: {
        alignSelf: 'flex-end',
        fontSize: StyleConstants.extraSmallFont
    },
})
export default WorkoutReflection;