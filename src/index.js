function EventSaga(emitter, options){
  const store = new Map();
  let queue = Promise.resolve();
  async function react(id, reaction, data){
    let done = false;
    const realm = {
      id: id,
      data: await Promise.resolve(store.get(id)),
      done: () => done = true
    };
    await Promise.resolve(reaction.call(realm, data));
    if(done){
      await Promise.resolve(store.delete(id));
    }else{
      await Promise.resolve(store.set(data.id, realm.data));
    }
  }

  function enqueue(handle){
    return data => {
      if(!data || typeof(data) !== 'object' || !('id' in data)) return;

      queue = queue.then(() => handle(data));
    };
  }

  this.on = function(event, reaction){
    emitter.on(event, enqueue(data => {
      if(store.has(data.id)){
        return react(data.id, reaction, data);
      }
    }));
  };

  this.createOn = function(event, reaction){
    emitter.on(event, enqueue(data => {
      if(!store.has(data.id)){
        store.set(data.id, {});
      }
      return react(data.id, reaction, data);
    }));
  };
};

module.exports = EventSaga;