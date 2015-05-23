var expect = require('expect.js');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var EventSaga = require('../index');

describe('EventSaga', function(){
  describe('lifecycle', function(){
    var emitter,
        saga,
        spy;
    
    beforeEach(function(){
      emitter = new EventEmitter();
      saga = new EventSaga(emitter);
    });
    
    describe('simple create', function(){
      beforeEach(function(){
        spy = sinon.spy();
        saga.createOn('create', function(data){
          this.data.name = data.name;
        });
        saga.on('something', function(data){
          spy(this.data.name)
        });

        because: {
          emitter.emit('create', {id:1, name:'test'});
          emitter.emit('something', {id:1});
        }
      });
      
      it('should get the same data object the second time', function(){
        sinon.assert.calledWith(spy, 'test');
      });
    });
    
    describe('separate sagas', function(){
      beforeEach(function(){
        spy = sinon.spy();
        saga.createOn('create', function(data){
          this.data.name = data.name;
        });
        saga.on('something', function(data){
          spy(this.data.name)
        });

        because: {
          emitter.emit('create', {id:1, name:'test'});
          emitter.emit('create', {id:2, name:'whut'});
          emitter.emit('something', {id:1});
        }
      });
      
      it('should get the same data object the second time with the same id', function(){
        sinon.assert.calledWith(spy, 'test');
      });
      
      it('should get the same data object the second time with the same id', function(){
        emitter.emit('something', {id: 2});
        sinon.assert.calledWith(spy, 'whut');
      });
    });
    
    describe('complete a saga', function(){
      beforeEach(function(){
        spy = sinon.spy();
        saga.createOn('create', function(data){
          this.data.name = data.name;
        });
        saga.on('something', function(data){
          spy(this.data.name)
        });
        saga.on('done', function(data){
          this.done();
        });

        because: {
          emitter.emit('create', {id:1, name:'test'});
          emitter.emit('something', {id:1});
          emitter.emit('done', {id:1});
          emitter.emit('something', {id:1});
        }
      });
      
      it('should not react when the saga is completed', function(){
        sinon.assert.calledOnce(spy);
      });
    });
  });
});