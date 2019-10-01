import {get} from './src/read';
import { exec } from 'child_process';
import decode from 'unescape';
import fs from 'fs';

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const [id, dest = '.'] = process.argv.slice(2);
function IO (f) {
  this.value = f;
}
IO.prototype.map = function(f) {
  f(this.value);
  return new IO(this.value);
};

const clean = str => str.split('-').slice(0, -1).join('-');
const title = html => html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
const getTitle = async id => {
  const html = await get(`https://www.youtube.com/watch?v=${id}`);
  return compose(decode, clean, title)(html);
}
const move = file => f => fs.rename(`./${file}`, `${dest}/${file}`, f);

const init = async id => {
  const data = f => _exec => _exec.stdout.on('data', f);
  const close = f => _exec => _exec.on('close', () => move(`${title}[${id}].mp3`)(f))
  const title = await getTitle(id);
  const yParams = ['--extract-audio --audio-format', 'mp3',
  '--audio-quality', '190K',
  '--output', `"${title}[%(id)s].%(ext)s"`,
  '--add-metadata --metadata-from-title', `"%(artist)s - %(title)s %(track)s" ${id}`]
  const q = `youtube-dl ${yParams.join(' ')}`;
  const io_exec = new IO(exec(q));
  
  io_exec.map(data(x => console.log(x)))
    .map(close(() => console.log('Saved file into destination')));
}

init(id);