import { renderDistance, TimeConverter, DateTools } from '@app/utils';
import { getDistance } from 'geolib';
import mean from 'lodash/mean';
import { LocationValue } from 'react-native-health';
import { LatLng } from 'react-native-maps';
import { HealthDataProps } from 'src/services/workout/types';
import { MarkerProps } from 'src/types/route/route.types';
import BaseColors from 'src/utils/BaseColors';

type MileProps = {
  pace: number;
  latitude: number;
  longitude: number;
  averageAltitude: number;
};

type StatisticsProps = {
  topSpeed?: LocationValue;
  topAltitude?: LocationValue;
  averageHeartRate: number;
  averageAltitude: number;
};

class WorkoutTracker {
  public workoutId: string | undefined;
  private metersInMile = 1609.34;
  private previousLocation: LocationValue | null = null;
  public paces: MileProps[] = [];
  public totalMiles = 0;
  private locations: LocationValue[] = [];
  private currentMile = { distance: 0, duration: 0, averageAltitude: 0 };
  public averagePace = 'N/A';
  public statistics: StatisticsProps = {
    averageAltitude: 0,
    averageHeartRate: 0,
  };
  public coordinates: LatLng[] = [];
  public healthData: HealthDataProps | undefined;

  initializeHealthData(healthData: HealthDataProps) {
    this.healthData = healthData;
    this.calculateAveragePace();
    this.workoutId = healthData.activityId;
    if (healthData.heartRates) {
      this.statistics.averageHeartRate = mean(this.healthData.heartRates || []);
    }
  }

  initializeLocations(locations: LocationValue[]) {
    this.locations = locations;
    this.calculateTotalMiles();
    this.startPaceCalculations();
    this.statistics.averageAltitude = mean(this.getAltitudes());
  }

  getDate() {
    if (!this.healthData) return '12/31/9999';
    return DateTools.convertStrToDateToFormatStr(this.healthData.date, '/');
  }

  getAltitudes() {
    return this.locations.map(({ altitude }) =>
      parseFloat(altitude.toFixed(2)),
    );
  }

  getFormattedData() {
    if (!this.healthData) return;

    const duration = TimeConverter.convertSecondsToTimeFormat(
      this.healthData.duration,
    );
    const distance = `${renderDistance(this.healthData.distance)} miles`;
    const averageAltitude = `${
      this.statistics.averageAltitude.toFixed(2) || 0
    } m`;
    const averageHeartRate = `${Math.ceil(
      this.statistics.averageHeartRate || 0,
    )} bpm`;
    const calories = `${this.healthData?.calories?.toFixed(2) || 0} kcal`;
    return {
      ...this.healthData,
      duration,
      distance,
      ...this.statistics,
      averageAltitude,
      averageHeartRate,
      averagePace: this.averagePace,
      calories,
    };
  }

  getSegmentData() {
    return this.paces.map(({ pace, averageAltitude }, order: number) => {
      const fixedAverageAltitude = parseFloat(averageAltitude.toFixed(2));
      return {
        paceLabel: this.getPaceInMinutesSeconds(pace),
        pace,
        order: order + 1,
        averageAltitude: fixedAverageAltitude,
        averageAltitudeLabel: `${fixedAverageAltitude} m`,
        paceInTimeDecimal: TimeConverter.convertMillisecondsToTimeDecimal(pace),
      };
    });
  }

  getPacesInTimeDecimal() {
    return this.paces.map(({ pace }) => {
      return this.getPaceInMinutesSeconds(pace, true) as number;
    });
  }

