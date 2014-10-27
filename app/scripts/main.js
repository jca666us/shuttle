'use strict';

var s = {
    fawleyTimes: ['0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
    juniperTimes: ['0655', '0710', '0725', '0740', '0755', '0810', '0825', '0840', '0855', '0910', '0925', '0940', '0955', '1010', '1040', '1110', '1140', '1210', '1240', '1310', '1340', '1410', '1440', '1510', '1540', '1610', '1625', '1640', '1655', '1710', '1725', '1840', '1855', '1910', '1940'],
    // TODO: Add third pickup location
    //juniperTimes: ['0900'],

    currentMilitaryTime: function () {
        var now = new Date(),
        //var now = new Date(2014, 9, 27, 8, 55),
        minutes = s.addLeadingZeros(now.getMinutes()),
        hours = s.addLeadingZeros(now.getHours());
        return hours + minutes;
    },
    addLeadingZeros: function (n) {
        if (n < 10) {
            n = '0' + n;
        } else {
            n = n.toString();
        }
        return n;
    },
    nextShuttleTime: function (where) {
        var i, times;

        //TODO: Only show times on weekdays

        switch (where) {
            case 'fawley':
                times = s.fawleyTimes;
                break;
            case 'juniper':
                times = s.juniperTimes;
                break;
            default:
                console.log('Invalid shuttle location');
        }

        for (i = 0; i < times.length; i++) {

            if (parseInt(times[i]) >= s.currentMilitaryTime()){
                return times[i];
            }
        }
        return false;
    },
    minutesUntil: function (where) {
        var nowHoursMinutes,
            depHoursMinutes,
            hoursNow,
            minutesNow,
            hoursNext,
            minutesNext;

        if (s.nextShuttleTime(where)) {
            /* If there is a next shuttle */
            nowHoursMinutes = s.currentMilitaryTime().match(/.{1,2}/g);
            depHoursMinutes = s.nextShuttleTime(where).match(/.{1,2}/g);
            hoursNow = parseInt(nowHoursMinutes[0]);
            minutesNow = parseInt(nowHoursMinutes[1]);
            hoursNext = parseInt(depHoursMinutes[0]);
            minutesNext = parseInt(depHoursMinutes[1]);
            /*
            console.log('nowHoursMinutes = ' + nowHoursMinutes);
            console.log('depHoursMinutes = ' + depHoursMinutes);
            console.log('hoursNow = ' + hoursNow);
            console.log('hoursNext = ' + hoursNext);
            */
            /* next shuttle is now */
            if (hoursNow === hoursNext && minutesNow === minutesNext) {
                return 'NOW!';
            /* next shuttle is > an hour in the future */
            } else if (hoursNow + 1 < hoursNext) {
                if (hoursNext > 12) {
                    hoursNext = hoursNext - 12;
                }
                return 'At ' + hoursNext + ':' + minutesNext;
            /* next shuttle is in the next hour */
            } else if (hoursNow < hoursNext) {
                return 60 - minutesNow + minutesNext + ' Minutes';
            /* next shuttle is in the same hour */
            } else {
                return minutesNext - minutesNow + ' Minutes';
            }

        } else {
            /* there is no next shuttle */
            return 'No Service';
        }

        
    },

    display: function () {
        $('#fawleyNextShuttle').html(s.minutesUntil('fawley'));
        $('#juniperNextShuttle').html(s.minutesUntil('juniper'));
    }
};

/* Initial Display */
s.display();

/* Refresh loop */
setInterval(function() {
    s.display();
}, 5000);


