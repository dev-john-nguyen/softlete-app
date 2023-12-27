import React from 'react';
import { View, StyleSheet } from 'react-native';
import PrimaryText from '../elements/PrimaryText';
import { HEIGHT } from './utils';
import { WorkoutExerciseProps } from '../../services/workout/types';
import { normalize } from '../../utils/tools';
import Constants from '../../utils/Constants';
import StyleConstants from '../tools/StyleConstants';
import { Colors, rgba } from '@app/utils';
import Icon from '@app/icons';

interface Props {
  exercise: WorkoutExerciseProps;
  onRemove: (id: string) => void;
  movingGroup: string;
}

const RestructureItem = ({ exercise, onRemove, movingGroup }: Props) => {
  const data = exercise.exercise ? exercise.exercise.name : '';

  return (
    <View style={styles.container}>
      <PrimaryText numberOfLines={1} textTransform="capitalize">
        {data}
      </PrimaryText>
      {!!movingGroup && (
        <View style={styles.groupContainer}>
          {movingGroup === 'trash' ? (
            <Icon icon="trash_bin" size={20} color={Colors.primary} />
          ) : (
            <PrimaryText color={Colors.primary} bold>
              {Constants.abc[parseInt(movingGroup)]}
            </PrimaryText>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: '100%',
    padding: 10,
    paddingLeft: StyleConstants.baseMargin,
    paddingRight: StyleConstants.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kettle: {
    width: normalize.width(7),
    height: normalize.width(7),
    marginRight: 10,
  },
  groupContainer: {
    position: 'absolute',
    top: '20%',
    left: '-7%',
    backgroundColor: rgba(Colors.whiteRbg, 1),
    padding: 10,
    borderRadius: 100,
  },
  groupText: {
    fontSize: StyleConstants.mediumFont,
    color: Colors.primary,
  },
  name: {
    color: Colors.black,
    textTransform: 'capitalize',
    fontSize: StyleConstants.smallFont,
    flex: 1,
  },
  trash: {
    height: normalize.width(25),
    width: normalize.width(25),
  },
});
export default RestructureItem;
