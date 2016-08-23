import expect from 'expect.js';
import sinon from 'sinon';
import {Jar} from 'descartes';
import {EventEmitter} from 'events';
import EventSaga from '../src/index';

describe('Timeouts', function(){
  it("should work", async function(){
    const jar = new Jar();
    const somethingSpy = jar.sensor('something');

    const emitter = new EventEmitter();
    const saga = new EventSaga(emitter, saga => {
      saga.createOn('create', function() {
        this.setTimeout('something', {}, 10);
      });

      saga.on('something', somethingSpy);
    });

    emitter.emit('create', {id: 1});

    await somethingSpy.called();

    jar.done();
  });
});


describe('Timeouts clear on done', function(){
  it("should work", async function(){
    const jar = new Jar();
    const somethingSpy = jar.sensor('something');

    const emitter = new EventEmitter();
    const saga = new EventSaga(emitter, saga => {
      saga.createOn('create', function() {
        this.setTimeout('something', 100);
        this.done();
      });

      saga.on('something', somethingSpy);
    });

    emitter.emit('create', {id: 1});

    jar.done();
  });
});

describe('Timeouts cleared', function(){
  it("should work", async function(){
    const jar = new Jar();
    const somethingSpy = jar.sensor('something');

    const emitter = new EventEmitter();
    const saga = new EventSaga(emitter, saga => {
      saga.createOn('create', function() {
        this.setTimeout('something', {}, 100);
        this.clearTimeout('something');
      });

      saga.on('something', somethingSpy);
    });

    emitter.emit('create', {id: 1});

    //not called! await somethingSpy.called();

    jar.done();
  });
});