import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import CheckedSvg from '../../assets/CheckedSvg';
import ThumbSvg from '../../assets/ThumbSvg';
import BaseColors, { rgba } from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import PrimaryText from '../elements/PrimaryText';
import StyleConstants from '../tools/StyleConstants';


interface Props {
    likeCount: number;
    isLiked: boolean;
    onLikePress?: () => void;
}


const ProgramLike = ({ onLikePress, likeCount, isLiked }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onLikePress}>
            <View style={styles.like}>
                <ThumbSvg fillColor={BaseColors.primary} />
            </View>
            <PrimaryText styles={styles.likeNum}>{likeCount}</PrimaryText>
            {
                isLiked && (
                    <View style={styles.check}>
                        <CheckedSvg strokeColor={BaseColors.primary} />
                    </View>
                )
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: rgba(BaseColors.whiteRbg, .8),
        borderRadius: 100,
        padding: 10,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '5%',
        right: '5%'
    },
    like: {
        width: normalize.width(25),
        height: normalize.width(25)
    },
    likeNum: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.primary,
        marginLeft: 5
    },
    check: {
        width: normalize.width(35),
        height: normalize.width(35),
        marginLeft: 5
    },
})
export default ProgramLike;