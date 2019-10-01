import {get} from './src/read';
import { exec } from 'child_process';
import decode from 'unescape';
import fs from 'fs';

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const [id, dest = '.'] = process.argv.slice(2);
var Left = function(x) {
  this.__value = x;
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f) {
  console.log('llll', this)
  return this;
};

var Right = function(x) {
  this.__value = x;
};

Right.of = function(x) {
  return new Right(x);
};

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
function Maybe (x) {
  this.__value = x;
}
Maybe.of = function(x) {
  return new Maybe(x);
};
Maybe.prototype.isNothing = function() {
  
  return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

function IO (f) {
  this.value = f;
}
IO.prototype.map = function(f) {
  f(this.value);
  return new IO(this.value);
};

const getTitle = async id => {
  const clean = str => str.split('-').slice(0, -1).join('-');
  const title = html => html.match(/<title[^>]*>([^<]+)<\/title>/);
  const prop = key => obj => obj[key];
  const url = Maybe.of(id).map(x => `https://www.youtube.com/watch?v=${x}`);
  const html = url.isNothing()
    ? Left.of('')
    : Right.of(await get(url.__value));
  return prop('__value')(html.map(title).map(prop(1)).map(clean).map(decode));
}
const move = file => f => fs.rename(`./${file}`, `${dest}/${file}`, f);

const init = async id => {
  const data = f => _exec => _exec.stdout.on('data', f);
  const close = f => _exec => _exec.on('close', () => move(`${title}[${id}].mp3`)(f))
  const title = await getTitle(id);
  console.log(title);
  const yParams = ['--extract-audio --audio-format', 'mp3',
  '--audio-quality', '190K',
  '--output', `"${title}[%(id)s].%(ext)s"`,
  '--add-metadata --metadata-from-title', `"%(artist)s - %(title)s %(track)s" ${id}`]
  const q = `youtube-dl ${yParams.join(' ')}`;
  const io_exec = new IO(exec(q));
  
  io_exec.map(data(x => console.log(x)))
    .map(close(e => console.log(`Saved file into destination ${e}`)));
    
}

init(id);