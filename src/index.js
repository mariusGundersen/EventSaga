export default class EventSaga{
  constructor(emitter, options){
    const dataStore = new Map();
    const timeoutStore = new Map();
    let queue = Promise.resolve();
    async function react(id, reaction, data){
      let done = false;
      const actor = {
        id: id,
        data: dataStore.get(id),
        emit: (event, data) => emitter.emit(event, data),
        done: () => done = true,
        setTimeout: (event, data, time=data) => doLater(id, event, data, time),
        clearTimeout: event => dontDoLater(id, event)
      };
      reaction.call(actor, data, actor);
      if(done){
        dataStore.delete(id);
        for(let timeout of timeoutStore.get(id).values()){
          clearTimeout(timeout);
        }
        timeoutStore.delete(id);
      }else{
        dataStore.set(data.id, actor.data);
      }
    }

    function enqueue(handle){
      return data => {
        if(!data || typeof(data) !== 'object' || !('id' in data)) return;

        queue = queue.then(() => handle(data));
      };
    }

    function doLater(id, event, data, time){
      const timeouts = timeoutStore.get(id);
      if(timeouts.has(event)){
        clearTimeout(timeouts.get(event));
      }

      timeouts.set(event, setTimeout(() => emitter.emit(event, Object.assign({id}, data)), time));
    }

    function dontDoLater(id, event){
      const timeouts = timeoutStore.get(id);
      if(timeouts.has(event)){
        clearTimeout(timeouts.get(event));
      }
    }

    this.on = function(event, reaction){
      emitter.on(event, enqueue(data => {
        if(dataStore.has(data.id)){
          return react(data.id, reaction, data);
        }
      }));
    };

    this.createOn = function(event, reaction){
      emitter.on(event, enqueue(data => {
        if(!dataStore.has(data.id)){
          dataStore.set(data.id, {});
        }
        if(!timeoutStore.has(data.id)){
          timeoutStore.set(data.id, new Map());
        }
        return react(data.id, reaction, data);
      }));
    };
  }
}