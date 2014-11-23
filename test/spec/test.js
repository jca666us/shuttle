/* global describe, it, s, assert, beforeEach, afterEach */

(function () {
  'use strict';

  //s.now
  describe('now function', function () {
    it('should return a date object', function () {
      var d = s.now();
      assert(typeof(d) === 'object');
      assert(d.getDay() < 7 && d.getDay() > -1);
    });
  });

  //s.miliraryTime
  describe('militaryTime function', function () {
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
  describe('addLeadingZeros function', function () {
    it('should add leading zeros to single digit numbers', function () {
      assert(s.addLeadingZeros(0) === '00');
      assert(s.addLeadingZeros(9) === '09');
    });
    it('should not add leading zeros to multi digit numbers', function () {
      assert(s.addLeadingZeros(10) === '10');
      assert(s.addLeadingZeros(59) === '59');
    });
  });

  describe('pluralize function', function () {
    it('should pluralize', function () {
      assert(s.pluralize(2, 'hour') === '2 hours');
    });
    it('should not pluralize', function () {
      assert(s.pluralize(1, 'hour') === '1 hour');
    });
  });

  describe('noServiceToday function', function () {
    
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
})();
