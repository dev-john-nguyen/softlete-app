class TimeConverter {
  // method to convert seconds to time format
  public convertSecondsToTimeFormat(
    seconds: number,
    withoutLabel = false,
  ): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let time = '';
    if (hours >= 1) {
      time = `${hours.toString()}:${minutes.toString().padStart(2, '0')} ${
        withoutLabel ? '' : 'hrs'
      }`;
    } else if (minutes >= 1) {
      time = `${minutes.toString()}:${secs.toString().padStart(2, '0')} ${
        withoutLabel ? '' : 'mins'
      }`;
    } else {
      time = `${secs.toString()} ${withoutLabel ? '' : 'secs'}`;
    }
    return time;
  }

  // method to convert milliseconds to time format
  public convertMillisecondsToTimeFormat(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    return this.convertSecondsToTimeFormat(seconds);
  }

  public millisecondsToMinutes(milliseconds: number): number {
    return milliseconds / 60000;
  }

  public convertMillisecondsToTimeDecimal(milliseconds: number): number {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return parseFloat(`${minutes}.${secs}`);
  }
}

export default new TimeConverter();
