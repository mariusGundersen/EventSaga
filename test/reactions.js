var expect = require('expect.js');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var EventSaga = require('../index');

describe('EventSaga', function(){
  describe('reactions', function(){
    var emitter,
        saga,
        spy;
    
    beforeEach(function(){
      emitter = new EventEmitter();
      saga = new EventSaga(emitter);
    });
    
    describe('before creation', function(){
      beforeEach(function(){
        spy = sinon.spy();
        saga.on('something', spy);

        because: {
          emitter.emit('something', {id:1});
        }
      });
      
      it('should not react when an event is emitted before it has been created', function(){
        sinon.assert.notCalled(spy);
      });
    });
    
    describe('on creation', function(){
      var data = {id: 1};
      
      beforeEach(function(){
        spy = sinon.spy();
        saga.createOn('create', spy);

        because: {
          emitter.emit('create', data);
        }
      });
      
      it('should react when an event is emitted', function(){
        sinon.assert.calledWith(spy, data);
      });
      
      describe('after creation', function(){
        var dat = {id: 1};
        
        beforeEach(function(){
          spy = sinon.spy();
          saga.on('something', spy);

          because: {
            emitter.emit('something', data);
          }
        });

        it('should react when an event is emitted after it has been created', function(){
          sinon.assert.calledWith(spy, data);
        });
      });
    });
  });
});