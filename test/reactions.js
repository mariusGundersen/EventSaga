import expect from 'expect.js';
import sinon from 'sinon';
import {Jar} from 'descartes';
import {EventEmitter} from 'events';
import EventSaga from '../src/index';

describe('EventSaga', function(){
  it("should work", async function(){
    const jar = new Jar();
    const createSpy = jar.sensor('create');
    const somethingSpy = jar.sensor('something');

    const emitter = new EventEmitter();
    const saga = new EventSaga(emitter, saga => {
      saga.createOn('create', createSpy);
      saga.on('something', somethingSpy);
      saga.on('trigger', (data, actor) => {
        actor.emit('something', {id: actor.id});
      });
    });

    emitter.emit('something', {id:1});
    //nothing happens here

    emitter.emit('create', {id: 1});
    await createSpy.called();

    emitter.emit('something', {id: 1});
    await somethingSpy.called();

    emitter.emit('trigger', {id: 1});
    await somethingSpy.called();

    jar.done();
  });
});