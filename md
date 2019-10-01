
> wich-tag@1.0.0 save /home/vera/Documentos/wich-tag
> babel-node index.js "AeTYL_cKGyI" "./../cd-7"

f function (_exec) {
                return console.log(f, _exec) || _exec('data', f);
              } s function(ev, fn) {
  const res = Stream.prototype.on.call(this, ev, fn);
  const state = this._readableState;

  if (ev === 'data') {
    // Update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false)
      this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
}
IO { value: [Function] }

> wich-tag@1.0.0 save /home/vera/Documentos/wich-tag
> babel-node index.js "AeTYL_cKGyI" "./../cd-7"

