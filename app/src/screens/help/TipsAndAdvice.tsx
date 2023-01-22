import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyleConstants from '../../components/tools/StyleConstants';
import PrimaryText from '../../components/elements/PrimaryText';
import { useHeaderHeight } from '@react-navigation/elements';
import BaseColors from '../../utils/BaseColors';
import SecondaryText from '../../components/elements/SecondaryText';

interface Props {

}


const TipsAndAdvice = ({ }: Props) => {
    const headerHeight = useHeaderHeight();

    return (
        <View style={styles.container}>
            <View style={{ height: headerHeight }} />
            <PrimaryText styles={styles.headerText}>Tips/Advice</PrimaryText>
            <SecondaryText styles={styles.title} bold>Safety Tips</SecondaryText>
            <SecondaryText styles={styles.content}>
                Please don't share any personal information with people you don't know.
            </SecondaryText>
            <SecondaryText styles={styles.content}>
                Please be cautious of sending money to another user. Don't share information that could be used to access your financial accounts.
            </SecondaryText>
            <SecondaryText styles={styles.content}>
                Be sure to pick a strong password.
            </SecondaryText>

            <SecondaryText styles={styles.title} bold>Training Tips</SecondaryText>

            <SecondaryText styles={styles.content}>
                If you have trouble figuring out how to create a workout, look at what other athletes are doing or download our starter templates.
            </SecondaryText>

            <SecondaryText styles={styles.content}>
                Please schedule regular rest days. Rest days are just as important as your training days.
            </SecondaryText>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: StyleConstants.baseMargin,
        marginTop: 0
    },
    headerText: {
        fontSize: StyleConstants.largeFont,
        color: BaseColors.primary,
    },
    title: {
        color: BaseColors.black,
        fontSize: StyleConstants.smallMediumFont,
        marginTop: StyleConstants.baseMargin
    },
    content: {
        color: BaseColors.lightBlack,
        fontSize: StyleConstants.smallFont,
        marginTop: 5
    }
})
export default TipsAndAdvice;