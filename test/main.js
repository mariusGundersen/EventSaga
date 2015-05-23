var expect = require('expect.js');
var EventSaga = require('../index');

describe('EventSaga', function(){
  describe('constructor', function(){
    it('should return a new EventSaga', function(){
      expect(new EventSaga()).to.be.ok();
      expect(new EventSaga()).to.be.an(EventSaga);
    });
    
    it('should take two arguments', function(){
      expect(EventSaga.length).to.be(2);
    });
  });
  
  describe('instance methods', function(){
    var saga;
    beforeEach(function(){
      saga = new EventSaga();
    });
    
    it('should have an on method', function(){
      expect(saga.on).to.be.a(Function);
      expect(saga.on.length).to.be(2);
    });
    
    it('should have a createOn method', function(){
      expect(saga.createOn).to.be.a(Function);
      expect(saga.on.length).to.be(2);
    });
  });
});