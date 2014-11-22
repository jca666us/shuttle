'use strict';

var s = {
    dataSrc: {
        'frawley': {
            'name': 'Frawley Stadium',
            'times': ['0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
            'days': [1, 2, 3, 4, 5]
        },
        'imax': {
            'name': 'IMAX stop sign',
            'times': ['0650', '0705', '0720', '0735', '0750', '0805', '0820', '0835', '0850', '0905', '0920', '0935', '0950', '1005', '1035', '1105', '1135', '1205', '1235', '1305', '1335', '1405', '1435', '1505', '1535', '1605', '1620', '1635', '1650', '1705', '1720', '1735', '1750', '1805', '1835'],
            'days': [1, 2, 3, 4, 5]
        },
        'juniper': {
            'name': 'Juniper Circle',
            'times': ['0655', '0710', '0725', '0740', '0755', '0810', '0825', '0840', '0855', '0910', '0925', '0940', '0955', '1010', '1040', '1110', '1140', '1210', '1240', '1310', '1340', '1410', '1440', '1510', '1540', '1610', '1625', '1640', '1655', '1710', '1725', '1840', '1855', '1910', '1940'],
            'days': [1, 2, 3, 4, 5]
        }
    },

    currentMilitaryTime: function () {
        var now = new Date(),
            //var now = new Date(2014, 9, 27, 8, 55),
            minutes = s.addLeadingZeros(now.getMinutes()),
            hours = s.addLeadingZeros(now.getHours());
        return hours + minutes;
    },
    currentDay: function () {
        var now = new Date();
        return now.getDay();
    },
    addLeadingZeros: function (n) {
        if (n < 10) {
            n = '0' + n;
        } else {
            n = n.toString();
        }
        return n;
    },
    pluralize: function (value, word) {
        if (value === 1) {
            return value + ' ' + word;
        }
        return value + ' ' + word + 's';
    },
    nextShuttleTime: function (where) {
        var i, times, days;

        switch (where) {
        case 'Frawley Stadium':
            times = s.dataSrc.frawley.times;
            days = s.dataSrc.frawley.days;
            break;
        case 'Juniper Circle':
            times = s.dataSrc.juniper.times;
            days = s.dataSrc.juniper.days;
            break;
        default:
            console.log('Invalid shuttle location');
        }
        // Check this is a day the shuttle runs
        if (days.indexOf(s.currentDay()) === -1){
            return false;
        }

        for (i = 0; i < times.length; i++) {

            if (parseInt(times[i], 10) >= s.currentMilitaryTime()) {
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
            hoursNow = parseInt(nowHoursMinutes[0], 10);
            minutesNow = parseInt(nowHoursMinutes[1], 10);
            hoursNext = parseInt(depHoursMinutes[0], 10);
            minutesNext = parseInt(depHoursMinutes[1], 10);

            /* DEBUGGING
            console.log('%c nowHoursMinutes = ' + nowHoursMinutes, 'color: #ff0000;');
            console.log('%c depHoursMinutes = ' + depHoursMinutes, 'color: #006600;');
            console.log('%c hoursNow = ' + hoursNow, 'color: #0000ff;');
            console.log('%c hoursNext = ' + hoursNext, 'color: #ff00ff;');
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
                return s.pluralize(60 - minutesNow + minutesNext, 'Minute');
            /* next shuttle is in the same hour */
            } else {
                return s.pluralize(minutesNext - minutesNow, 'Minute');
            }

        } else {
            /* there is no next shuttle */
            return 'No Service';
        }


    },

    display: function () {
        $('#fawleyNextShuttle').html(s.minutesUntil(s.dataSrc.frawley.name));
        $('#juniperNextShuttle').html(s.minutesUntil(s.dataSrc.juniper.name));
    }
};

/* Initial Display */
s.display();

/* Refresh loop */
setInterval(function () {
    s.display();
}, 5000);


