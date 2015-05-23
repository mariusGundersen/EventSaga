var expect = require('expect.js');
var EventSaga = require('../index');

describe('EventSaga', function(){
  describe('constructor', function(){
    it('should return a new EventSaga', function(){
      expect(new EventSaga()).to.be.ok();
    });
    
    it('should take two arguments', function(){
      expect(EventSaga.length).to.be(2);
    });
  });
});