import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Chevron from '../../../assets/ChevronSvg';
import WarningSvg from '../../../assets/WarningSvg';
import SecondaryText from '../../../components/elements/SecondaryText';
import StyleConstants from '../../../components/tools/StyleConstants';
import ReflectionImage from '../../../components/workout/overview/ReflectionImage';
import { ReducerProps } from '../../../services';
import { UserProps } from '../../../services/user/types';
import { WorkoutProps } from '../../../services/workout/types';
import BaseColors from '../../../utils/BaseColors';
import { normalize } from '../../../utils/tools';
import reportUser from '../../utils/report-user';
import { NetworkStackScreens } from '../types';


interface Props {
    workout: WorkoutProps;
    navigation: any;
    user: UserProps;
}


const OverviewModal = ({ workout, navigation, user }: Props) => {
    const insets = useSafeAreaInsets();

    const onNavBack = () => navigation.navigate(NetworkStackScreens.AthleteWorkout);

    const onReportImage = () => {
        if (!workout.imageUri) return;
        reportUser(workout.userUid)
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.report} hitSlop={5} onPress={onReportImage}>
                <WarningSvg fillColor={BaseColors.red} />
            </Pressable>
            <ReflectionImage
                setImage={() => undefined}
                image={{
                    uri: workout.imageUri,
                    base64: workout.imageBase64
                }}
                imageUri={workout.imageUri}
                allowUpload={false}
            />
            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
                <View>
                    <SecondaryText styles={styles.text}>{workout.reflection}</SecondaryText>
                </View>
                <Pressable style={styles.closeContainer} onPress={onNavBack}>
                    <View style={styles.chev}>
                        <Chevron strokeColor={BaseColors.primary} />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    report: {
        position: 'absolute',
        top: '2%',
        right: '3%',
        height: normalize.width(20),
        width: normalize.width(20),
        zIndex: 100
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
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
    workout: state.athletes.viewWorkout,
    user: state.user
})

export default connect(mapStateToProps)(OverviewModal);