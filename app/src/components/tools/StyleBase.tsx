import { normalize } from "../../utils/tools";
import BaseColors, { rgba } from "../../utils/BaseColors";
import { StyleSheet } from "react-native";
import StyleConstants from "./StyleConstants";

export default StyleSheet.create({
    label: {
        color: BaseColors.black,
        fontSize: StyleConstants.smallFont,
        marginBottom: 5
    },
    baseTxt: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black
    },
    baseHeaderTxt: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary,
        textTransform: 'capitalize'
    },
    inputUnderline: {
        borderBottomWidth: 2,
        borderBottomColor: BaseColors.primary,
        color: BaseColors.black
    },
    disableUnderline: {
        borderBottomWidth: 5,
        borderBottomColor: BaseColors.medGrey,
        color: BaseColors.secondary
    }
})