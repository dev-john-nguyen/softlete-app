import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import request from '../../services/utils/request';
import paths from '../../utils/PATHS';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../App';
import { ProgramHeaderProps, ProgramProps } from '../../services/program/types';
import { NetworkStackScreens } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import StyleConstants from '../../components/tools/StyleConstants';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import SecondaryText from '../../components/elements/SecondaryText';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';
import { FlatList } from 'react-native-gesture-handler';
import { setTargetProgram } from '../../services/program/actions';
import { ReducerProps } from '../../services';

interface Props {
    navigation: any;
    route: any;
    dispatch: AppDispatch;
    softleteUid: string;
}


const Templates = ({ dispatch, navigation, softleteUid }: Props) => {
    const [programs, setPrograms] = useState<ProgramHeaderProps[]>([]);

    useEffect(() => {
        //softlete username
        request("GET", paths.programs.get(softleteUid), dispatch)
            .then(async ({ data }: { data?: ProgramHeaderProps[] }) => {
                if (data) setPrograms(data);
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const onNavToProgram = (program: ProgramHeaderProps) => {
        dispatch(setTargetProgram(program, true, true))
        navigation.navigate(NetworkStackScreens.AthleteProgramTemplate, { program, softlete: true })
    }

    const renderItem = useCallback(({ item: program }: { item: ProgramProps }) => {
        return (
            <Pressable
                style={[styles.contentContainer, BaseColors.primaryBoxShadow]}
                onPress={() => onNavToProgram(program)}
                key={program._id}
            >
                <ProgramHeaderImage uri={program.imageUri} onPress={() => onNavToProgram(program)} container={styles.image} />
                <View style={styles.content}>
                    <SecondaryText styles={styles.name} numberOfLines={2} bold>{program.name}</SecondaryText>
                    <SecondaryText styles={styles.description} numberOfLines={4}>{program.description}</SecondaryText>
                </View>
            </Pressable>
        )
    }, [programs])

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <FlatList
                data={programs}
                renderItem={renderItem}
                keyExtractor={(item, index) => item._id ? item._id : index}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StyleConstants.baseMargin,
    },
    contentContainer: {
        width: '100%',
        marginBottom: StyleConstants.baseMargin,
        backgroundColor: BaseColors.white
    },
    name: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary,
        textTransform: 'capitalize'
    },
    description: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.lightBlack,
    },
    content: {
        padding: StyleConstants.baseMargin,
    },
    image: {
        height: normalize.height(6)
    },
})

const mapStateToProps = (state: ReducerProps) => ({
    softleteUid: state.global.softleteUid
})
export default connect(mapStateToProps)(Templates);