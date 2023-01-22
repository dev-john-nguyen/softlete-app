import { StyleProp } from "react-native";
import BaseColors from "../../utils/BaseColors";

export enum FilterWorkouts {
    today = 'today',
    previous = 'previous',
    next = 'next'
}

export const HomeBoxShadow = {
    shadowColor: BaseColors.lightPrimary,
    shadowOffset: {
        width: 0,
        height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
} as StyleProp<any>