function EventSaga(emitter, options){
  var store = Object.create(null);
  function getRealm(id){
    var done = false;
    return {
      id: id,
      data: store[id],
      done: function(){
        delete store[id];
        done = true;
      },
      isDone: function(){
        return done;
      }
    };
  }

  this.on = function(event, reaction){
    emitter.on(event, function(data){
      if(data && 'id' in data && store[data.id]){
        var realm = getRealm(data.id);
        reaction.call(realm, data);
        if(!realm.isDone()){
          store[data.id] = realm.data;
        }
      }
    });
  };

  this.createOn = function(event, reaction){
    emitter.on(event, function(data){
      if(data && 'id' in data){
        store[data.id] = {};
      }
      var realm = getRealm(data.id);
      reaction.call(realm, data);
      if(!realm.isDone()){
        store[data.id] = realm.data;
      }
    });
  };
};

module.exports = EventSaga;