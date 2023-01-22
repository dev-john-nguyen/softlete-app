import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import BaseColors from '../utils/BaseColors';
import StyleConstants from './tools/StyleConstants';
import PrimaryText from './elements/PrimaryText';
import SecondaryText from './elements/SecondaryText';
import { capitalize, normalize } from '../utils/tools';
import FilterSvg from '../assets/FilterSvg';
import CustomPicker from './elements/Picker';
import { Categories, Equipments, MuscleGroups } from '../services/exercises/types';
import { Picker } from '@react-native-picker/picker';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chevron from '../assets/ChevronSvg';
import CategorySvg from '../assets/CategorySvg';
import DumbbellSvg from '../assets/DumbbellSvg';
import BodyOutlineSvg from '../assets/body/BodyOutlineSvg';

interface Props {
    show: boolean;
    catFilter: string;
    setCatFilter: React.Dispatch<React.SetStateAction<string>>
    onHide: () => void;
    equipFilter: string;
    mGFilter: string;
    setMGFilter: React.Dispatch<React.SetStateAction<string>>
    setEquipFilter: React.Dispatch<React.SetStateAction<string>>
    onReset: () => void;
    onSearchByCat: (cat: Categories) => void;
}


const hidePos = -normalize.height(1);

enum PickerOptions {
    category = 'category',
    muscleGroup = 'muscleGroup',
    equipment = 'equipment',
    none = ''
}

