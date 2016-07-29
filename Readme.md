# EventSaga

[![NPM](https://nodei.co/npm/event-saga.png)](https://nodei.co/npm/event-saga/)

Simple saga system listening to events from an EventEmitter

## Installation

```
npm install --save event-saga
```

## Usage

```js
// create a normal EventEmitter
var emitter = new EventEmitter();

// create the saga that listens to the EventEmitter
var saga = new EventSaga(emitter);

//Create a new saga whenever the 'logon' event is emitted
saga.createOn('logon', function(data){
  //a new saga has been made
  //the data has the data emitted by the EventEmitter
  //this.data is the saga storage
  this.data.shoppingCart = [];
  this.data.username = data.username;

  //call this event in 60 seconds
  this.setTimeout('emptyCart', 60*1000);
});

//Only handle this event if the saga exists (if logon has happened already)
saga.on('itemPlacedInShoppingCart', function(data){
  this.data.shoppingCart.push(data.item);

  //this replaces the previous timeout with the same name
  this.setTimeout('emptyCart', {}, 60*1000);
});

saga.on('emptyCart', function(data){
  //finalize the saga, clearing away all data and timeouts
  this.done();
})

saga.on('checkout', function(data){
  //trigger a side-effect
  buyItems(this.username, this.data.shoppingCart);
  //finalize the saga.
  this.done();
});
```

## API

### `new EventSaga(eventEmitter, [options])`

Creates a new saga that will react to events from the eventEmitter

### `saga.createOn(event, reaction)`

Listens to events from the event emitter, creates a new saga if one doesn't already exist for the id and reacts to the event.

The event data should have an `id` field that will be used to map the event to the correct saga instance.

If a saga instance doesn't exist for the given `id`, one will be created. It can be accessed using `this.data` inside the reaction.

```js
saga.createOn('start', function(data){
  this.data.value = data.value;
});

emitter.emit('start', {id:1, value:15});
emitter.emit('start', {id:2, value:-7});
```

### `saga.on(event, reaction)`

Listens to events from the event emitter and reacts to the event, but only if a saga instance with the id provided already exists.

The event data should have an `id` field that will be used to map the event to the correct saga instance.

The saga instance can be accessed using `this.data` inside the reaction.

```js
saga.on('change', function(data){
  this.data.value = data.value;
});

emitter.emit('change', {id:1, value:12});
emitter.emit('change', {id:2, value:-9});
emitter.emit('change', {id:3, value:0}); // nothing will happen, since there is no saga for id:3
```

### `this.data`

The saga instance object. Store data on this object. It can be anything.

### `this.id`

The saga id. Readonly

### `this.done()`

Destroys the saga instance object.

```js
saga.on('stop', function(data){
  console.log(this.data.value);
  this.done();
});

emitter.emit('start', {id:1, value:12});
emitter.emit('change', {id:1, value:-9});
emitter.emit('stop', {id:1}); // will console.log -9
emitter.emit('change', {id:1, value:0}); // nothing will happen, since there is no saga anymore for id:1
```

### `this.setTimeout(event, data, milliseconds)`

Schedules an event in the future. If a timeout with the same event name has
been scheduled already, it will be replaced.

### `this.clearTimeout(event)`

Unschedules an event scheduled using `this.setTimeout()`.

### `this.emit(event, data)`

Emits an event on the EventEmitter