import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppleHealthKit, { HealthInputOptions, HealthObserver, HealthValue } from 'react-native-health'
import Chevron from '../../../assets/ChevronSvg';
import DevicesSvg from '../../../assets/DevicesSvg';
import { getWoSample } from '../../../helpers/health.helpers';
import { HealthDataProps, WorkoutProps } from '../../../services/workout/types';
import AutoId from '../../../utils/AutoId';
import BaseColors from '../../../utils/BaseColors';
import Constants from '../../../utils/Constants';
import { normalize } from '../../../utils/tools';
import SecondaryText from '../../elements/SecondaryText';
import StyleConstants from '../../tools/StyleConstants';
import HealthForm from './forms/HealthForm';
import HealthContainer from './HealthContainer';
import HealthItem from './HealthItem';
import ImportItem from './ImportItem';

interface Props {
    workout: WorkoutProps;
    type?: HealthObserver;
    onImportData: (data: HealthDataProps) => void;
    hide?: boolean;
    onChangeShowImportState: () => void;
}


const HealthImportContainer = ({ workout, type: type, onImportData, hide, onChangeShowImportState }: Props) => {
    const [data, setData] = useState<HealthDataProps[]>([]);
    const [custom, setCustom] = useState(false);
    const [customId] = useState(AutoId.newId(10))
    const mount = useRef(false);

    useEffect(() => {
        getActiveEnergy()
    }, [workout])

    useEffect(() => {
        mount.current = true;
        return () => {
            mount.current = false
        }
    }, [])


    const fetchHeartRateData = async (healthData: HealthDataProps[]) => {
        if (healthData.length < 1) return;

        const dataToFetchHR = healthData.filter((d) => d.start && d.end);

        if (dataToFetchHR.length < 1) return;

        interface StoreProps {
            heartRates: number[];
            activityId: string;
        }

        const heartRateStore: StoreProps[] = [];

        for (let i = 0; i < dataToFetchHR.length; i++) {
            const item = dataToFetchHR[i];
            if (item.start && item.end) {
                try {
                    const heartRates = await getHeartRateSample(item.start, item.end)
                    heartRateStore.push({
                        activityId: item.activityId,
                        heartRates: heartRates.map(h => h.value)
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }

        if (heartRateStore.length > 0) {
            if (!mount.current) return;

            setData(d => {
                const h = healthData.map((i) => {
                    const heartRates = heartRateStore.find(h => h.activityId === i.activityId);
                    return {
                        ...i,
                        heartRates: heartRates ? heartRates.heartRates : undefined
                    }
                })
                return _.uniqBy([...h, ...d], 'activityId')
            })
        }
    }

    const getHeartRateSample = async (startDate: string, endDate: string) => {
        return new Promise((resolve, reject) => {
            const options = {
                unit: 'bpm',
                startDate: startDate,
                endDate: endDate,
                limit: 100,
                ascending: false,
            } as HealthInputOptions;

            AppleHealthKit.getHeartRateSamples(options, (err: Object, results: Array<HealthValue>) => {
                if (err) {
                    return reject(err)
                }
                resolve(results)
            })
        }) as Promise<HealthValue[]>
    }


    const getActiveEnergy = async () => {
        const d = new Date(workout.date);

        const options = {
            startDate: new Date(d.getFullYear(), d.getMonth(), d.getUTCDate(), 0).toISOString(),
            endDate: new Date(d.getFullYear(), d.getMonth(), d.getUTCDate(), 24).toISOString(),
            type
        }

        try {
            const woSamples = await getWoSample(options)
            fetchHeartRateData(woSamples)
        } catch (err) {
            console.log(err)
        }
    }

    const onCustomStateChange = () => setCustom(m => m ? false : true);


    const onCustomImportSubmit = (data: HealthDataProps) => {
        const dataInsert = {
            ...data,
            activityId: customId,
            activityName: workout.type
        }
        setData(d => {
            const dupIndex = d.findIndex(i => i.activityId === customId)
            if (dupIndex > -1) {
                d[dupIndex] = dataInsert
            } else {
                d.push(dataInsert)
            }
            return [...d]
        })
        setCustom(false)
    }


    const renderDate = () => {
        const d = new Date(workout.date);
        return (
            <View style={styles.dateContainer}>
                <SecondaryText styles={styles.day} bold>{custom ? "Custom" : "Device Activites"}</SecondaryText>
                <SecondaryText styles={styles.date} bold>{Constants.months[d.getMonth()] + ' ' + d.getUTCDate() + ', ' + d.getFullYear()}</SecondaryText>
            </View>
        )
    }


    const renderDataOptions = useCallback(() => {
        return data.map((item, i) => <ImportItem data={item} onImportData={() => onImportData(item)} key={item.activityId ? item.activityId : i} />)
    }, [data])

    if (custom) {
        return (
            <View style={{ flex: 1, margin: StyleConstants.baseMargin }}>
                {renderDate()}
                <HealthForm onSubmit={onCustomImportSubmit} onClose={onCustomStateChange} activityName={workout.type} />
            </View>
        )
    }

    if (hide) return <></>

    return (
        <View style={{ flex: 1, margin: StyleConstants.baseMargin }}>
            <Pressable style={styles.back} onPress={onChangeShowImportState} hitSlop={5}>
                <Chevron strokeColor={BaseColors.white} />
            </Pressable>
            <View style={{ marginBottom: StyleConstants.baseMargin }}>
                <HealthContainer data={workout.healthData} status={workout.status} />
            </View>
            <View style={styles.container}>
                {renderDate()}
                <ScrollView
                    style={styles.container}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {renderDataOptions()}
                    <HealthItem svg={<DevicesSvg fillColor={BaseColors.primary} />} label='Source' text='Custom' onPress={onCustomStateChange} edit />
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    back: {
        fontSize: StyleConstants.extraSmallFont,
        width: normalize.width(25),
        height: normalize.width(25),
        marginBottom: 10
    },
    cancel: {
        alignSelf: 'flex-start',
        fontSize: StyleConstants.extraSmallFont
    },
    date: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.secondary,
    },
    dateContainer: {
        marginBottom: StyleConstants.baseMargin,
        paddingBottom: 5,
        borderBottomColor: BaseColors.lightGrey,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    day: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.secondary,
        textTransform: 'capitalize'
    },
})
export default HealthImportContainer;