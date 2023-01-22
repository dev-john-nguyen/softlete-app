import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, SectionList, Pressable, View, Keyboard } from 'react-native';
import BaseColors from '../../utils/BaseColors';
import { ExerciseProps, Categories } from '../../services/exercises/types';
import { ReducerProps } from '../../services';
import { connect } from 'react-redux';
import ExerciseSearchPreview from '../../components/ExerciseSearchPreview';
import _ from 'lodash';
import StyleConstants from '../../components/tools/StyleConstants';
import { UserProps } from '../../services/user/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchHeader from '../../components/SearchHeader';
import SearchFilter from '../../components/SearchFilter';
import SecondaryText from '../../components/elements/SecondaryText';
import { AppDispatch } from '../../../App';
import { NetworkStackScreens } from './types';
import { AthleteProfileProps } from '../../services/athletes/types';

interface Props {
    navigation: any;
    exercisesProps: ExerciseProps[];
    route: any;
    athleteProps: AthleteProfileProps;
    user: UserProps;
    dispatch: AppDispatch;
}

const AthleteSearchExercises = ({ navigation, route, exercisesProps, athleteProps, user, dispatch }: Props) => {
    const [exercises, setExercises] = useState<{ title: string, data: ExerciseProps[] }[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [catFilter, setCatFilter] = useState('');
    const [equipFilter, setEquipFilter] = useState('');
    const [mGFilter, setMGFilter] = useState('');
    const [hiddenGroups, setHiddenGroups] = useState<string[]>([]);
    const [fetchedExs, setFetchedExs] = useState<{ title: string, data: ExerciseProps[] }[]>([]);
    const [query, setQuery] = useState('');
    const mount = useRef(false);

    useEffect(() => {

        let clone = _.cloneDeep(exercisesProps);

        //regex querying
        const regex = new RegExp(query.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").toLowerCase())
        clone = clone.filter(e => e.name && regex.test(e.name.toLowerCase()))

        if (equipFilter || catFilter || equipFilter) {
            //filter checks
            //filter each one one at a time
            if (catFilter) {
                clone = clone.filter((item) => item.category === catFilter)
            }

            if (mGFilter) {
                clone = clone.filter((item) => item.muscleGroup === mGFilter)
            }

            if (equipFilter) {
                clone = clone.filter((item) => item.equipment === equipFilter)
            }
        }


        let grouped = processFetchedExercises(clone);

        //hide all the groups
        if (hiddenGroups.length > 0) {
            grouped = grouped.map(item => {
                const remove = hiddenGroups.find(g => g === item.title)
                if (remove) {
                    item.data = []
                }
                return item
            })
        }

        setExercises([...grouped])

    }, [athleteProps, hiddenGroups, fetchedExs, catFilter, mGFilter, equipFilter, exercisesProps, query])

    const onSearch = async (query: string) => setQuery(query)

    const onSearchByCat = async (category: Categories) => {
        const regex = new RegExp(category.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").toLowerCase())
        const queryExercise = exercisesProps.filter(e => regex.test(e.category.toLowerCase()))
        const format = processFetchedExercises(queryExercise)
        setExercises(format)
    }

    const onNavigateToExercise = (exercise: ExerciseProps) => {
        navigation.navigate(NetworkStackScreens.AthleteExercise, {
            exercise: exercise
        })
    }

    const processFetchedExercises = (exs: ExerciseProps[] | void) => {
        if (!exs) return [];

        const groups = _.groupBy(exs, 'category')

        const groupExs: { title: string, data: ExerciseProps[] }[] = [];

        Object.keys(groups).forEach(function (key) {
            groupExs.push({
                title: key === 'other' ? 'all' : key,
                data: groups[key]
            })
        });

        return groupExs
    }

    const renderItem = useCallback(({ item }: { item: ExerciseProps }) => {
        return <ExerciseSearchPreview exercise={item} onPress={() => onNavigateToExercise(item)} softlete={item.softlete} user={user} />
    }, [exercises])

    const onOpenDrawer = () => navigation.toggleDrawer();

    const onReset = () => {
        setCatFilter('');
        setEquipFilter('');
        setHiddenGroups([]);
        setMGFilter('')
        setShowFilter(false);
        setExercises([]);
        setFetchedExs([])
    }

    const handleOnFilter = () => {
        Keyboard.dismiss();
        setShowFilter(f => f ? false : true);
    }

    const hideGroup = (group: string) => setHiddenGroups(gs => {
        const foundIndex = gs.findIndex(g => group === g);
        if (foundIndex > -1) {
            gs.splice(foundIndex, 1)
        } else {
            gs.push(group)
        }
        return [...gs]
    })

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <SearchFilter
                show={showFilter}
                onHide={() => setShowFilter(false)}
                catFilter={catFilter}
                setCatFilter={setCatFilter}
                equipFilter={equipFilter}
                setEquipFilter={setEquipFilter}
                mGFilter={mGFilter}
                setMGFilter={setMGFilter}
                onReset={onReset}
                onSearchByCat={onSearchByCat}
            />
            <SearchHeader onOpenDrawer={onOpenDrawer} onSearch={onSearch} onFilter={handleOnFilter} />
            <SectionList
                sections={exercises}
                keyExtractor={(item, index) => item._id ? item._id : index.toString()}
                contentContainerStyle={{ paddingBottom: StyleConstants.baseMargin }}
                renderItem={renderItem}
                initialNumToRender={20}
                renderSectionHeader={({ section: { title } }) => (
                    <Pressable style={({ pressed }) => [styles.titleContainer, { backgroundColor: pressed ? BaseColors.lightGrey : BaseColors.lightWhite }]} onPress={() => hideGroup(title)}>
                        <SecondaryText styles={styles.title}>{title}</SecondaryText>
                        {
                            hiddenGroups.find(g => g === title) && <View style={styles.minus} />
                        }
                    </Pressable>
                )}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: BaseColors.primary,
        paddingBottom: StyleConstants.baseMargin,
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin
    },
    menu: {
        marginLeft: StyleConstants.smallMargin,
        justifyContent: 'center', alignItems: 'center'
    },
    title: {
        fontSize: StyleConstants.extraSmallFont,
        color: BaseColors.secondary,
        textTransform: 'capitalize'
    },
    titleContainer: {
        paddingTop: StyleConstants.smallMargin,
        paddingBottom: StyleConstants.smallMargin,
        paddingLeft: StyleConstants.baseMargin,
        paddingRight: StyleConstants.baseMargin,
        borderBottomWidth: .2,
        borderBottomColor: BaseColors.lightGrey,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    minus: {
        width: '4%',
        height: 1,
        borderRadius: 100,
        backgroundColor: BaseColors.secondary
    },
})

const mapStateToProps = (state: ReducerProps) => ({
    exercisesProps: state.athletes.exercises,
    athleteProps: state.athletes.curAthlete,
    user: state.user,
})

export default connect(mapStateToProps)(AthleteSearchExercises);