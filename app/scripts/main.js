'use strict';

var s = {
    dataSrc: [
        {
            'name': 'Frawley Stadium',
            'times': ['0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
            'days': [1, 2, 3, 4, 5]
        },
        {
            'name': 'IMAX stop sign',
            'times': ['0650', '0705', '0720', '0735', '0750', '0805', '0820', '0835', '0850', '0905', '0920', '0935', '0950', '1005', '1035', '1105', '1135', '1205', '1235', '1305', '1335', '1405', '1435', '1505', '1535', '1605', '1620', '1635', '1650', '1705', '1720', '1735', '1750', '1805', '1835'],
            'days': [1, 2, 3, 4, 5]
        },
        {
            'name': 'Juniper Circle',
            'times': ['0655', '0710', '0725', '0740', '0755', '0810', '0825', '0840', '0855', '0910', '0925', '0940', '0955', '1010', '1040', '1110', '1140', '1210', '1240', '1310', '1340', '1410', '1440', '1510', '1540', '1610', '1625', '1640', '1655', '1710', '1725', '1840', '1855', '1910', '1940', '2300'],
            'days': [1, 2, 3, 4, 5]
        }
    ],
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
    noServiceToday: function (shuttleIndex){
        var days = s.dataSrc[shuttleIndex].days;
        if (days.indexOf(s.currentDay()) === -1){
            return true;
        }
        return false;
    },
    nextShuttleTime: function (shuttleIndex) {
        var i, times;
        times = s.dataSrc[shuttleIndex].times;
            
        // Does the shuttle run today?
        if (s.noServiceToday(shuttleIndex)){
            return false;
        }
        // Look for next shuttle time
        for (i = 0; i < times.length; i++) {

            if (parseInt(times[i], 10) >= s.currentMilitaryTime()) {
                return times[i];
            }
        }
        //Last shuttle of the day has already run
        return false;
    },
    minutesUntil: function (shuttleIndex) {
        var nowHoursMinutes,
            depHoursMinutes,
            hoursNow,
            minutesNow,
            hoursNext,
            minutesNext;

        /* If there is a next shuttle */    
        if (s.nextShuttleTime(shuttleIndex)) {
            
            nowHoursMinutes = s.currentMilitaryTime().match(/.{1,2}/g);
            depHoursMinutes = s.nextShuttleTime(shuttleIndex).match(/.{1,2}/g);
            hoursNow = parseInt(nowHoursMinutes[0], 10);
            minutesNow = parseInt(nowHoursMinutes[1], 10);
            hoursNext = parseInt(depHoursMinutes[0], 10);
            minutesNext = parseInt(depHoursMinutes[1], 10);

            /* next shuttle is now */
            if (hoursNow === hoursNext && minutesNow === minutesNext) {
                return 'NOW!';
            /* next shuttle is > an hour in the future */
            } else if (hoursNow + 1 < hoursNext) {
                if (hoursNext > 12) {
                    hoursNext = hoursNext - 12;
                }
                return 'At ' + hoursNext + ':' + s.addLeadingZeros(minutesNext);
            /* next shuttle is in the next hour */
            } else if (hoursNow < hoursNext) {
                return s.pluralize(60 - minutesNow + minutesNext, 'Minute');
            /* next shuttle is in the same hour */
            } else {
                return s.pluralize(minutesNext - minutesNow, 'Minute');
            }
        /* there is no next shuttle */
        } else {
            return 'No Service';
        }
    },
    //Generate html to display table rows
    display: function () {
        var i, 
            template = '';
        
        for (i = 0; i < s.dataSrc.length; i++) {
            template += '<tr><th>' + s.dataSrc[i].name + ':</th><td class="time">' + s.dataSrc[i].nextShuttle + '</td></tr>';
        }

        $('#row-container').html(template);
    },
    //For each location
    //calculate next shuttle time and add to dataSrc object
    init: function () {
        var shuttleIndex;
        for (shuttleIndex = 0; shuttleIndex < s.dataSrc.length; shuttleIndex++) {
            s.dataSrc[shuttleIndex].nextShuttle = s.minutesUntil(shuttleIndex);
        }
        /* Initial Display */
        s.display();
        /* Refresh loop */
        setInterval(function () {
            s.display();
        }, 5000);
    }
};