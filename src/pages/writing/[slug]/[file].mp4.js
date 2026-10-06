// A post's videos, published beside it: src/content/writing/<post>/<clip>.mp4
// is served as /writing/<post>/<clip>.mp4 (pictures go through Astro's image
// pipeline instead; see src/markdown.js for how a post names a video).
import { glob, readFile } from 'node:fs/promises';

const DIR = 'src/content/writing';

export async function getStaticPaths() {
  const clips = await Array.fromAsync(glob('*/*.mp4', { cwd: DIR }));
  return clips.map(clip => {
    const [slug, name] = clip.split('/');
    return { params: { slug, file: name.slice(0, -'.mp4'.length) } };
  });
}

export async function GET({ params }) {
  const clip = await readFile(`${DIR}/${params.slug}/${params.file}.mp4`);
  return new Response(clip, { headers: { 'Content-Type': 'video/mp4' } });
}