  getMarkers(): MarkerProps[] {
    const markers: MarkerProps[] = [];

    if (this.locations.length > 0) {
      markers.push({
        name: 'Start',
        coords: this.coordinates[0],
        value: '0:00',
        color: BaseColors.black,
        icon: 'flag',
      });
    }

    const paceMarkers: MarkerProps[] = this.paces.map((paceStore, i) => {
      return {
        value: this.getPaceInMinutesSeconds(paceStore.pace) as string,
        coords: {
          latitude: paceStore.latitude,
          longitude: paceStore.longitude,
        },
        name: `${i + 1} mile`,
        color: BaseColors.primary,
        icon: 'run',
      };
    });

    markers.push(...paceMarkers);

    if (this.healthData) {
      const duration = TimeConverter.convertSecondsToTimeFormat(
        this.healthData.duration,
        true,
      );

      if (this.locations.length > 0) {
        markers.push({
          name: 'finish',
          coords: this.coordinates[this.coordinates.length - 1],
          value: duration,
          color: BaseColors.black,
          icon: 'flag_finish',
        });
      }
    }

    return markers;
  }

  calculateAveragePace() {
    // Calculate the pace in seconds per mile
    if (!this.healthData) return;
    const { duration, distance } = this.healthData;
    if (!distance) return;
    const paceInSeconds = duration / distance;

    // Calculate the number of minutes and seconds
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.round(paceInSeconds % 60);

    // Return the pace in the format of minutes:seconds
    this.averagePace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getPaceInMinutesSeconds(pace: number, typeDecimal = false) {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    if (typeDecimal) {
      return parseFloat(`${minutes}.${seconds < 10 ? '0' : ''}${seconds}`);
    } else {
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
  }

  addLocation(currentLocation: LocationValue) {
    // top speed
    if (!this.statistics.topSpeed) {
      this.statistics.topSpeed = currentLocation;
    } else if (
      this.statistics.topSpeed &&
      currentLocation.speed > this.statistics.topSpeed.speed
    ) {
      this.statistics.topSpeed = currentLocation;
    }

    // top altitude
    if (!this.statistics.topAltitude) {
      this.statistics.topAltitude = currentLocation;
    } else if (
      this.statistics.topAltitude &&
      currentLocation.speed > this.statistics.topAltitude.altitude
    ) {
      this.statistics.topAltitude = currentLocation;
    }

    if (this.previousLocation != null) {
      const distance = getDistance(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          latitude: this.previousLocation.latitude,
          longitude: this.previousLocation.longitude,
        },
      );
      const currentTimestamp = new Date(currentLocation.timestamp).getTime();
      const previousTimestamp = new Date(
        this.previousLocation.timestamp,
      ).getTime();
      const timeInterval = currentTimestamp - previousTimestamp;
      this.addDistance(distance, timeInterval, currentLocation);
    }

    this.previousLocation = currentLocation;
    this.coordinates.push({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
  }

  private startPaceCalculations(): void {
    this.locations.forEach(location => this.addLocation(location));
  }

  private calculateTotalMiles() {
    let totalDistance = 0;
    for (let i = 1; i < this.locations.length; i++) {
      totalDistance += getDistance(
        {
          latitude: this.locations[i].latitude,
          longitude: this.locations[i].longitude,
        },
        {
          latitude: this.locations[i - 1].latitude,
          longitude: this.locations[i - 1].longitude,
        },
      );
    }
    this.totalMiles = Math.floor(totalDistance / this.metersInMile);
  }

  private addDistance(
    distance: number,
    timeInterval: number,
    currentLocation: LocationValue,
  ) {
    this.currentMile.distance += distance;
    this.currentMile.duration += timeInterval;
    if (this.previousLocation !== null) {
      const altitudeDifference =
        currentLocation.altitude - this.previousLocation.altitude;
      this.currentMile.averageAltitude += altitudeDifference;
    }
    if (this.currentMile.distance >= this.metersInMile) {
      const durationInMinutes = this.currentMile.duration / 60000;
      const distanceInMiles = this.currentMile.distance / this.metersInMile;
      const pace = durationInMinutes / distanceInMiles;
      const paceStore = {
        pace,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        averageAltitude: this.currentMile.averageAltitude,
      };
      this.paces.push(paceStore);
      this.currentMile = { distance: 0, duration: 0, averageAltitude: 0 };
    }
  }
}

export default WorkoutTracker;
