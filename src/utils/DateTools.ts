class DateTools {

    isValidDateStr(dStr: any) {
        if (!dStr) return false
        let arrStr = dStr.split('-');
        if (arrStr.length !== 3) return false;
        let y = parseInt(arrStr[0]);
        let m = parseInt(arrStr[1]) - 1;
        let d = parseInt(arrStr[2]);
        const date = new Date(y, m, d)
        if (date) return true
        return false;
    }


    getStartOfNextWeek(d: Date) {
        const weekDay = d.getDay();
        if (weekDay === 0) {
            return d;
        }

        //get days until sunday
        const daysToAdd = 7 - weekDay;
        d.setDate(d.getDate() + daysToAdd)
        return new Date(d)
    }

    addDaysToDate(d: Date, days: number) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days)
    }


    dateToStr(d: Date) {
        let month: any = d.getMonth() + 1
        if (month < 10) {
            month = '0' + month
        }
        let day: any = d.getDate();
        if (day < 10) {
            day = '0' + day
        }
        return d.getFullYear() + '-' + month + '-' + day
    }


    strToDate(dStr: string): Date | false {
        //yyyy-mm-dd format
        let arrStr = dStr.split('-');
        if (arrStr.length !== 3) return false;
        let y = parseInt(arrStr[0]);
        let m = parseInt(arrStr[1]) - 1;
        let d = parseInt(arrStr[2]);

        if (y === undefined || m === undefined || d === undefined) return false;

        const date = new Date(y, m, d)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
    }
}

export default new DateTools;