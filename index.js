function EventSaga(emitter, options){
  var store = Object.create(null);
  function getRealm(id){
    return{
      data: store[id],
      done: function(){
        delete store[id];
      }
    }
  }

  this.on = function(event, reaction){
    emitter.on(event, function(data){
      if(data && 'id' in data && store[data.id]){
        reaction.call(getRealm(data.id), data);
      }
    });
  };

  this.createOn = function(event, reaction){
    emitter.on(event, function(data){
      if(data && 'id' in data){
        store[data.id] = {};
      }
      reaction.call(getRealm(data.id), data);
    });
  };
};

module.exports = EventSaga;