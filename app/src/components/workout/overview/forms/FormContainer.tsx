import React, { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import SaveSvg from "../../../../assets/SaveSvg"
import BaseColors, { rgba } from "../../../../utils/BaseColors"
import SecondaryText from "../../../elements/SecondaryText"
import StyleConstants, { moderateScale } from "../../../tools/StyleConstants"

interface Props {
    children: any
    title: string
    onSave: () => void
    renderBack: any
}

const FormContainer: FC<Props> = ({ children, title, onSave, renderBack }) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {renderBack}
                <SecondaryText styles={styles.title} bold>{title}</SecondaryText>
                <Pressable onPress={onSave} style={styles.save}>
                    <SaveSvg strokeColor={BaseColors.white} />
                </Pressable>
            </View>
            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        borderColor: rgba(BaseColors.whiteRbg, .2),
        borderWidth: 1,
        borderRadius: StyleConstants.borderRadius
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: StyleConstants.baseMargin,
        borderBottomWidth: 1,
        borderBottomColor: rgba(BaseColors.whiteRbg, .2),
        padding: StyleConstants.baseMargin
    },
    title: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.white
    },
    save: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    contentContainer: {
        flexDirection: 'row',
        marginBottom: StyleConstants.baseMargin,
        width: '100%',
        padding: StyleConstants.baseMargin
    }
})

export default FormContainer;