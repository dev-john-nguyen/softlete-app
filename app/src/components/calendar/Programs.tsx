import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgramProps } from '../../services/program/types';
import { FlatList } from 'react-native-gesture-handler';
import StyleConstants from '../tools/StyleConstants';
import BaseColors, { rgba } from '../../utils/BaseColors';
import SecondaryText from '../elements/SecondaryText';
import { normalize } from '../../utils/tools';
import DashboardProgramView from './Program';
import CircleAdd from '../elements/CircleAdd';


interface Props {
    programTemplates: ProgramProps[];
    onNavToProgram: (program: ProgramProps) => void;
    navToCreateProgram: () => void;
}

const DashboardPrograms = ({ programTemplates, onNavToProgram, navToCreateProgram }: Props) => {

    const renderListEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
        </View>
    ), [])

    const renderItem = useCallback(({ item }: { item: ProgramProps }) => (
        <DashboardProgramView
            program={item}
            onNavToProgram={onNavToProgram}
            key={item._id}
            lock={item.isPrivate}
        />
    ), [programTemplates])

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={{ paddingBottom: normalize.height(20) }}
                data={programTemplates}
                ListEmptyComponent={renderListEmptyComponent}
                renderItem={renderItem}
                keyExtractor={(item, index) => item._id ? item._id : index.toString()}
            />
            <CircleAdd onPress={navToCreateProgram} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selection: {
        flexDirection: 'row',
        marginBottom: StyleConstants.baseMargin,
        justifyContent: 'space-between'
    },
    selectContainer: {
        padding: StyleConstants.smallPadding,
        borderWidth: 2,
        borderColor: BaseColors.primary
    },
    selectText: {
        fontSize: StyleConstants.smallFont
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: normalize.height(10)
    },
    emptyText: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.secondary
    }
})
export default DashboardPrograms;