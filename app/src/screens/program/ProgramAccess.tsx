import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import { ProgramProps, ProgramActionProps } from '../../services/program/types';
import { updateProgramAccessCode } from '../../services/program/actions';
import PrimaryButton from '../../components/elements/PrimaryButton';
import StyleConstants from '../../components/tools/StyleConstants';
import BaseColors from '../../utils/BaseColors';
import Clipboard from '@react-native-clipboard/clipboard';
import { setBanner } from '../../services/banner/actions';
import PencilSvg from '../../assets/PencilSvg';
import { normalize } from '../../utils/tools';
import ProgramAccessItem from '../../components/program/AccessItem';
import { BannerActionsProps, BannerTypes } from '../../services/banner/types';

interface Props {
    navigation: any;
    route: any;
    program: ProgramProps;
    updateProgramAccessCode: ProgramActionProps['updateProgramAccessCode'];
    setBanner: BannerActionsProps['setBanner'];
}


const ProgramAccess = ({ program, updateProgramAccessCode, setBanner, navigation }: Props) => {
    const [edit, setEdit] = useState(false);
    const loading = useRef(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={{ width: normalize.width(20), height: normalize.width(20), marginRight: StyleConstants.baseMargin }}
                    onPress={() => setEdit(e => e ? false : true)}
                >
                    <PencilSvg fillColor={BaseColors.primary} />
                </Pressable>
            )
        })
    }, [])

    const onAddAccessCode = async () => {
        if (loading.current) return;
        loading.current = true
        await updateProgramAccessCode(program._id)
        loading.current = false
    }

    const onRemoveAccessCode = async (accessCode: string) => {
        if (loading.current) return;
        loading.current = true
        updateProgramAccessCode(program._id, accessCode)
        loading.current = false
    }

    const copyToClip = (text: string) => {
        Clipboard.setString(text)
        setBanner(BannerTypes.default, 'Copied to clipboard!')
    }

    const renderItem = useCallback(({ item }: { item: string }) => {
        return <ProgramAccessItem text={item} onLongPress={() => edit ? onRemoveAccessCode(item) : copyToClip(item)} edit={edit} />
    }, [program.accessCodes, edit])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={program.accessCodes}
                    keyExtractor={(item, index) => item ? item : index.toString()}
                    renderItem={renderItem}
                />
                <PrimaryButton onPress={onAddAccessCode}>Generate Access Code</PrimaryButton>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: StyleConstants.baseMargin
    },
    header: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    program: state.program.targetProgram
})

export default connect(mapStateToProps, { updateProgramAccessCode, setBanner })(ProgramAccess);