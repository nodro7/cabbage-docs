// Facts and lines of copy that appear in more than one place.

import { playlistUrl } from './videos';

export const site = {
  name: 'Cabbage',
  tagline: 'A framework for audio software development.',
  // TODO(G): MIT is used for now; confirm the licence with Rory before launch.
  licence: 'MIT',
  vegetablesLine: 'No vegetables were harmed in the making of this software.',
  forumUrl: 'https://forum.cabbageaudio.com/',
  githubUrl: 'https://github.com/rorywalsh/vscabbage',
  releasesUrl: 'https://github.com/rorywalsh/vscabbage/releases',
  playlistUrl,
  v2Url: 'https://v2.cabbageaudio.com/',
} as const;

export const licenceLine = `Cabbage 3 is open source, released under the ${site.licence} licence.`;
