import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { HealthDataProps, HealthDisMeas, ViewWorkoutProps, WorkoutActionProps, WorkoutStatus } from '../../../services/workout/types';
import StyleConstants, { moderateScale } from '../../tools/StyleConstants';
import WorkoutReflection from './Reflection';
import { ImageProps } from '../../../services/user/types';
import AutoId from '../../../utils/AutoId';
import HealthContainer from './HealthContainer';
import HealthImportContainer from './HealthImportContainer';
import AppleHealthKit from 'react-native-health';
import HealthForm from './forms/HealthForm';
import { capitalize, normalize } from '../../../utils/tools';
import _ from 'lodash';
import SecondaryText from '../../elements/SecondaryText';
import BaseColors from '../../../utils/BaseColors';
import PencilSvg from '../../../assets/PencilSvg';
import CloseSvg from '../../../assets/CloseSvg';


interface Props {
    navigation?: any;
    workout: ViewWorkoutProps;
    updateWoHealthData?: WorkoutActionProps['updateWoHealthData'];
    athlete?: boolean;
    image?: ImageProps;
    setImage: React.Dispatch<React.SetStateAction<ImageProps | undefined>>;
}


const OverviewContainer = ({ navigation, workout, updateWoHealthData, athlete, image, setImage }: Props) => {
    const [showImport, setShowImport] = useState(false);
    const [healthData, setHealthData] = useState<HealthDataProps>();
    const mount = useRef(false);

    useLayoutEffect(() => {
        navigation && navigation.setOptions({
            headerTitle: workout.name ? capitalize(workout.name) : '',
        })
    }, [workout, navigation])

    useEffect(() => {
        mount.current = true;
        if (workout.healthData) {
            setHealthData(workout.healthData)
        } else {
            setHealthData({
                activityName: workout.type,
                sourceName: 'Custom',
                calories: 0,
                duration: 0,
                distance: 0,
                disMeas: HealthDisMeas.mi,
                heartRates: [],
                activityId: AutoId.newId(20),
                date: workout.date
            })
        }
        return () => {
            mount.current = false
        }
    }, [workout])

    const onImportData = (data: HealthDataProps) => updateWoHealthData && updateWoHealthData(workout._id, data).catch(err => console.log(err));

    const onChangeShowImportState = () => setShowImport(i => i ? false : true);

    const onChangeHealthData = (data: HealthDataProps) => {
        //check if there is a difference
        if (workout.healthData) {
            const { healthData: woHltDta } = workout;
            if (
                data.activityName === woHltDta.activityName &&
                data.sourceName === woHltDta.sourceName &&
                data.distance === woHltDta.distance &&
                data.calories === woHltDta.calories &&
                data.duration === woHltDta.duration &&
                data.disMeas === woHltDta.disMeas &&
                _.isEqual(data.heartRates, woHltDta.heartRates)
            ) return;
        }

        const dataObj: HealthDataProps = {
            activityName: data.activityName,
            sourceName: data.sourceName,
            duration: data.duration,
            calories: data.calories,
            distance: data.distance,
            heartRates: data.heartRates,
            disMeas: HealthDisMeas.mi,
            activityId: data.activityId,
            date: workout.date
        }
        onImportData(dataObj)
        setHealthData({ ...dataObj, _id: AutoId.newId(10) })
        setShowImport(false)
    }

    const renderHealthComponents = () => {
        if (showImport) return;
        if (athlete) return (
            <View style={styles.healthContainer}>
                <HealthContainer data={healthData} status={workout.status} />
            </View>
        )
        switch (workout.status) {
            case WorkoutStatus.pending:
                return (
                    <View style={styles.healthContainer}>
                        <HealthForm onSubmit={onChangeHealthData} healthData={healthData} activityName={workout.type} />
                        <View style={styles.infoContainer}>
                            <SecondaryText styles={styles.infoHeader} bold>Quick Tip</SecondaryText>
                            <SecondaryText styles={styles.infoText}>Use the above actions to set goals for your training.</SecondaryText>
                        </View>
                    </View>
                )
            case WorkoutStatus.completed:
                return (
                    <View style={styles.healthContainer}>
                        <Pressable style={styles.update} onPress={onChangeShowImportState}>
                            {showImport ? <CloseSvg fillColor={BaseColors.white} /> : <PencilSvg fillColor={BaseColors.white} />}
                        </Pressable>
                        <HealthContainer data={healthData} status={workout.status} />
                    </View>
                )
        }
    }

    if (workout.programTemplateUid) {
        return (
            <View style={[styles.healthContainer, { flex: 1 }]}>
                {athlete ?
                    (
                        <>
                            <View style={styles.infoContainer}>
                                <SecondaryText styles={styles.infoHeader} bold>Target Goals</SecondaryText>
                            </View>
                            <HealthContainer data={healthData} status={workout.status} />
                        </>

                    )
                    : (
                        <>
                            <HealthForm onSubmit={onChangeHealthData} healthData={healthData} activityName={workout.type} />
                            <View style={styles.infoContainer}>
                                <SecondaryText styles={styles.infoHeader} bold>Note</SecondaryText>
                                <SecondaryText styles={styles.infoText}>Set target goals for your workout.</SecondaryText>
                            </View>
                        </>
                    )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <HealthImportContainer
                workout={workout}
                type={AppleHealthKit.Constants.Observers.Workout}
                onImportData={onChangeHealthData}
                hide={!showImport}
                onChangeShowImportState={onChangeShowImportState}
            />

            {renderHealthComponents()}
            {
                workout.status !== WorkoutStatus.pending && !showImport &&
                (
                    <WorkoutReflection
                        workout={workout}
                        image={image}
                        setImage={setImage}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: normalize.width(1),
        flex: 1,
        zIndex: 100
    },
    healthContainer: {
        margin: StyleConstants.baseMargin,

    },
    update: {
        alignSelf: 'flex-start',
        marginBottom: StyleConstants.smallMargin,
        width: normalize.width(15),
        height: normalize.width(15),
        borderColor: BaseColors.white,
        borderWidth: 1,
        borderRadius: 100,
        padding: 7
    },
    infoContainer: {
        marginTop: moderateScale(30),
        marginBottom: StyleConstants.baseMargin
    },
    infoHeader: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.white,
        marginBottom: 10,
    },
    infoText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightWhite
    }
})
export default OverviewContainer;