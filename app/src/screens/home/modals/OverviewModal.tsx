import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Chevron from '../../../assets/ChevronSvg';
import StyleConstants from '../../../components/tools/StyleConstants';
import { ReducerProps } from '../../../services';
import { HealthDataProps, ViewWorkoutProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import { HomeStackScreens } from '../types';
import { updateWoHealthData } from '../../../services/workout/actions';
import AerobicContainer from '../../../components/workout/overview/Container';

interface Props {
    workout: ViewWorkoutProps;
    navigation: any;
    dispatch: any;
}


const OverviewModal = ({ workout, navigation, dispatch }: Props) => {
    const insets = useSafeAreaInsets();

    const onNavBack = () => navigation.navigate(HomeStackScreens.Workout);

    const onImportData = (workoutUid: string, data: HealthDataProps) => dispatch(updateWoHealthData(workoutUid, data))

    return (
        <View style={styles.container}>
            <AerobicContainer
                workout={workout}
                updateWoHealthData={onImportData}
                navigation={navigation}
            />
            <Pressable style={[styles.closeContainer, { paddingBottom: insets.bottom }]} onPress={onNavBack}>
                <View style={styles.chev}>
                    <Chevron strokeColor={BaseColors.primary} />
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    },
    import: {
        fontSize: StyleConstants.extraSmallFont,
        marginBottom: StyleConstants.smallMargin,
        alignSelf: 'flex-start'
    },
    content: {
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
        flex: 1,
        justifyContent: 'space-between'
    },
    closeContainer: {
        padding: 10
    },
    chev: {
        width: normalize.width(15),
        height: normalize.width(15),
        alignSelf: 'center',
        transform: [{ rotate: '-90deg' }]
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    workout: state.workout.viewWorkout,
})

export default connect(mapStateToProps)(OverviewModal);