const SearchFilter = ({ show, catFilter, setCatFilter, onHide, setEquipFilter, equipFilter, mGFilter, setMGFilter, onReset, onSearchByCat }: Props) => {
    const [picker, setPicker] = useState<PickerOptions>(PickerOptions.none);
    const insets = useSafeAreaInsets()

    const renderPickerItems = useCallback(() => {
        const render = []
        switch (picker) {
            case PickerOptions.category:
                let keyC: keyof typeof Categories;
                for (keyC in Categories) {
                    render.push(
                        <Picker.Item label={capitalize(Categories[keyC])} value={keyC} key={keyC} />
                    )
                }
                break;
            case PickerOptions.muscleGroup:
                let keyM: keyof typeof MuscleGroups;
                for (keyM in MuscleGroups) {
                    render.push(
                        <Picker.Item label={capitalize(MuscleGroups[keyM])} value={keyM} key={keyM} />
                    )
                }
                break;
            case PickerOptions.equipment:
                let keyE: keyof typeof Equipments;
                for (keyE in Equipments) {
                    render.push(
                        <Picker.Item label={capitalize(Equipments[keyE])} value={keyE} key={keyE} />
                    )
                }
        }
        render.unshift(
            <Picker.Item label={''} value={''} key={'empty'} />
        )
        return render
    }, [picker])

    const onPickerChangeValue = (val: string) => {
        switch (picker) {
            case PickerOptions.category:
                setCatFilter(val)
                break;
            case PickerOptions.equipment:
                setEquipFilter(val)
                break;
            case PickerOptions.muscleGroup:
                setMGFilter(val)
                break;
        }

        setPicker(PickerOptions.none)
    }

    const renderPickerValue = () => {
        switch (picker) {
            case PickerOptions.category:
                return catFilter
            case PickerOptions.equipment:
                return equipFilter
            case PickerOptions.muscleGroup:
                return mGFilter
        }
        return ''
    }

    const animatedStyles = useAnimatedStyle(() => {
        return {
            bottom: show ? withTiming(0) : withTiming(hidePos, { easing: Easing.circle }),
            backgroundColor: BaseColors.white,
            position: 'absolute',
            width: '100%',
            zIndex: 100,
            borderTopColor: BaseColors.lightGrey,
            borderTopWidth: 1,
            padding: StyleConstants.baseMargin
        }
    }, [show])

    return (
        <>
            <Animated.View style={[animatedStyles, { paddingTop: insets.bottom }]}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <PrimaryText styles={styles.title}>Filter</PrimaryText>
                </View>

                {/* <View>
                    <SecondaryText>Explore</SecondaryText>
                    <View style={styles.exploreItemsContainer}>
                        {
                            Object.keys(Categories).map((key) => {
                                if (key === Categories.other) return <View key={key}></View>
                                return (
                                    <View key={key}>
                                        <Pressable style={({ pressed }) => [styles.catContainer, {
                                            backgroundColor: pressed ? BaseColors.lightPrimary : BaseColors.primary
                                        }]} onPress={() => onSearchByCat(key as Categories)}>
                                            <SecondaryText styles={styles.catText}>{key}</SecondaryText>
                                        </Pressable>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View> */}

                <SecondaryText styles={styles.label}>Category</SecondaryText>
                <Pressable style={styles.itemContainer} onPress={() => setPicker(PickerOptions.category)}>
                    <View style={styles.svg}>
                        <CategorySvg fillColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.text}>{catFilter}</SecondaryText>
                </Pressable>

                <SecondaryText styles={styles.label}>Muscle Group</SecondaryText>
                <Pressable style={styles.itemContainer} onPress={() => setPicker(PickerOptions.muscleGroup)}>
                    <View style={styles.svg}>
                        <BodyOutlineSvg strokeColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.text}>{mGFilter}</SecondaryText>
                </Pressable>

                {/* <SecondaryText styles={styles.label}>Equipment</SecondaryText>
                <Pressable style={styles.itemContainer} onPress={() => setPicker(PickerOptions.equipment)}>
                    <View style={styles.svg}>
                        <DumbbellSvg fillColor={BaseColors.primary} />
                    </View>
                    <SecondaryText styles={styles.text}>{equipFilter}</SecondaryText>
                </Pressable> */}

                <Pressable style={styles.resetContainer} onPress={onReset}>
                    <SecondaryText styles={styles.reset}>Reset</SecondaryText>
                </Pressable>

                <Pressable onPress={onHide} hitSlop={5} style={{ width: '100%', padding: 10 }}>
                    <View style={styles.chev}>
                        <Chevron strokeColor={BaseColors.secondary} />
                    </View>
                </Pressable>

            </Animated.View>
            <CustomPicker
                open={!!picker ? true : false}
                setOpen={() => setPicker(PickerOptions.none)}
                value={renderPickerValue()}
                pickerItems={renderPickerItems()}
                setValue={onPickerChangeValue}
            />
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        color: BaseColors.primary,
        fontSize: StyleConstants.smallMediumFont,
        marginBottom: 5
    },
    filterSvg: {
        width: normalize.width(20),
        height: normalize.width(20),
        marginRight: 5
    },
    chev: {
        width: normalize.width(20),
        height: normalize.width(20),
        alignSelf: 'center',
        transform: [{
            rotate: '-90deg'
        }]
    },
    itemContainer: {
        flexDirection: 'row', backgroundColor: BaseColors.white,
        padding: 10,
        borderRadius: StyleConstants.borderRadius,
        borderWidth: 1,
        borderColor: BaseColors.lightGrey,
        marginBottom: StyleConstants.smallMargin
    },
    svg: {
        width: normalize.width(25),
        height: normalize.width(25)
    },
    label: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black,
        marginBottom: 5
    },
    text: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black,
        marginLeft: StyleConstants.smallMargin,
        textTransform: 'capitalize'
    },
    resetContainer: {
        borderBottomWidth: 1,
        borderBottomColor: BaseColors.black,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: StyleConstants.smallMargin,
        marginBottom: StyleConstants.baseMargin
    },
    reset: {
        fontSize: StyleConstants.extraSmallFont
    },
    catContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: BaseColors.primary,
        marginRight: 5
    },
    catText: {
        fontSize: StyleConstants.extraSmallFont,
        textTransform: 'capitalize',
        color: BaseColors.white,

    },
    exploreItemsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        marginBottom: 5
    }
})
export default SearchFilter;