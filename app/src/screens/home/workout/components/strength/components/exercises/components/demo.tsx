import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const ITEM_HEIGHT = 70;
const DATA = Array.from({ length: 5 }, (_, i) => ({
  id: String(i),
  label: `Item ${i + 1}`,
}));

const reorder = (list, from, to) => {
  if (from === to) {
    return list;
  } // No reorder needed if positions are the same

  const result = Array.from(list);
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);

  return result;
};

const DraggableItem = ({ item, index, onOrderChange, dataLength }) => {
  const translateY = useSharedValue(0);
  const initialIndex = useSharedValue(index);

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      let newIndex =
        initialIndex.value + Math.round(translateY.value / ITEM_HEIGHT);
      newIndex = Math.max(0, Math.min(newIndex, dataLength - 1)); // Clamp between 0 and data length
      translateY.value = withSpring(0);
      if (newIndex !== initialIndex.value) {
        runOnJS(onOrderChange)(initialIndex.value, newIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.label}>{item.label}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function App() {
  const [data, setData] = useState(DATA);

  const onOrderChange = (fromIndex, toIndex) => {
    setData(currentData => reorder(currentData, fromIndex, toIndex));
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          onOrderChange={onOrderChange}
          dataLength={data.length}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    height: ITEM_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
});
