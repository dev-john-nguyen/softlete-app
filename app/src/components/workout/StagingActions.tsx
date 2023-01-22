import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { WorkoutStatus } from '../../services/workout/types';
import BaseColors, { rgba } from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import PrimaryText from '../elements/PrimaryText';


interface Props {
    status: WorkoutStatus;
    onUpdateStatus?: (status: WorkoutStatus) => void;
    athlete?: boolean;
}


const StagingActions = ({ status, onUpdateStatus, athlete }: Props) => {

    const onPress = (s: WorkoutStatus) => {
        if (status === s || athlete) return;
        onUpdateStatus && onUpdateStatus(s)
    }


    return (
        <View style={[styles.container, {
            backgroundColor: status === WorkoutStatus.completed ? rgba(BaseColors.greenRbg, .5) : rgba(BaseColors.primaryRgb, .2),
        }]}>
            <Pressable style={({ pressed }) => [styles.tabContainer, {
                backgroundColor: (pressed && !athlete) ? status === WorkoutStatus.completed ? BaseColors.green : rgba(BaseColors.primaryRgb, .5) : status === WorkoutStatus.pending ? BaseColors.primary : 'transparent',
                borderTopLeftRadius: 100,
                borderBottomLeftRadius: 100,
                borderRadius: status === WorkoutStatus.pending || (pressed && !athlete) ? 100 : undefined,
            }]} onPress={() => onPress(WorkoutStatus.pending)}>
                <PrimaryText styles={{
                    color: status === WorkoutStatus.pending ? BaseColors.white : BaseColors.lightWhite,
                    ...styles.tabText
                }}>Pending</PrimaryText>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.tabContainer, {
                backgroundColor: (pressed && !athlete) ? status === WorkoutStatus.completed ? BaseColors.green : rgba(BaseColors.primaryRgb, .5) : status === WorkoutStatus.inProgress ? BaseColors.primary : 'transparent',
                borderRadius: status === WorkoutStatus.inProgress || (pressed && !athlete) ? 100 : undefined,
            }]}
                onPress={() => onPress(WorkoutStatus.inProgress)}
            >
                <PrimaryText styles={{
                    color: status === WorkoutStatus.inProgress ? BaseColors.white : BaseColors.lightWhite,
                    ...styles.tabText
                }}>Performing</PrimaryText>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.tabContainer, {
                backgroundColor: status === WorkoutStatus.completed ? BaseColors.green : 'transparent',
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
                borderRadius: status === WorkoutStatus.completed || (pressed && !athlete) ? 100 : undefined,
            }]}
                onPress={() => onPress(WorkoutStatus.completed)}
            >
                <PrimaryText styles={{
                    color: status === WorkoutStatus.completed ? BaseColors.white : BaseColors.lightWhite,
                    ...styles.tabText
                }}>Completed</PrimaryText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
        flexDirection: 'row',
        borderRadius: 100,
        alignSelf: 'center',
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    tabText: {
        fontSize: StyleConstants.extraSmallFont,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
})
export default StagingActions;