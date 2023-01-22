import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { connect } from 'react-redux';
import { updateProgramHeader } from '../../services/program/actions';
import PrimaryButton from '../../components/elements/PrimaryButton';
import { ProgramActionProps, NewProgramProps, RootProgramProps } from '../../services/program/types';
import StyleBase from '../../components/tools/StyleBase';
import StyleConstants from '../../components/tools/StyleConstants';
import Switch from '../../components/elements/Switch';
import SecondaryText from '../../components/elements/SecondaryText';
import { ReducerProps } from '../../services';
import BaseColors, { rgba } from '../../utils/BaseColors';
import ProgramHeaderImage from '../../components/program/HeaderImage';
import { ImageProps } from '../../services/user/types';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryText from '../../components/elements/PrimaryText';
import { useHeaderHeight } from '@react-navigation/elements';
import AddImageSvg from '../../assets/AddImageSvg';
import { normalize } from '../../utils/tools';
import Chevron from '../../assets/ChevronSvg';
import { ProgramStackScreens } from './types';
import InputPlaceholder from '../../components/InputPlaceholder';

interface Props {
    updateProgramHeader: ProgramActionProps['updateProgramHeader'];
    navigation: any;
    program: RootProgramProps['targetProgram'];
    route: any;
}

const imageOptions: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 1,
    selectionLimit: 1,
    includeBase64: true
}


const ProgramHeader = ({ updateProgramHeader, navigation, program, route }: Props) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [error, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<ImageProps>();
    const [isEdit, setIsEdit] = useState(false);
    const headerHeight = useHeaderHeight();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: isEdit ? BaseColors.white : BaseColors.primary,
            headerLeft: () => (
                <Pressable style={styles.backContainer} onPress={() => navigation.goBack()}>
                    <View style={styles.back}>
                        <Chevron strokeColor={BaseColors.primary} />
                    </View>
                </Pressable>
            )
        })
    }, [isEdit])

    useEffect(() => {
        if (program && route.params && route.params.edit) {
            setName(program.name)
            setDescription(program.description)
            setIsPrivate(program.isPrivate);
            setId(program._id)
            setImage({
                uri: program.imageUri
            })
            setIsEdit(true)
        } else {
            setName('')
            setDescription('')
            setIsPrivate(false);
            setId("")
            setImage(undefined)
            setIsEdit(false)
        }
    }, [program])

    useEffect(() => {
        if (route && route.params) {
            const { value, label } = route.params;
            switch (label) {
                case 'name':
                    setName(value)
                    break;
                case 'description':
                    setDescription(value)
                    break;
            }
        }
    }, [route])

    const onCreateProgram = () => {
        if (loading) return;

        if (!name || !description) {
            return setErrors(['Name and description are required.'])
        }

        setLoading(true);

        const programData: NewProgramProps = {
            name,
            description,
            isPrivate,
            accessCodes: []
        }

        if (id) programData._id = id

        updateProgramHeader(programData, image ? image.base64 : undefined)
            .then(() => {
                setLoading(false)
                navigation.goBack()
            })
            .catch((err) => {
                setLoading(false)
            })
    }

    const onSelectImage = async () => {
        if (!isEdit) return;
        launchImageLibrary(imageOptions, ({ errorCode, errorMessage, didCancel, assets }) => {
            if (didCancel) {
                //user canceled
                return;
            }
            if (errorCode) {
                console.log(errorMessage)
                return;
            }

            //get image base64 string
            if (!assets) {
                console.log('nothing selected')
                return
            }

            const selected = assets[0];

            if (selected.base64 && selected.uri) {
                setImage({
                    base64: selected.base64,
                    uri: selected.uri
                })
            }
            //try again
        })
    }

    const onNavigationToInput = (label: string, value: string, maxLength: number, des?: string, mult?: boolean) => {
        navigation.navigate(ProgramStackScreens.ProgramInput, { label, value, des, mult, maxLength, goBackScreen: ProgramStackScreens.ProgramHeader })
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['left', 'bottom', 'right']}>
            {isEdit &&
                <View style={{ height: '30%' }}>
                    <ProgramHeaderImage uri={image && image.uri ? image.uri : ''} container={{ borderRadius: 0 }} />
                    <Pressable style={styles.addSvg} onPress={onSelectImage}>
                        <AddImageSvg fillColor={BaseColors.primary} />
                    </Pressable>
                </View>
            }
            <View style={[styles.container, { marginTop: isEdit ? StyleConstants.baseMargin : headerHeight }]}>
                <PrimaryText styles={styles.headerText}>Program Details</PrimaryText>
                <SecondaryText styles={styles.headerSubText}>Fill out the form below.</SecondaryText>

                <View style={styles.errorContainer}>
                    {error.map((e) => (
                        <SecondaryText key={Math.random()} styles={styles.errorText}>*{e}</SecondaryText>
                    ))}
                </View>

                <InputPlaceholder
                    onPress={() => onNavigationToInput('name', name, 50)}
                    value={name}
                    label='Name:'
                    style={{ marginBottom: StyleConstants.baseMargin }}
                />

                <InputPlaceholder
                    onPress={() => onNavigationToInput('description', description, 200, 'In a sentence or two, provide a detailed description of what the program is designed to do.', true)}
                    value={description}
                    label='Description:'
                    style={{ marginBottom: StyleConstants.baseMargin }}
                />

                <View style={styles.switchContainer}>
                    <Switch
                        onSwitch={() => setIsPrivate(p => p ? false : true)}
                        active={isPrivate}
                    />
                    <SecondaryText styles={[StyleBase.baseTxt, { marginLeft: 10 }]}>{isPrivate ? "Private" : "Public"}</SecondaryText>
                </View>

                <PrimaryButton onPress={onCreateProgram} styles={{ marginTop: StyleConstants.baseMargin }}>{loading ? <ActivityIndicator size='small' color={BaseColors.white} /> : "Save"}</PrimaryButton>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: StyleConstants.baseMargin,
        marginRight: StyleConstants.baseMargin,
    },
    headerText: {
        fontSize: StyleConstants.mediumLargeFont,
        color: BaseColors.primary,
        marginBottom: 5
    },
    headerSubText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: StyleConstants.baseMargin,
        marginBottom: StyleConstants.baseMargin
    },
    label: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black,
        marginBottom: 10
    },
    errorText: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.red,
        marginBottom: 2,
    },
    errorContainer: {
        marginTop: 5,
        marginBottom: 5
    },
    addSvg: {
        width: normalize.width(8),
        height: normalize.width(8),
        position: 'absolute',
        alignSelf: 'center',
        top: '40%',
        backgroundColor: rgba(BaseColors.whiteRbg, .8),
        borderRadius: 100,
        padding: StyleConstants.baseMargin
    },
    backContainer: {
        marginRight: StyleConstants.baseMargin,
        marginLeft: StyleConstants.baseMargin,
        backgroundColor: rgba(BaseColors.whiteRbg, .8),
        padding: 10,
        borderRadius: 100
    },
    back: {
        width: normalize.width(25),
        height: normalize.width(25),
    }
})

const mapStateToProps = (state: ReducerProps) => ({
    program: state.program.targetProgram
})

export default connect(mapStateToProps, { updateProgramHeader })(ProgramHeader);