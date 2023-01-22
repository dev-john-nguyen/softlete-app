import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import CheckedSvg from '../assets/CheckedSvg';
import ThumbSvg from '../assets/ThumbSvg';
import { WorkoutStatus } from '../services/workout/types';
import BaseColors from '../utils/BaseColors';
import { normalize } from '../utils/tools';
import PrimaryText from './elements/PrimaryText';
import StyleConstants from './tools/StyleConstants';


interface Props {
    likeUids: string[];
    status: WorkoutStatus;
    isLiked?: boolean;
    onLikePress?: () => void;
}


const LikeCom = ({ likeUids, status, isLiked, onLikePress }: Props) => {

    const renderLikeCount = () => {
        let count = likeUids.length;
        if (isLiked) {
            count++
        }
        return count;
    }

    return (
        <View style={styles.container}>
            <Pressable style={[styles.dumbContainer, {
                backgroundColor: status === WorkoutStatus.completed ? BaseColors.lightGreen : BaseColors.lightPrimary
            }]} onPress={onLikePress}>
                <View style={styles.thumb}>
                    <ThumbSvg fillColor={status === WorkoutStatus.completed ? BaseColors.green : BaseColors.primary} />
                </View>
                <PrimaryText styles={[styles.likeNum, {
                    color: status === WorkoutStatus.completed ? BaseColors.green : BaseColors.primary
                }]}>{renderLikeCount()}</PrimaryText>
                {
                    isLiked && (
                        <View style={styles.check}>
                            <CheckedSvg strokeColor={status === WorkoutStatus.completed ? BaseColors.green : BaseColors.primary} />
                        </View>
                    )
                }
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red'
    },
    likeNum: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.primary,
        marginLeft: 5
    },
    thumb: {
        width: normalize.width(20),
        height: normalize.width(20)
    },
    dumbContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: '2%',
        top: '-10%',
        zIndex: 100,
        backgroundColor: BaseColors.lightPrimary,
        borderRadius: 100,
        flexDirection: 'row',
        padding: 10
    },
    check: {
        width: normalize.width(30),
        height: normalize.width(30),
        marginLeft: 5
    },
})
export default LikeCom;