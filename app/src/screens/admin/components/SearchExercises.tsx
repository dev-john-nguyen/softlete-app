import { ScreenTemplate } from '@app/elements';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { AppDispatch } from '../../../../App';
import CircleAdd from '../../../components/elements/CircleAdd';
import ExerciseSearchPreview from '../../../components/ExerciseSearchPreview';
import SearchHeader from '../../../components/SearchHeader';
import ADMINPATHS from '../../../services/admin/ADMINPATHS';
import {
  SET_TARGET_EXERCISE,
  STORE_EXERCISES,
} from '../../../services/exercises/actionTypes';
import { ExerciseProps } from '../../../services/exercises/types';
import { SERVERURL } from '../../../utils/PATHS';
import { AdminStackList } from '../screens/types';

interface Props {
  navigation: any;
  dispatch: AppDispatch;
}

const fetchSoftUrl = SERVERURL + ADMINPATHS.exercises.fetchAll;

const SearchExercises = ({ navigation, dispatch }: Props) => {
  const [query, setQuery] = useState('');
  const [exercises, setExercises] = useState<ExerciseProps[]>([]);
  const [fetchedExs, setFetchedExs] = useState<ExerciseProps[]>([]);
  const mount = useRef(false);

  useEffect(() => {
    mount.current = true;
    axios
      .get(fetchSoftUrl)
      .then(response => {
        if (mount.current) {
          if (response && response.data) {
            setFetchedExs(response.data);
            dispatch({
              type: STORE_EXERCISES,
              payload: { exercises: response.data },
            });
          } else {
            setFetchedExs([]);
          }
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Failed to get softlete exercises');
      });

    return () => {
      mount.current = false;
    };
  }, []);

  useEffect(() => {
    const regex = new RegExp(
      query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').toLowerCase(),
    );
    const filtered = fetchedExs.filter(
      e => e.name && regex.test(e.name.toLowerCase()),
    );
    setExercises(filtered);
  }, [fetchedExs, query]);

  const onSearch = async (query: string) => {
    setQuery(query);
  };

  const onExercisePress = (exercise: ExerciseProps) => {
    dispatch({ type: SET_TARGET_EXERCISE, payload: exercise });
    navigation.navigate(AdminStackList.AdminUploadExerciseVideo);
  };

  const onAdd = () => {
    dispatch({ type: SET_TARGET_EXERCISE, payload: {} });
    navigation.navigate(AdminStackList.AdminUploadExerciseVideo);
  };

  const renderItem = useCallback(
    ({ item }: { item: ExerciseProps }) => {
      return (
        <ExerciseSearchPreview
          exercise={item}
          onPress={() => onExercisePress(item)}
          user={{} as any}
          softlete
        />
      );
    },
    [exercises],
  );

  return (
    <ScreenTemplate
      isBackVisible
      middleContent={<SearchHeader onSearch={onSearch} />}>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item._id ? item._id : index.toString())}
      />
      <CircleAdd onPress={onAdd} style={{ bottom: '2%' }} />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({});

export default connect()(SearchExercises);
