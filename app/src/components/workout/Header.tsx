import React from 'react';
import { View, StyleSheet } from 'react-native';
import PrimaryText from '../elements/PrimaryText';
import SecondaryText from '../elements/SecondaryText';
import BaseColors, { rgba } from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import { normalize } from '../../utils/tools';
import { ViewWorkoutProps, WorkoutStatus } from '../../services/workout/types';
import { GeneratedProgramProps } from '../../services/program/types';
import DateTools from '../../utils/DateTools';
import { SafeAreaView } from 'react-native-safe-area-context';
import FolderSvg from '../../assets/FolderSvg';
import LikeCom from '../Like';
import StagingActions from './StagingActions';


interface Props {
    workout: ViewWorkoutProps;
    program?: GeneratedProgramProps | undefined;
    onUpdateStatus?: (status: WorkoutStatus) => void;
    athlete?: boolean;
    isLiked?: boolean;
    onLikePress?: () => void;
    likeUids: string[];
    template?: boolean;
}


const WorkoutHeader = ({ workout, program, onUpdateStatus, athlete, onLikePress, isLiked, likeUids, template }: Props) => {

    const renderProgramHeader = () => {
        if (!program) return '';

        const dObj = DateTools.UTCISOToLocalDate(program.startDate);
        if (!dObj) return program.name;
        const dStr = DateTools.dateToStr(dObj)
        const monthDayStr = DateTools.strToMMDD(dStr);
        return monthDayStr + ' ' + program.name
    }

    return (
        <View>
            {
                !template && (
                    <StagingActions
                        onUpdateStatus={onUpdateStatus}
                        status={workout.status}
                        athlete={athlete}
                    />
                )
            }
            <SafeAreaView edges={['bottom']} style={styles.container}>

                <View style={styles.leftHeader}>
                    <View style={styles.titleContainer}>
                        <PrimaryText styles={[styles.name, { color: workout.status === WorkoutStatus.completed ? BaseColors.green : BaseColors.lightWhite }]}>{workout.name}</PrimaryText>
                    </View>
                    {!!workout.description && <SecondaryText styles={styles.des}>{workout.description}</SecondaryText>}
                    {program && <View style={styles.programContainer}>
                        <View style={styles.programSvg}>
                            <FolderSvg strokeColor={BaseColors.primary} />
                        </View>
                        <SecondaryText styles={styles.programTxt}>{renderProgramHeader()}</SecondaryText>
                    </View>}
                </View>


                {
                    !template && <View style={styles.rightContainer}>
                        <LikeCom
                            likeUids={likeUids}
                            status={workout.status}
                            isLiked={isLiked}
                            onLikePress={onLikePress}
                        />
                    </View>
                }
            </SafeAreaView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
        paddingTop: StyleConstants.baseMargin,
        paddingBottom: StyleConstants.smallMargin,
        marginTop: StyleConstants.smallMargin,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: rgba(BaseColors.lightWhiteRgb, .2)
    },
    rightContainer: {
        flex: .2,
    },
    name: {
        fontSize: StyleConstants.smallMediumFont,
        textTransform: 'capitalize',
        width: '100%'
    },
    des: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite
    },
    leftHeader: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    programContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    programSvg: {
        width: normalize.width(25),
        height: normalize.width(25),
        marginRight: 5
    },
    programTxt: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.lightWhite
    },
    svg: {
        height: normalize.width(12),
        width: normalize.width(12),
        marginLeft: StyleConstants.smallMargin
    }
})
export default WorkoutHeader;