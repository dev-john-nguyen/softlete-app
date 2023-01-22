import { StyleSheet } from "react-native";
import BaseColors from "../../utils/BaseColors";
import { normalize } from "../../utils/tools";
import StyleConstants from "../tools/StyleConstants";

const modalStyles = StyleSheet.create({
    container: {
        backgroundColor: `rgba(0, 0, 0 ,.7)`,
        flex: 1,
    },
    confirmActions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: StyleConstants.baseMargin
    },
    backContainer: {
        width: normalize.width(25),
        height: normalize.width(25),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: StyleConstants.baseMargin,
        marginTop: StyleConstants.smallMargin
    },
    back: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.black
    },
    loading: {
        position: 'absolute',
        top: '10%',
        right: '5%'
    },
    close: {
        width: normalize.width(25),
        height: normalize.width(25),
        marginLeft: StyleConstants.baseMargin
    },
    content: {
        margin: StyleConstants.baseMargin,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    closeContainer: {
        height: '100%', width: '100%', position: 'absolute', zIndex: 0
    },
    modal: {
        backgroundColor: BaseColors.lightWhite,
        padding: StyleConstants.baseMargin,
        borderRadius: 5
    },
    title: {
        fontSize: StyleConstants.smallMediumFont,
        color: BaseColors.primary,
        textAlign: 'center'
    },
    svg: {
        height: normalize.width(25),
        width: normalize.width(25),
    },
    item: {
        backgroundColor: BaseColors.white,
        marginTop: 5,
        marginBottom: 5,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: normalize.width(2.5),
        flexWrap: 'wrap',
        borderRadius: 100
    },
    label: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.black
    }
})

export default modalStyles