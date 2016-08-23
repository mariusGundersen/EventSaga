import expect from 'expect.js';
import sinon from 'sinon';
import {EventEmitter} from 'events';
import EventSaga from '../src/index';

describe('EventSaga', function(){
  describe('constructor', function(){
    it('should return a new EventSaga', function(){
      expect(new EventSaga(new EventEmitter(), () => {})).to.be.ok();
      expect(new EventSaga(new EventEmitter(), () => {})).to.be.an(EventSaga);
    });

    it('should take two arguments', function(){
      expect(EventSaga.length).to.be(2);
    });

    it('should throw if no arguments are passed', function(){
      expect(() => new EventSaga()).to.throwError();
    });

    it('should throw if the first argument is null', function(){
      expect(() => new EventSaga(null, () => {})).to.throwError();
    });

    it('should throw if the first argument is not an object', function(){
      expect(() => new EventSaga(15, () => {})).to.throwError();
    });

    it('should throw if the event emitter does not have an emit function', function(){
      expect(() => new EventSaga({on: () => {}}, () => {})).to.throwError();
    });

    it('should throw if the event emitter does not have an on function', function(){
      expect(() => new EventSaga({emit: () => {}}, () => {})).to.throwError();
    });

    it('should throw if the second argument is missing', function(){
      expect(() => new EventSaga(new EventEmitter())).to.throwError();
    });

    it('should throw if the second argument is not a function', function(){
      expect(() => new EventSaga(mockEventEmitter(), 'hello')).to.throwError();
    });
  });

  describe('instance methods', function(){
    var saga;
    beforeEach(function(){
      saga = new EventSaga(new EventEmitter(), () => {});
    });

    it('should not have an on method', function(){
      expect(saga.on).not.to.be.a(Function);
    });

    it('should not have a createOn method', function(){
      expect(saga.createOn).not.to.be.a(Function);
    });
  });

  describe('revealed methods', function(){
    var saga;
    beforeEach(function(){
      new EventSaga(new EventEmitter(), s => saga = s);
    });

    it('should not have an on method', function(){
      expect(saga.on).to.be.a(Function);
      expect(saga.on.length).to.be(2);
    });

    it('should not have a createOn method', function(){
      expect(saga.createOn).to.be.a(Function);
      expect(saga.createOn.length).to.be(2);
    });
  });

  describe('reaction instance', function(){
    var emitter,
        saga;
    beforeEach(function(){
      emitter = new EventEmitter();
      new EventSaga(emitter, s => saga = s);
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
