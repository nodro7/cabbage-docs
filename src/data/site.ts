// Facts and lines of copy that appear in more than one place.

import { playlistUrl } from './videos';

export const site = {
  name: 'Cabbage',
  tagline: 'A framework for audio software development.',
  // Two licences: the VS Code extension, and the framework, which is the
  // backend inside every exported plugin.
  licences: { extension: 'MIT', framework: 'GPLv3' },
  vegetablesLine: 'No vegetables were harmed in the making of this software.',
  forumUrl: 'https://forum.cabbageaudio.com/',
  githubUrl: 'https://github.com/rorywalsh/vscabbage',
  releasesUrl: 'https://github.com/rorywalsh/vscabbage/releases',
  playlistUrl,
  v2Url: 'https://v2.cabbageaudio.com/',
} as const;

export const licenceLine = `Cabbage 3 is open source. The extension is ${site.licences.extension}, the framework is ${site.licences.framework}.`;
