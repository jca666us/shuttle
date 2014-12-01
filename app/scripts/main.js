/* global shuttleData */

'use strict';

var s = {
    //load shuttle data file
    dataSrc: shuttleData,
    //Messages
    noServiceMessage: 'No Service',
    nowMessage: 'NOW!',

    //returns current datetime
    now: function() {
        return new Date();
    },

    //extract military time from datetime
    //returns string
    militaryTime: function (date) {
        var minutes = s.addLeadingZeros(date.getMinutes()),
            hours = s.addLeadingZeros(date.getHours());
        return hours + minutes;
    },

    //convert a 4 digit militaty time to civilian time display like 9:30 PM
    civilianTime: function (time) {
        var hours = parseInt(time.substring ( 0,2 )),
            minutes = time.substring ( 2,4 ),
            identifier = 'am';

            if(hours === 12){
              identifier = 'pm';
            }
            if(hours === 0){
              hours = 12;
            }
            if(hours > 12){
              hours = hours - 12;
              identifier='pm';
            }
            return hours + ':' + minutes + '&nbsp;' + identifier;
    },

    //return current day 0-6 : 0 = sunday
    //returns integer
    currentDay: function () {
        return s.now().getDay();
    },

    //add a leading zero to number less than 9
    //returns string
    addLeadingZeros: function (n) {
        if (n < 10) {
            n = '0' + n;
        } else {
            n = n.toString();
        }
        return n;
    },

    //pluralize word if value > 1
    //returns string
    pluralize: function (value, word) {
        if (value === 1) {
            return value + ' ' + word;
        }
        return value + ' ' + word + 's';
    },

    //determines if a given shuttle is running today
    //returns boolean
    noServiceToday: function (shuttleIndex){
        var days = s.dataSrc[shuttleIndex].days;
        if (days.indexOf(s.currentDay()) === -1){
            return true;
        }
        return false;
    },

    //determines the next shuttle time
    //returns either a string of the shuttle military tima
    //or false if no service or last shuttle has run
    nextShuttleTime: function (shuttleIndex) {
        var i, 
            times = s.dataSrc[shuttleIndex].times;
            
        // Does the shuttle run today?
        if (s.noServiceToday(shuttleIndex)){
            return false;
        }
        // Look for next shuttle time
        for (i = 0; i < times.length; i++) {

            if (parseInt(times[i], 10) >= s.militaryTime(s.now())) {
                return times[i];
            }
        }
        //Last shuttle of the day has already run
        return false;
    },

    //generate string for display
    //returns string
    shuttleMessage: function (shuttleIndex) {
        var nowHoursMinutes,
            depHoursMinutes,
            hoursNow,
            minutesNow,
            hoursNext,
            minutesNext;

        // If there is a next shuttle   
        if (s.nextShuttleTime(shuttleIndex)) {
            
            nowHoursMinutes = s.militaryTime(s.now()).match(/.{1,2}/g);
            depHoursMinutes = s.nextShuttleTime(shuttleIndex).match(/.{1,2}/g);
            hoursNow = parseInt(nowHoursMinutes[0], 10);
            minutesNow = parseInt(nowHoursMinutes[1], 10);
            hoursNext = parseInt(depHoursMinutes[0], 10);
            minutesNext = parseInt(depHoursMinutes[1], 10);

            // next shuttle is now
            if (hoursNow === hoursNext && minutesNow === minutesNext) {
                return s.nowMessage;
            // next shuttle is > an hour in the future
            } else if (hoursNow + 1 < hoursNext) {
                if (hoursNext > 12) {
                    hoursNext = hoursNext - 12;
                }
                return 'At ' + hoursNext + ':' + s.addLeadingZeros(minutesNext);
            // next shuttle is in the next hour
            } else if (hoursNow < hoursNext) {
                return s.pluralize(60 - minutesNow + minutesNext, 'Minute');
            // next shuttle is in the same hour
            } else {
                return s.pluralize(minutesNext - minutesNow, 'Minute');
            }
        // there is no next shuttle
        } else {
            return s.noServiceMessage;
        }
    },

    // determine css class for display
    //returns string or empty string
    style: function (shuttleIndex, nextShuttle) {
        if (nextShuttle === s.noServiceMessage) {
            s.dataSrc[shuttleIndex].cssClass = 'noservice';
        } else if (nextShuttle === s.nowMessage) {
            s.dataSrc[shuttleIndex].cssClass = 'now';
        } else {
            s.dataSrc[shuttleIndex].cssClass = '';
        }
    },

    //Recalculate minutes until for each and store results
    //returns undefined
    update: function () {
        var shuttleIndex, nextShuttle;
        for (shuttleIndex = 0; shuttleIndex < s.dataSrc.length; shuttleIndex++) {
            nextShuttle = s.shuttleMessage(shuttleIndex);
            s.dataSrc[shuttleIndex].nextShuttle = nextShuttle;
            s.style(shuttleIndex, nextShuttle);
        }
    },
    //factory to create click event handlers for each shuttle stop
    makeClickHandler: function (i) {
        return function () {
                    s.displayDepartures(i);
                };
    },
    //Generate html to display table rows populated with data
    //returns undefined
    display: function () {
        var i, 
            template = '';
        
        //Update data
        s.update();

        for (i = 0; i < s.dataSrc.length; i++) {
            template += '<tr id="stop'+ i +'"><th>' + s.dataSrc[i].name + ':</th><td class="time ' + s.dataSrc[i].cssClass + '">' + s.dataSrc[i].nextShuttle + '</td></tr>';
        }
        document.getElementById('row-container').innerHTML = template;
        //Assign click handlers for each stop
        for (i = 0; i < s.dataSrc.length; i++) {
            document.getElementById('stop' + i).addEventListener('click', s.makeClickHandler(i));
        }      
    },

    //Generate departure time html
    //returns html string
    listTimes: function (shuttleIndex) {
        var data = s.dataSrc[shuttleIndex].times,
            html = '',
            i;

        for (i = 0; i < data.length; i++) {
            html += s.civilianTime(data[i]);
            //commas for all but last
            if (i < data.length - 1) {
                html += ', ';
            }
        }
        return html;

    },
    //Display departures content
    displayDepartures: function (shuttleIndex) {
        var template = '<div id="departures"><h2>'+
            s.dataSrc[shuttleIndex].name+
            '</h2>'+
            //TODO: Read shuttle days from the data file
            '<p>Monday - Friday</p>'+
            '<span id="close">X</span>'+
            '<p>'+
            s.listTimes(shuttleIndex)+
            '</p></div>';

        document.getElementById('departures-container').innerHTML = template;
        document.getElementById('close').addEventListener('click', s.closeDepartures);

    },

    closeDepartures: function () {
        document.getElementById('close').removeEventListener('click');
        document.getElementById('departures-container').innerHTML = '';
    },

    //Initialize and refresh
    //returns undefined
    init: function () {
        /* Initial Display */
        s.display();
        /* Refresh loop */
        setInterval(function () {
            s.display();
        }, 5000);
    }
};