import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import BaseColors from '../../../utils/BaseColors';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryText from '../../../components/elements/PrimaryText';
import PencilSvg from '../../../assets/PencilSvg';
import SecondaryText from '../../../components/elements/SecondaryText';
import TrashSvg from '../../../assets/TrashSvg';
import InfoSvg from '../../../assets/InfoSvg';
import { ReducerProps } from '../../../services';
import { connect } from 'react-redux';
import { removeProgram } from '../../../services/program/actions';
import { ProgramActionProps, ProgramProps } from '../../../services/program/types';
import PrimaryButton from '../../../components/elements/PrimaryButton';
import SecondaryButton from '../../../components/elements/SecondaryButton';
import ProgramHelp from '../../../components/modal/ProgramHelp';
import Chevron from '../../../assets/ChevronSvg';
import LockSvg from '../../../assets/LockSvg';
import CloseSvg from '../../../assets/CloseSvg';
import styles from '../../../components/modal/styles';
import { normalize } from '../../../utils/tools';
import { ProgramStackScreens } from '../types';

interface Props {
    navigation: any;
    route: any;
    dispatch: React.Dispatch<any>;
    program: ProgramProps;
    removeProgram: ProgramActionProps['removeProgram']
}


const ProgramModal = ({ navigation, route, dispatch, program, removeProgram }: Props) => {
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [help, setHelp] = useState(false);
    const mount = useRef(false);
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        mount.current = true;
        return () => {
            mount.current = false;
        }
    }, [])

    const onDelete = () => {
        if (!program || loading) return;
        removeProgram(program._id)
            .then(() => {
                navigation.navigate(ProgramStackScreens.Templates)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onEdit = () => navigation.navigate(ProgramStackScreens.ProgramHeader, { edit: true })

    const onAccess = () => navigation.navigate(ProgramStackScreens.ProgramAccess)

    const renderContent = () => {
        if (confirm) return (
            <View>
                <SecondaryText styles={styles.label}>Are you sure you want to remove?</SecondaryText>
                <View style={styles.confirmActions}>
                    <PrimaryButton onPress={onDelete}>Confirm</PrimaryButton>
                    <SecondaryButton onPress={() => setConfirm(false)}>Cancel</SecondaryButton>
                </View>
            </View>
        )

        if (help) return <ProgramHelp />

        return (
            <View>
                <Pressable style={styles.item} onPress={onEdit}>
                    <SecondaryText styles={styles.label}>Edit</SecondaryText>
                    <View style={styles.svg}>
                        <PencilSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable onPress={onAccess} style={styles.item}>
                    <SecondaryText styles={styles.label}>Access Codes</SecondaryText>
                    <View style={styles.svg}>
                        <LockSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={styles.item} onPress={() => setHelp(true)}>
                    <SecondaryText styles={styles.label}>Tips/Help</SecondaryText>
                    <View style={styles.svg}>
                        <InfoSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={styles.item} onPress={() => setConfirm(true)}>
                    <SecondaryText styles={styles.label}>Remove</SecondaryText>
                    <View style={styles.svg}>
                        <TrashSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={styles.item} onPress={() => navigation.goBack()}>
                    <SecondaryText styles={styles.label}>Cancel</SecondaryText>
                    <View style={{ height: normalize.width(30), width: normalize.width(30) }}>
                        <CloseSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>
            </View>
        )
    }

    const renderHeader = () => {
        if (confirm) return 'Confirm'
        if (help) return 'Tips/Help'
        return 'Menu'
    }

    const onBack = () => {
        setConfirm(false)
        setHelp(false)
    }

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <Pressable onPress={() => navigation.goBack()} style={styles.closeContainer} />
            <View style={[styles.content, { marginTop: headerHeight }]}>
                <View style={styles.modal}>
                    <View style={styles.headerContainer}>
                        {
                            (confirm || help) ? (
                                <Pressable style={styles.backContainer} onPress={onBack}>
                                    <Chevron strokeColor={BaseColors.black} />
                                </Pressable>
                            ) :
                                <View />
                        }
                        <PrimaryText styles={styles.title}>{renderHeader()}</PrimaryText>
                        <View />
                    </View>
                    {
                        loading && (
                            <ActivityIndicator size='small' color={BaseColors.primary} style={styles.loading} />
                        )
                    }
                    {renderContent()}
                </View>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state: ReducerProps) => ({
    program: state.program.targetProgram
})


const mapDispatchToProps = (dispatch: any) => {
    return {
        removeProgram: (programUid: string) => dispatch(removeProgram(programUid)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramModal);