/* global describe, it, s, assert, beforeEach, afterEach */

(function () {
  'use strict';

  var testData = [
    {
      'name': 'Test Location 1',
      'times': ['0645', '0700', '0715', '0730', '0745', '0800', '0815', '0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
      'days': [1, 2, 3, 4, 5]
    },
    {
      'name': 'Test Location 2',
      'times': ['0830', '0845', '0900', '0915', '0930', '0945', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1615', '1630', '1645', '1700', '1715', '1730', '1745', '1800', '1830'],
      'days': [1, 2, 3, 4, 5]
    },
    {
      'name': 'Test Location 3',
      'times': ['0830', '0845', '0900'],
      'days': [1, 2, 3, 4, 5]
    }
  ];
  beforeEach(function () {
    s.tempData = s.dataSrc;
    s.dataSrc = testData;
  });
  
  afterEach(function () {
    s.dataSrc = s.tempData;
    s.tempData = null;
  });
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
    it('should convert 1h 1m to 0101', function () {
      var d = new Date (2014, 10, 23, 1, 1);
      assert(s.militaryTime(d) === '0101');
    });
    it('should convert 23h 59m to 2359', function () {
      var d = new Date (2014, 10, 23, 23, 59);
      assert(s.militaryTime(d) === '2359');
    });
  });

  //s.civilianTime
  describe('civilianTime method', function () {
    it('should convert 0101 to 1:01 am', function () {
      assert(s.civilianTime('0101') === '1:01&nbsp;am');
    });
    it('should convert 1200 to 12:00 pm', function () {
      assert(s.civilianTime('1200') === '12:00&nbsp;pm');
    });
    it('should convert 1530 to 3:30 pm', function () {
      assert(s.civilianTime('1530') === '3:30&nbsp;pm');
    });
    it('should convert 0000 to 12:00 am', function () {
      assert(s.civilianTime('0000') === '12:00&nbsp;am');
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
    
    describe('for a service day', function () {
      it('noServiceToday should be false', function () {
        s.currentDay = function () {
          return 1;
        };
        assert(s.noServiceToday(0) === false);
      });
    });
    
    describe('for a no service day', function () {
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
      s.temp = s.now;
    });
    
    afterEach(function () {
      s.now = s.temp;
      s.temp = null;
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

  //s.shuttleMessage
  describe('shuttleMessage method', function () {
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
        assert(s.shuttleMessage() === s.noServiceMessage);
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
        assert(s.shuttleMessage() === s.nowMessage);
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
        assert(s.shuttleMessage() === 'At 6:45');
      });
    });

    // next shuttle is > an hour in the future
    describe('shuttle is > an hour in the future and in the afternoon', function () {
      it('should return proper message', function () {
        s.now = function () {
          return new Date('Fri Nov 21 2014 12:00:00 GMT-0500 (EST)');
        };
        s.nextShuttleTime = function () {
          return '1400';
        };
        assert(s.shuttleMessage() === 'At 2:00');
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
        assert(s.shuttleMessage() === '30 Minutes');
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
        assert(s.shuttleMessage() === '15 Minutes');
      });
    });
  });

  //s.style
  describe('style method', function () {
    describe('when given shuttleIndex and nextShuttle', function () {
      it('should add the noservice class', function () {
         s.style(0, s.noServiceMessage);
         assert(s.dataSrc[0].cssClass === 'noservice');
      });
      it('should add the now class', function () {
         s.style(1, s.nowMessage);
         assert(s.dataSrc[1].cssClass === 'now');
      });
      it('should show default class', function () {
         s.style(0, '0930');
         assert(s.dataSrc[0].cssClass === '');
      });
    });
  });

  //s.update
  describe('update method', function () {
    beforeEach(function () {
      s.temp = s.now;
    });
    
    afterEach(function () {
      s.now = s.temp;
      s.temp = null;
    });

    describe('update', function () {
      it('should populate all nextShuttles in the data source', function () {
        s.now = function () {
          return new Date('Mon Nov 24 2014 08:01:00 GMT-0500 (EST)');
        };
        s.update();
        assert(s.dataSrc[0].nextShuttle === '14 Minutes');
        assert(s.dataSrc[1].nextShuttle === '29 Minutes');
      });
    });
  });

  describe('listTimes method', function () {
    it('should return the correct html', function () {
      var html = s.listTimes(0);
      assert.isString(html);
      //TODO: Data from other stops is funky
      //assert.include(html, '12:30&nbsp;am, 12:45&nbsp;am, 12:00&nbsp;am');
      assert.include(html, '6:45&nbsp;am, 7:00&nbsp;am, 7:15&nbsp;am, 7:30&nbsp;am, 7:45&nbsp;am, 12:00&nbsp;am, 12:15&nbsp;am, 12:30&nbsp;am, 12:45&nbsp;am, 12:00&nbsp;am, 12:15&nbsp;am, 12:30&nbsp;am, 12:45&nbsp;am, 10:00&nbsp;am, 10:30&nbsp;am, 11:00&nbsp;am, 11:30&nbsp;am, 12:00&nbsp;pm, 12:30&nbsp;pm, 1:00&nbsp;pm, 1:30&nbsp;pm, 2:00&nbsp;pm, 2:30&nbsp;pm, 3:00&nbsp;pm, 3:30&nbsp;pm, 4:00&nbsp;pm, 4:15&nbsp;pm, 4:30&nbsp;pm, 4:45&nbsp;pm, 5:00&nbsp;pm, 5:15&nbsp;pm, 5:30&nbsp;pm, 5:45&nbsp;pm, 6:00&nbsp;pm, 6:30&nbsp;pm');
    });
  });

  /* TODO: Get mocha-casperjs working : why can't it find casper?
  describe('DOM Tests', function () {
    before(function () {
      casper.start('http://localhost:9001');
    });

    it('should have the correct page title', function () {
      casper.then(function() {
        'Shuttle'.should.matchTitle
      });
    });
  });
*/
})();
