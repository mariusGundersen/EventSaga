import expect from 'expect.js';
import sinon from 'sinon';
import {EventEmitter} from 'events';
import EventSaga from '../src/index';

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
      expect(saga.createOn.length).to.be(2);
    });
  });

  describe('reaction instance', function(){
    var emitter,
        saga;
    beforeEach(function(){
      emitter = new EventEmitter();
      saga = new EventSaga(emitter);
    });

    it('should have done', function(done){
      saga.createOn('event', function(){
        expect(this.done).to.be.a(Function);
        done();
      });
      emitter.emit('event', {id:0});
    });

    it('should have data', function(done){
      saga.createOn('event', function(){
        expect(this.data).to.be.an(Object);
        done();
      });
      emitter.emit('event', {id:0});
    });

    it('should have id', function(done){
      saga.createOn('event', function(){
        expect(this.id).to.be(0);
        done();
      });
      emitter.emit('event', {id:0});
    });
  });
});