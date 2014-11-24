/* global describe, it, s, assert, beforeEach, afterEach */

(function () {
  'use strict';
  //s.now
  describe('now method', function () {
    it('should return a date object', function () {
      var d = s.now();
      assert(typeof(d) === 'object');
      assert(d.getDay() < 7 && d.getDay() > -1);
    });
  });

  //s.miliraryTime
  describe('militaryTime method', function () {
    it('should convert a date object to military time', function () {
      it('should convert 1h 1m to 0101', function () {
        var d = new Date (2014, 10, 23, 1, 1);
        assert(s.militaryTime(d) === '0101');
      });
      it('should convert 23h 59m to 2359', function () {
        var d = new Date (2014, 10, 23, 23, 59);
        assert(s.militaryTime(d) === '2359');
      });
    });
  });

  //s.addLeadingZeros
  describe('addLeadingZeros method', function () {
    it('should add leading zeros to single digit numbers', function () {
      assert(s.addLeadingZeros(0) === '00');
      assert(s.addLeadingZeros(9) === '09');
    });
    it('should not add leading zeros to multi digit numbers', function () {
      assert(s.addLeadingZeros(10) === '10');
      assert(s.addLeadingZeros(59) === '59');
    });
  });
  //s.pluralize
  describe('pluralize method', function () {
    it('should pluralize', function () {
      assert(s.pluralize(2, 'hour') === '2 hours');
    });
    it('should not pluralize', function () {
      assert(s.pluralize(1, 'hour') === '1 hour');
    });
  });
  //s.noServiceToday
  describe('noServiceToday method', function () {
    
    beforeEach(function () {
      s.temp = s.currentDay;
    });
    
    afterEach(function () {
      s.currentDay = s.temp;
      s.temp = null;
    });
    
    describe('service day', function () {
      it('noServiceToday should be false', function () {
        s.currentDay = function () {
          return 1;
        };
        assert(s.noServiceToday(0) === false);
      });
    });
    
    describe('no service day', function () {
      it('noServiceToday should be true', function () {
        s.currentDay = function () {
          return 0;
        };
        assert(s.noServiceToday(0) === true);
      });
    });
  });
  //s.nextShuttleTime
  describe('nextShuttleTime method', function () {
    beforeEach(function () {
      s.temp = s.dataSrc;
      s.temp2 = s.now;
      s.dataSrc = [
        {
          'name': 'Test Location',
          'times': ['0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
          'days': [1, 2, 3, 4, 5]
        }
      ];
    });
    
    afterEach(function () {
      s.dataSrc = s.temp;
      s.now = s.temp2;
      s.temp = null;
      s.temp2 = null;
    });

    //no service days
    describe('days the shuttle does not run', function () {
      it('should not find any shuttles', function () {
        s.now = function () {
          return new Date('Sun Nov 23 2014 08:35:00 GMT-0500 (EST)');
        };
        assert(s.nextShuttleTime(0) === false);
      });
    });
    //normal next shuttle
    describe('next shuttle time', function () {
      it('should find the next shuttle', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 08:35:00 GMT-0500 (EST)');
        };
        assert(s.nextShuttleTime(0) === '0845');
      });
    });
    //start of day
    describe('start of day', function () {
      it('should find the first shuttle', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 05:30:00 GMT-0500 (EST)');
        };
        assert(s.nextShuttleTime(0) === '0645');
      });
    });
    //end of day
    describe('end of day', function () {
      it('should not find any more shuttles', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 18:31:00 GMT-0500 (EST)');
        };
        assert(s.nextShuttleTime(0) === false);
      });
    });
  });
  //s.minutesUntil
  describe('minutesUntil method', function () {
    beforeEach(function () {
      s.temp = s.nextShuttleTime;
      s.temp2 = s.now;
    });
    afterEach(function () {
      s.nextShuttleTime = s.temp;
      s.now = s.temp2;
      s.temp = null;
      s.temp2 = null;
    });
    // no service
    describe('no service', function (){
      it('should return the no service message', function () {
        s.nextShuttleTime = function () {
          return false;
        };
        assert(s.minutesUntil() === s.noServiceMessage);
      });
    });
    // shuttle is leaving now
    describe('shuttle is now', function () {
      it('should return now message', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 8:45:00 GMT-0500 (EST)');
        };
        s.nextShuttleTime = function () {
          return '0845';
        };
        assert(s.minutesUntil() === s.nowMessage);
      });
    });
    // next shuttle is > an hour in the future
    describe('shuttle is > an hour in the future', function () {
      it('should return proper message', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 3:45:00 GMT-0500 (EST)');
        };
        s.nextShuttleTime = function () {
          return '0645';
        };
        assert(s.minutesUntil() === 'At 6:45');
      });
    });
    // next shuttle is in the next hour
    describe('shuttle is in the next hour', function () {
      it('should return proper message', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 11:45:00 GMT-0500 (EST)');
        };
        s.nextShuttleTime = function () {
          return '1215';
        };
        assert(s.minutesUntil() === '30 Minutes');
      });
    });
    // next shuttle is in the same hour
    describe('shuttle is in the same hour', function () {
      it('should return proper message', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 12:15:00 GMT-0500 (EST)');
        };
        s.nextShuttleTime = function () {
          return '1230';
        };
        assert(s.minutesUntil() === '15 Minutes');
      });
    });
  });
})();
