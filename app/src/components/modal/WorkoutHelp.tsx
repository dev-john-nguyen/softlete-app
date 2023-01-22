import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import StyleConstants from '../tools/StyleConstants';
import SecondaryText from '../elements/SecondaryText';
import { normalize } from '../../utils/tools';


interface Props {

}

//delete sets
//reorder
//stages of workout
const WorkoutHelp = ({ }: Props) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to add another group?</SecondaryText>
                <SecondaryText styles={styles.text}>Tap on the circle plus icon located in the navbar.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to add warm up sets?</SecondaryText>
                <SecondaryText styles={styles.text}>Tap on the last set.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to delete sets?</SecondaryText>
                <SecondaryText styles={styles.text}>Tap and hold on the set you want to remove.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to update measurement for an exercise?</SecondaryText>
                <SecondaryText styles={styles.text}>Tap on the exercise and navigate to the exercise edit screen. There you will have an option to update the measurement type.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to remove/reorder exercises?</SecondaryText>
                <SecondaryText styles={styles.text}>Visit the menu and tap on the restructure option.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>How to progress to next stage.</SecondaryText>
                <SecondaryText styles={styles.text}>Press and hold on the desired stage. You can only complete a workout when on performing stage.</SecondaryText>
            </View>

            <View style={styles.section}>
                <SecondaryText styles={styles.label} bold>Workout stages.</SecondaryText>
                <SecondaryText styles={styles.text}>{`Pending => Performing => Completed. You can revert back to previous stages.`}</SecondaryText>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        maxHeight: normalize.height(2),
        padding: 10,
    },
    section: {
        marginBottom: StyleConstants.smallMargin
    },
    label: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        marginBottom: 2,
    },
    text: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    }
})
export default WorkoutHelp;