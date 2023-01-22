import React, { useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  Polyline,
  Region,
  Animated as MapAnimated,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';
import BaseColors, { rgba } from '../../utils/BaseColors';
import ScreenTemplate from '../../components/elements/ScreenTemplate';
import {
  useMapAdjustView,
  useRouteMarkers,
  zoomToMarker,
} from '../../hooks/workout/route.hooks';
import MapRouteContents from '../../components/route/map/MapRouteContents';
import PrimaryText from '../../components/elements/PrimaryText';
import { FlexBox } from '@app/ui';
import Icon from '@app/icons';
import { Colors, moderateScale } from '@app/utils';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps, HomeStackScreens } from './types';
import { BackButton } from '@app/elements';
import { MarkerProps } from 'src/types/route/route.types';

interface MapMarkersProps {
  markers: MarkerProps[];
  setActiveMarkIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const MapMarkers = ({ markers, setActiveMarkIndex }: MapMarkersProps) => {
  const onPress = (index: number) => () => setActiveMarkIndex(index);

  return (
    <>
      {markers.map((marker, i) => (
        <Marker
          coordinate={marker.coords}
          key={i}
          onPress={onPress(i)}
          pinColor={marker.color || Colors.primary}
        />
      ))}
    </>
  );
};

const Map = () => {
  const region = useRef(new AnimatedRegion()).current;
  const navigation = useNavigation<NavigationProps>();
  const mapRef = useRef<MapAnimated>();
  const { redirectToScreen, workoutTracker } = useRouteMarkers();
  const { activeMarkIndex, setActiveMarkIndex } = zoomToMarker(
    region,
    workoutTracker.getMarkers(),
  );

  useMapAdjustView(mapRef, workoutTracker.coordinates);

  const onRegionChange = (val: Region) => region.setValue(val);

  const onZoomOut = () =>
    mapRef.current?.fitToCoordinates(workoutTracker.coordinates, {
      edgePadding: {
        top: moderateScale(20),
        right: moderateScale(20),
        bottom: moderateScale(50),
        left: moderateScale(20),
      },
    });

  if (!region) {
    return (
      <ScreenTemplate>
        <ActivityIndicator size={'large'} color={BaseColors.white} />
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate>
      <MapAnimated
        style={{ flex: 1 }}
        region={region}
        onRegionChange={onRegionChange}
        ref={mapRef as any}>
        <MapMarkers
          markers={workoutTracker.getMarkers()}
          setActiveMarkIndex={setActiveMarkIndex}
        />
        <Polyline
          coordinates={workoutTracker.coordinates}
          strokeColor={BaseColors.lightPrimary}
          strokeWidth={3}
        />
      </MapAnimated>
      <MapRouteContents
        markers={workoutTracker.getMarkers()}
        activeMarkIndex={activeMarkIndex}
        setActiceMarkIndex={setActiveMarkIndex}
      />
      <FlexBox position="absolute" top={10} left={10} zIndex={100}>
        <BackButton rotateBack="0deg" onPress={() => navigation.goBack()} />
      </FlexBox>
      <FlexBox position="absolute" top={10} right={10} zIndex={100}>
        <Icon
          icon="zoom_out"
          size={30}
          color={Colors.white}
          containerStyles={{ marginRight: 10 }}
          onPress={onZoomOut}
        />
        <Icon
          icon="notebook"
          size={30}
          color={Colors.white}
          onPress={redirectToScreen(HomeStackScreens.WorkoutActivitySummary)}
        />
      </FlexBox>
      {workoutTracker.workoutId && workoutTracker.coordinates.length < 1 ? (
        <FlexBox
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          alignItems="center"
          zIndex={1}
          backgroundColor={rgba(BaseColors.primaryRgb, 0.4)}
          justifyContent="center"
          column>
          <Icon icon="compass" size={30} color={Colors.white} />
          <PrimaryText size="medium" marginTop={5}>
            No Route Found
          </PrimaryText>
          <PrimaryText size="small">
            Activity does not contain route data.
          </PrimaryText>
        </FlexBox>
      ) : (
        <></>
      )}
    </ScreenTemplate>
  );
};

export default Map;
