function EventSaga(emitter, options){
  this.emitter = emitter;
  this.store = Object.create(null);
};

EventSaga.prototype.on = function(event, reaction){
  this.emitter.on(event, function(data){
    if(data && this.store[data.id]){
      reaction(data);
    }
  }.bind(this));
};

EventSaga.prototype.createOn = function(event, reaction){
  this.emitter.on(event, function(data){
    if(data && 'id' in data){
      this.store[data.id] = {};
    }
    reaction(data);
  }.bind(this));
};

module.exports = EventSaga;