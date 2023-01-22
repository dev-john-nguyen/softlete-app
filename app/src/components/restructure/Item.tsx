import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import PrimaryText from '../elements/PrimaryText';
import { HEIGHT } from './utils';
import { WorkoutExerciseProps } from '../../services/workout/types';
import SecondaryText from '../elements/SecondaryText';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import Constants from '../../utils/Constants';
import StyleConstants from '../tools/StyleConstants';
import TrashSvg from '../../assets/TrashSvg';


interface Props {
    exercise: WorkoutExerciseProps;
    onRemove: (id: string) => void;
    movingGroup: string;
}


const RestructureItem = ({ exercise, onRemove, movingGroup }: Props) => {

    const data = exercise.exercise ? exercise.exercise.name : ''

    return (
        <View style={styles.container}>
            <SecondaryText styles={styles.name} numberOfLines={1} bold>{data}</SecondaryText>
            {
                !!movingGroup &&
                <View style={styles.groupContainer}>
                    {
                        movingGroup === 'trash' ?
                            <View style={styles.trash}>
                                <TrashSvg fillColor={BaseColors.black} />
                            </View>
                            :
                            <SecondaryText styles={styles.groupText} bold={true}>{Constants.abc[parseInt(movingGroup)]}</SecondaryText>

                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        width: '100%',
        padding: 10,
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    kettle: {
        width: normalize.width(7),
        height: normalize.width(7),
        marginRight: 10
    },
    groupContainer: {
        position: 'absolute',
        top: 0,
        left: '105%',
    },
    groupText: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary
    },
    name: {
        color: BaseColors.black,
        textTransform: 'capitalize',
        fontSize: StyleConstants.smallFont,
        flex: 1,
    },
    trash: {
        height: normalize.width(25),
        width: normalize.width(25),
    }
})
export default RestructureItem;