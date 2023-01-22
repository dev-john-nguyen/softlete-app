import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';
import { WorkoutExerciseProps, WorkoutProps, WorkoutStatus, WorkoutTypes } from '../../services/workout/types';
import StyleConstants from '../tools/StyleConstants';
import MoreSvg from '../../assets/MoreSvg';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import ThumbSvg from '../../assets/ThumbSvg';
import CheckedSvg from '../../assets/CheckedSvg';
import FastImage from 'react-native-fast-image';
import PreviewAerobic from '../workout/preview/PreviewAerobic';

interface Props {
    workout: WorkoutProps;
    onPress: (workoutUid: string) => void;
    onLongPress?: (workoutUid: string) => void;
    onLike: (workoutUid: string) => void;
    likedWoIds: string[];
    uid: string;
}


const AthletePreviewItem = ({ workout, onPress, onLike, likedWoIds, uid }: Props) => {

    const renderColor = (s: WorkoutStatus) => {
        if (!s) return BaseColors.primary;
        switch (s) {
            case WorkoutStatus.completed:
                return BaseColors.green
            case WorkoutStatus.inProgress:
                return BaseColors.primary
            case WorkoutStatus.pending:
                return BaseColors.secondary
            default:
                return BaseColors.primary;
        }

    }

    const renderSecondaryColor = (s: WorkoutStatus) => {
        if (!s) return BaseColors.primary;
        switch (s) {
            case WorkoutStatus.completed:
                return BaseColors.green
            case WorkoutStatus.inProgress:
                return BaseColors.primary
            case WorkoutStatus.pending:
                return BaseColors.secondary
            default:
                return BaseColors.primary;
        }
    }

    const renderExercises = useCallback((e: WorkoutExerciseProps, i: number) => {
        const { exercise, data } = e;
        const sets = data.length;
        const fontColor = renderSecondaryColor(workout.status)
        return (
            <View key={e._id ? e._id : i} style={styles.exerciseContainer}>
                <SecondaryText styles={[styles.exerciseText, {
                    color: BaseColors.lightBlack
                }]} numberOfLines={1}>{exercise ? exercise.name : 'exercise'}</SecondaryText>
                <SecondaryText styles={[styles.text, {
                    color: fontColor
                }]}>{sets} set(s)</SecondaryText>
            </View>
        )
    }, [workout])

    const handleOnLike = () => {
        !isLiked() && onLike(workout._id)
    }

    const isLiked = () => (likedWoIds.find(id => id === workout._id) || workout.likeUids?.find(id => id === uid));

    const renderContent = useCallback(() => {

        if (workout.type === WorkoutTypes.TraditionalStrengthTraining) {
            return (
                <>
                    {
                        workout.exercises && workout.exercises.filter((e, i) => i < 4).map(renderExercises)
                    }
                    {
                        workout.exercises && workout.exercises.length > 4 && (
                            <View style={styles.moreSvg}>
                                <MoreSvg fillColor={BaseColors.secondary} />
                            </View>
                        )
                    }
                </>
            )
        }

        return (
            <PreviewAerobic data={workout.healthData} color={renderColor(workout.status)} />
        )
    }, [workout])

    return (
        <View style={{ marginBottom: 5 }}>
            <Pressable
                onPress={() => onPress(workout._id)}
                style={styles.container}
            >
                {
                    !!workout.imageUri && (
                        <FastImage
                            style={styles.image}
                            source={{ uri: workout.imageUri }}
                        />
                    )
                }
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        <SecondaryText styles={[styles.name, { color: renderColor(workout.status) }]} numberOfLines={1} bold>{workout.name}</SecondaryText>
                        <Pressable style={styles.likeContainer} onPress={handleOnLike} hitSlop={5}>
                            <View style={styles.like}>
                                <ThumbSvg fillColor={renderColor(workout.status)} />
                            </View>
                            {
                                isLiked() && (
                                    <View style={styles.check}>
                                        <CheckedSvg strokeColor={renderColor(workout.status)} />
                                    </View>
                                )
                            }
                        </Pressable>
                    </View>
                    {renderContent()}
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: StyleConstants.borderRadius,
        borderWidth: .5,
        borderColor: BaseColors.lightGrey,
    },
    content: {
        margin: 15
    },
    image: {
        width: '100%',
        height: normalize.height(5),
        borderTopRightRadius: StyleConstants.borderRadius,
        borderTopLeftRadius: StyleConstants.borderRadius
    },
    likeContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderRadius: 100,
    },
    like: {
        width: normalize.width(25),
        height: normalize.width(25)
    },
    check: {
        width: normalize.width(40),
        height: normalize.width(40),
        marginLeft: 5
    },
    moreSvg: {
        height: normalize.width(30),
        width: normalize.width(30),
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
        alignItems: 'center'
    },
    exerciseContainer: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    name: {
        fontSize: StyleConstants.smallFont,
        textTransform: 'capitalize',
        maxWidth: '90%'
    },
    exerciseText: {
        fontSize: normalize.width(28),
        color: BaseColors.secondary,
        textTransform: 'capitalize',
        flex: 1
    },
    text: {
        fontSize: normalize.width(28),
        color: BaseColors.secondary,
        flex: .3,
        textAlign: 'right'
    },
    copied: {
        color: BaseColors.white,
        fontSize: StyleConstants.extraSmallFont
    }
})
export default AthletePreviewItem;