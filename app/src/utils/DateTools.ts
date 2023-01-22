class DateTools {
  strToMMDD(dStr: string) {
    return dStr.substring(5, dStr.length).replace('-', '/');
  }

  isValidDateStr(dStr: any) {
    const arrStr = dStr.split('-');
    if (arrStr.length !== 3) return false;
    const y = parseInt(arrStr[0]);
    const m = parseInt(arrStr[1]) - 1;
    const d = parseInt(arrStr[2]);
    const date = new Date(y, m, d);
    if (date) return true;
    return false;
  }

  isSameDate(d1: Date, d2: Date) {
    return (
      d1.getUTCDate() === d2.getUTCDate() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCFullYear() === d2.getUTCFullYear()
    );
  }

  UTCISOToLocalDate(s: string) {
    if (!s) return new Date();
    const b: any[] = s.split(/\D+/);
    return new Date(b[0], --b[1], b[2]);
  }

  getStartOfNextWeek(d: Date) {
    const weekDay = d.getDay();
    if (weekDay === 0) {
      return d;
    }

    //get days until sunday
    const daysToAdd = 7 - weekDay;
    d.setDate(d.getDate() + daysToAdd);
    return new Date(d);
  }

  convertStrToDateToFormatStr(d: string, formatType = '-', formatOrder = 'd') {
    const date = this.UTCStrToLocal(d);
    return this.dateToStr(date, formatType, formatOrder);
  }

  dateToStr(d: Date, formatType = '-', formatOrder = 'm') {
    let month: any = d.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day: any = d.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    if (formatOrder === 'd') {
      return month + formatType + day + formatType + d.getFullYear();
    }

    return d.getFullYear() + formatType + month + formatType + day;
  }

  strToDate(dStr: string): Date {
    //yyyy-mm-dd format
    const arrStr = dStr.split('-');
    if (arrStr.length !== 3) return new Date();
    const y = parseInt(arrStr[0]);
    const m = parseInt(arrStr[1]) - 1;
    const d = parseInt(arrStr[2]);

    if (y === undefined || m === undefined || d === undefined)
      return new Date();

    return new Date(y, m, d);
  }

  getMonthPrevious(d: Date, months: number) {
    return new Date(d.getFullYear(), d.getMonth() - months, d.getDate());
  }

  YYYYMMDDToMMDD(d: string) {
    return d.slice(5).replace('-', '/');
  }

  UTCStrToLocal(utcStr: string) {
    const utcDate = new Date(utcStr);
    const utc = Date.UTC(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate(),
      utcDate.getHours(),
      utcDate.getMinutes(),
      utcDate.getSeconds(),
    );
    const localDate = new Date(utc);
    return localDate;
  }

  // a and b are javascript Date objects
  dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(
      a.getFullYear(),
      a.getMonth(),
      a.getDate(),
      a.getHours(),
      a.getMinutes(),
      a.getSeconds(),
    );
    const utc2 = Date.UTC(
      b.getFullYear(),
      b.getMonth(),
      b.getDate(),
      b.getHours(),
      b.getMinutes(),
      b.getSeconds(),
    );
    const diffDays = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    const diffTime = Math.abs(utc2 - utc1);
    return {
      days: diffDays,
      mil: diffTime,
    };
  }
}

export default new DateTools();
