import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { StyleProp, StyleSheet } from 'react-native';
import { normalize } from '../../utils/tools';
import Colors from '../../utils/BaseColors';
import BaseColors from '../../utils/BaseColors';
import StyleBase from '../tools/StyleBase';
import StyleConstants from '../tools/StyleConstants';


interface Props {
    styles?: StyleProp<any>;
    children: any;
    onPress: () => void;
    loading?: boolean;
}

export default ({ styles, children, onPress, loading }: Props) => (
    <Pressable
        style={({ pressed }) => [baseStyles.base, {
            backgroundColor: pressed ? BaseColors.lightPrimary : BaseColors.white
        }, styles]}
        onPress={onPress}
    >
        <Text style={[baseStyles.text, {
            fontSize: styles?.fontSize ? styles.fontSize : StyleConstants.smallFont,
            textTransform: styles?.textTransform ? styles.textTransform : 'capitalize',
            color: styles?.color ? styles.color : Colors.primary
        }]}>
            {children}
        </Text>
        {
            loading && (
                <ActivityIndicator size='small' color={BaseColors.primary} style={{ marginLeft: 5 }} />
            )
        }
    </Pressable>
)

const baseStyles = StyleSheet.create({
    base: {
        borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'Raleway'
    }
})