import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import CloseSvg from '../../assets/CloseSvg';
import SearchSvg from '../../assets/SearchSvg';
import BaseColors, { rgba } from '../../utils/BaseColors';
import DateTools from '../../utils/DateTools';
import CircleAdd from '../elements/CircleAdd';
import Loading from '../elements/Loading';
import PrimaryButton from '../elements/PrimaryButton';
import StyleConstants, { moderateScale } from '../tools/StyleConstants';
import { DateSelectionTypes, DEFAULT_DATES, genNewDate, SelectedDateProps } from './types';

interface Props {
    dateFilters: SelectedDateProps[]
    setDateFilters: React.Dispatch<React.SetStateAction<SelectedDateProps[]>>
    selectionType: DateSelectionTypes
    setSelectionType: React.Dispatch<React.SetStateAction<DateSelectionTypes>>
    onDatesSubmission: () => void;
    isFetching: boolean;

}

//date selection option to choose a range or multiple dates
const DateSelection = ({ dateFilters, setDateFilters, selectionType, setSelectionType, onDatesSubmission, isFetching }: Props) => {
    const [activeDate, setActiveDate] = useState<SelectedDateProps>();
    const [isOpen, setIsOpen] = useState(false);

    const onAddDate = () => setDateFilters(d => [...d, genNewDate()])

    const onDatePickerConfirm = (date: Date) => {
        setIsOpen(false)
        if (!activeDate) return;
        setDateFilters(dates => {
            const targetIndex = dates.findIndex(d => d.key === activeDate.key);
            if (targetIndex > -1) {
                dates[targetIndex] = { ...activeDate, date }
            }
            return [...dates]
        })
        setActiveDate(undefined)
    }


    const onRangePress = () => {
        //when switching to range always ensure that there are two dates
        setSelectionType(DateSelectionTypes.range)
        setDateFilters([DEFAULT_DATES.start, DEFAULT_DATES.end])
    }

    const onMutliplePress = () => {
        setSelectionType(DateSelectionTypes.multiple)
    }

    const onRemoveDate = ({ d }: { d: SelectedDateProps }) => () => {
        setDateFilters((dates) => {
            if (dates.length < 2) return dates;
            const index = dates.findIndex(dt => dt.key === d.key)
            if (index > -1) {
                dates.splice(index, 1)
            }
            return [...dates]
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.selectionContainer}>
                <PrimaryButton onPress={onRangePress} styles={{
                    marginRight: 10,
                    opacity: DateSelectionTypes.range === selectionType ? 1 : .2,
                    fontSize: StyleConstants.extraSmallFont
                }}>Range</PrimaryButton>
                <PrimaryButton onPress={onMutliplePress} styles={{
                    opacity: DateSelectionTypes.multiple === selectionType ? 1 : .2,
                    fontSize: StyleConstants.extraSmallFont
                }}>Multiple</PrimaryButton>
            </View>
            <View style={styles.dateSelectorContainer}>
                <Pressable style={styles.search} onPress={onDatesSubmission} hitSlop={5}>
                    {isFetching ? <Loading white size={'small'} /> : <SearchSvg strokeColor={BaseColors.white} />}
                </Pressable>
                <View style={styles.dateRangeWrapper}>
                    {(() => {
                        if (selectionType === DateSelectionTypes.range) {
                            return (
                                <View style={styles.dateRangeContainer}>
                                    {(dateFilters.length > 0) && <PrimaryButton onPress={() => {
                                        if (dateFilters.length < 1) return;
                                        setIsOpen(true)
                                        setActiveDate(dateFilters[0])
                                    }}
                                        styles={{ fontSize: StyleConstants.extraSmallFont }}
                                    >{DateTools.dateToStr(dateFilters[0].date)}</PrimaryButton>}
                                    <View style={styles.rangeSeparator} />
                                    {dateFilters.length > 1 && <PrimaryButton onPress={() => {
                                        if (dateFilters.length < 2) return
                                        setIsOpen(true)
                                        setActiveDate(dateFilters[1])
                                    }} styles={{
                                        fontSize: StyleConstants.extraSmallFont
                                    }}>{DateTools.dateToStr(dateFilters[1].date)}</PrimaryButton>}
                                </View>
                            )
                        }
                        return (
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingRight: moderateScale(20) }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <CircleAdd onPress={onAddDate} style={styles.circleAdd} plusStyle={{ height: moderateScale(10), width: moderateScale(10) }} />
                                {dateFilters.map(d => (
                                    <View key={d.key} style={{ marginRight: 10 }}>
                                        <PrimaryButton styles={{
                                            fontSize: StyleConstants.extraSmallFont
                                        }} onPress={() => {
                                            setIsOpen(true)
                                            setActiveDate(d)
                                        }}
                                        >{DateTools.dateToStr(d.date)}</PrimaryButton>
                                        <Pressable style={styles.close} hitSlop={5} onPress={onRemoveDate({ d })}>
                                            <CloseSvg fillColor={BaseColors.white} />
                                        </Pressable>
                                    </View>
                                ))}
                            </ScrollView>
                        )
                    })()}
                </View>
            </View>
            <DatePicker
                modal
                mode='date'
                date={activeDate?.date || new Date()}
                onConfirm={onDatePickerConfirm}
                onCancel={() => setIsOpen(false)}
                open={isOpen}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StyleConstants.smallMargin
    },
    selectionContainer: {
        flexDirection: 'row',
        marginBottom: StyleConstants.smallMargin
    },
    dateRangeContainer: {
        flexDirection: 'row'
    },
    rangeSeparator: {
        width: 20,
        height: 2,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: BaseColors.white,
        alignSelf: 'center',
        opacity: .5
    },
    dateSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    search: {
        height: moderateScale(20),
        width: moderateScale(20),
        marginRight: moderateScale(10),
    },
    circleAdd: {
        marginRight: 10, padding: 5, position: 'relative', backgroundColor: 'transparent', borderColor: BaseColors.white, borderWidth: 2
    },
    dateRangeWrapper: {
        borderLeftWidth: 1,
        borderLeftColor: rgba(BaseColors.whiteRbg, .3),
        paddingLeft: moderateScale(10)
    },
    close: {
        position: 'absolute',
        top: 0,
        right: -10,
        height: moderateScale(20),
        width: moderateScale(20),
        backgroundColor: rgba(BaseColors.primaryRgb, .8),
        borderWidth: 1,
        borderColor: BaseColors.white,
        borderRadius: 100,
        padding: 6
    }
})
export default DateSelection;