import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LockSvg from '../../assets/LockSvg';
import BaseColors from '../../utils/BaseColors';
import { normalize } from '../../utils/tools';


interface Props {

}


const AthleteDashboadLock = ({ }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.lock}>
                    <LockSvg fillColor={BaseColors.primary} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        top: "20%"
    },
    lock: {
        width: normalize.width(12),
        height: normalize.width(12),
    }
})
export default AthleteDashboadLock;