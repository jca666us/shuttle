'use strict';
var s = {
    fawleyTimes: [
        '0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'
    ],
    currentMilitaryTime: function () {
        var now = new Date(),
        minutes = now.getMinutes(),
        hours = now.getHours().toString();

        if (minutes < 10) {
            minutes = '0' + minutes;
        } else {
            minutes = minutes.toString();
        }

        return hours + minutes;
    },
    nextShuttleTime: function () {
        var i;
        for (i = 0; i < s.fawleyTimes.length - 1; i++) {

            if (parseInt(s.fawleyTimes[i]) > s.currentMilitaryTime()){
                return s.fawleyTimes[i];
            }
        }
        return false;
    },
    minutesUntil: function () {
        var nowHoursMinutes = s.currentMilitaryTime().match(/.{1,2}/g),
            depHoursMinutes = s.nextShuttleTime().match(/.{1,2}/g),
            hoursNow = parseInt(nowHoursMinutes[0]),
            minutesNow = parseInt(nowHoursMinutes[1]),
            hoursNext = parseInt(depHoursMinutes[0]),
            minutesNext = parseInt(depHoursMinutes[1]);

        /* next shuttle is in the next hour */
        if (hoursNow < hoursNext) {
            return 60 - minutesNow + minutesNext;
        /* next shuttle is in the same hour */
        } else {
            return minutesNext - minutesNow;
        }

        
    }
};

console.log(s.minutesUntil());
