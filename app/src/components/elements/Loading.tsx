import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import BaseColors from '../../utils/BaseColors';

interface Props {
    white?: boolean
    size?: number | "small" | "large"
}


const Loading = ({ white, size = 'large' }: Props) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={white ? BaseColors.white : BaseColors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default Loading;