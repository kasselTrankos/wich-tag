import {get} from './src/read';
import { exec } from 'child_process';
import decode from 'unescape';

const [id] = process.argv.slice(2);
const clean = str => str.split('-').slice(0, -1).join('-');
const title = html => html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const getTitle = async id => {
  const html = await get(`https://www.youtube.com/watch?v=${id}`);
  return compose(decode, clean, title)(html);
}
const init = async id => {
  const t = await getTitle(id);
  const mm = exec(`youtube-dl --extract-audio --audio-format mp3 --audio-quality 190K --output "${t}[%(id)s].%(ext)s" --add-metadata --metadata-from-title "%(artist)s - %(title)s %(track)s" ${id}`)
  mm.stdout.on('data', function(data) {
    console.log(data); 
  });
}

init(id);