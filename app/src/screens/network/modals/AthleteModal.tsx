import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Pressable, Keyboard, ActivityIndicator } from 'react-native';
import Chevron from '../../../assets/ChevronSvg';
import modalStyles from '../../../components/modal/styles';
import PrimaryText from '../../../components/elements/PrimaryText';
import BaseColors from '../../../utils/BaseColors';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import PersonRemoveSvg from '../../../assets/PersonRemoveSvg';
import WarningSvg from '../../../assets/WarningSvg';
import Input from '../../../components/elements/Input';
import SecondaryText from '../../../components/elements/SecondaryText';
import PrimaryButton from '../../../components/elements/PrimaryButton';
import styles from '../../../components/modal/styles';
import { normalize } from '../../../utils/tools';
import { ReducerProps } from '../../../services';
import { connect } from 'react-redux';
import { sendFriendRequest } from '../../../services/athletes/actions';
import { AthleteActionProps, AthleteProfileProps } from '../../../services/athletes/types';
import { FriendStatus, UserActionProps, UserProps } from '../../../services/user/types';
import StyleConstants from '../../../components/tools/StyleConstants';
import CloseSvg from '../../../assets/CloseSvg';
import { handleBlockUser } from '../../../services/user/actions';
import PersonBlockSvg from '../../../assets/PersonBlockSvg';
import reportUser from '../../utils/report-user';


interface Props {
    onReport: (des: string) => Promise<void>;
    navigation: any;
    athlete: AthleteProfileProps;
    sendFriendRequest: AthleteActionProps['sendFriendRequest'];
    user: UserProps;
    handleBlockUser: UserActionProps['handleBlockUser']
}


const AthleteModal = ({ athlete, sendFriendRequest, navigation, user, handleBlockUser }: Props) => {
    const [report, setReport] = useState(false);
    const [loading, setLoading] = useState(false);
    const headerHeight = useHeaderHeight();
    const mount = useRef(false);

    useEffect(() => {
        mount.current = true;
        return () => {
            mount.current = false;
        }
    }, [])

    const onReport = () => reportUser(athlete.uid);

    const onUnfollow = () => {
        sendFriendRequest(athlete.uid, FriendStatus.denied)
            .then(() => {
                navigation.goBack()
            })
            .catch(err => {
                console.log(err)
            })

    }

    const isBlocked = () => user.blockUids.find(uid => uid === athlete.uid) ? true : false;

    const onBlockUser = () => {
        if (loading) return
        setLoading(true)
        handleBlockUser(athlete.uid, isBlocked())
            .then(() => {
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const renderContent = () => {
        return (
            <View>
                <Pressable style={modalStyles.item} onPress={onUnfollow}>
                    <SecondaryText styles={modalStyles.label}>Unfollow</SecondaryText>
                    <View style={modalStyles.svg}>
                        <PersonRemoveSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={modalStyles.item} onPress={onReport}>
                    <SecondaryText styles={modalStyles.label}>Report</SecondaryText>
                    <View style={modalStyles.svg}>
                        <WarningSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={modalStyles.item} onPress={onBlockUser}>
                    <SecondaryText styles={modalStyles.label}>{isBlocked() ? 'Unblock' : "Block"}</SecondaryText>
                    <View style={styles.svg}>
                        <PersonBlockSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

                <Pressable style={modalStyles.item} onPress={() => navigation.goBack()}>
                    <SecondaryText styles={modalStyles.label}>Cancel</SecondaryText>
                    <View style={{ height: normalize.width(30), width: normalize.width(30) }}>
                        <CloseSvg fillColor={BaseColors.primary} />
                    </View>
                </Pressable>

            </View>
        )
    }

    return (
        <SafeAreaView style={modalStyles.container} edges={['left', 'right', 'bottom']}>
            <Pressable onPress={() => navigation.goBack()} style={modalStyles.closeContainer} />
            <View style={[modalStyles.content, { marginTop: headerHeight }]}>
                <View style={modalStyles.modal}>
                    <View style={modalStyles.headerContainer}>
                        {
                            (report) ? (
                                <Pressable style={modalStyles.backContainer} onPress={() => setReport(false)}>
                                    <Chevron strokeColor={BaseColors.black} />
                                </Pressable>
                            ) :
                                <View />
                        }
                        <PrimaryText styles={modalStyles.title}>{report ? "Report" : "Menu"}</PrimaryText>
                        <View />
                    </View>
                    {
                        loading && (
                            <ActivityIndicator size='small' color={BaseColors.primary} style={styles.loading} />
                        )
                    }
                    {renderContent()}
                </View>
            </View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state: ReducerProps) => ({
    athlete: state.athletes.curAthlete,
    user: state.user
})


export default connect(mapStateToProps, { sendFriendRequest, handleBlockUser })(AthleteModal);