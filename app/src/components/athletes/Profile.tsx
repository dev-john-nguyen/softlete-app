import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { capitalize, normalize } from '../../utils/tools';
import StyleConstants from '../tools/StyleConstants';
import { UserProps, FriendStatus, FriendProps } from '../../services/user/types';
import SecondaryText from '../elements/SecondaryText';
import FastImage from 'react-native-fast-image';
import BaseColors from '../../utils/BaseColors';
import PersonSvg from '../../assets/PersonSvg';
import { AthleteProfileProps } from '../../services/athletes/types';
import PersonAddSvg from '../../assets/PersonAddSvg';
import AthletProfileItems from './components/AthleteProfileItems';
import _ from 'lodash';
import ProfileButton from './components/ProfileButton';
import { HealthDataProps, WorkoutProps } from '../../services/workout/types';
import { ExerciseProps } from '../../services/exercises/types';

interface Props {
    user: UserProps | AthleteProfileProps;
    sendRequest?: (status: FriendStatus) => void;
    friend?: string;
    onMessage?: () => void;
    healthData?: HealthDataProps[];
    workouts: WorkoutProps[];
    exercises: ExerciseProps[];
    friends: FriendProps[];
    navigateToFriends: () => void;
    navigateToExercises: () => void;
}

const Profile = ({ user, sendRequest, friend, onMessage, healthData, friends, workouts, exercises, navigateToFriends, navigateToExercises }: Props) => {

    const renderAthleteContent = () => {
        if (friend) {
            switch (friend) {
                case 'add':
                    return <ProfileButton text='Follow' onPress={() => sendRequest && sendRequest(FriendStatus.pending)} />
                case 'pending':
                    return <ProfileButton text='Pending' onPress={() => sendRequest && sendRequest(FriendStatus.denied)} />
                case 'respond':
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <ProfileButton text='Accept' onPress={() => sendRequest && sendRequest(FriendStatus.accepted)} />
                            <ProfileButton text='Decline' onPress={() => sendRequest && sendRequest(FriendStatus.denied)} />
                        </View>
                    )
                default:
                    return <ProfileButton text='Unfollow' onPress={() => sendRequest && sendRequest(FriendStatus.denied)} />
            }
        }

        return (
            <Pressable style={styles.svgContainer} onPress={() => sendRequest && sendRequest(FriendStatus.pending)} hitSlop={5}>
                <PersonAddSvg strokeColor={BaseColors.primary} />
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {
                    !!user.imageUri ? <FastImage
                        style={styles.image}
                        source={{
                            uri: user.imageUri,
                            priority: 'normal'
                        }}
                    /> :
                        <View style={styles.image}>
                            <View style={styles.svg}>
                                <PersonSvg />
                            </View>
                        </View>
                }
                <View style={{ flex: 1, marginLeft: StyleConstants.smallMargin }}>
                    <SecondaryText styles={styles.username} bold>{`${user.name ? capitalize(user.name) : user.username}`}</SecondaryText>
                    <SecondaryText styles={styles.athlete}>({user.athlete})</SecondaryText>
                </View>
            </View>
            {
                !!user.bio && (
                    <SecondaryText styles={styles.bio}>{user.bio}</SecondaryText>
                )
            }
            {renderAthleteContent()}
            <AthletProfileItems
                healthData={healthData}
                navigateToFriends={navigateToFriends}
                navigateToExercises={navigateToExercises}
                friends={friends}
                exercises={exercises}
                workouts={workouts}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: StyleConstants.baseMargin,
        marginLeft: StyleConstants.baseMargin,
        alignItems: 'center'
    },
    headerContainer: {
        marginBottom: StyleConstants.smallMargin,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        height: normalize.width(9),
        width: normalize.width(9),
    },
    username: {
        fontSize: StyleConstants.mediumFont,
        color: BaseColors.primary,
        marginTop: 5
    },
    image: {
        height: normalize.width(6),
        width: normalize.width(6),
        borderRadius: 100,
        backgroundColor: BaseColors.white
    },
    athlete: {
        fontSize: StyleConstants.smallerFont,
        color: BaseColors.secondary,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    bio: {
        fontSize: StyleConstants.smallFont,
        color: BaseColors.black,
        width: '100%',
        marginBottom: StyleConstants.smallMargin,
    },
    svgContainer: {
        width: normalize.width(15),
        height: normalize.width(15),
        zIndex: 1000,
        alignSelf: 'center'
    },
    svg: {
        width: '100%'
    }
})

export default (Profile);
