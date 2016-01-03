import expect from 'expect.js';
import sinon from 'sinon';
import {Jar} from 'descartes';
import {EventEmitter} from 'events';
import EventSaga from '../src/index';

describe('EventSaga', function(){
  it("should work", async function(){
    const emitter = new EventEmitter();
    const saga = new EventSaga(emitter);
    const jar = new Jar();
    const createSpy = jar.sensor('create');
    const somethingSpy = jar.sensor('something');

    saga.createOn('create', createSpy);
    saga.on('something', somethingSpy);

    emitter.emit('something', {id:1});
    //nothing happens here

    emitter.emit('create', {id: 1});
    await createSpy.called();

    emitter.emit('something', {id: 1});
    await somethingSpy.called();

    jar.done();
  });
});