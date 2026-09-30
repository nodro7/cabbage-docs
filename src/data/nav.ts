// One source for every navigation link. The site header, the docs header,
// the docs mobile menu and both footers all read from here, so they can
// never drift apart.

import { site } from './site';

export type NavItem = {
  label: string;
  href: string;
  /** Leaves the site. */
  external?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// Targets point at the routes that exist today. They move to /docs/, /learn/
// and /install/ as those pages land.
const docs: NavItem = { label: 'Docs', href: '/docs/intro/' };
const learn: NavItem = { label: 'Learn', href: '/videos/' };
const forum: NavItem = { label: 'Forum', href: site.forumUrl, external: true };
const github: NavItem = { label: 'GitHub', href: site.githubUrl, external: true };

/** The one primary action on every page. */
export const install: NavItem = { label: 'Install', href: '/download/' };

/** Header links, in order. */
export const primary: NavItem[] = [docs, learn, forum, github];

/** Footer columns, in order. */
export const footer: NavGroup[] = [
  {
    label: 'Get started',
    items: [install, docs, learn, { label: 'FAQs', href: '/docs/faqs/' }],
  },
  {
    label: 'Community',
    items: [forum, github, { label: 'YouTube', href: site.playlistUrl, external: true }],
  },
  {
    label: 'Older versions',
    items: [{ label: 'Cabbage 2', href: site.v2Url, external: true }],
  },
];

/** Which section of the site a path belongs to, for aria-current. */
export function isCurrent(item: NavItem, pathname: string): boolean {
  if (item.external) return false;
  if (item === docs) return pathname.startsWith('/docs/');
  return pathname === item.href || pathname.startsWith(item.href);
}
