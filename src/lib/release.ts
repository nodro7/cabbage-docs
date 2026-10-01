// The latest vscabbage release, looked up once per build.
//
// The site is static: this runs when the site is built, not in the visitor's
// browser. The daily rebuild and manual dispatch keep it fresh. If GitHub
// cannot be reached, the build still succeeds with the last known release
// from src/data/release-fallback.json, and the download buttons point at
// the releases page instead of a file.

import fallback from '../data/release-fallback.json';
import { site } from '../data/site';

export type Os = 'macos' | 'windows' | 'linux';

export type ReleaseAsset = {
	url: string;
	name: string;
	/** Size in bytes. */
	size: number;
};

export type Release = {
	/** The release tag, for example "1.0.209-alpha". */
	version: string;
	/** ISO date the release was published. */
	date: string;
	/** The release page on GitHub. */
	url: string;
	assets: Record<Os, ReleaseAsset | null>;
	/** "fallback" means GitHub could not be reached during this build. */
	source: 'github' | 'fallback';
};

const API_URL = 'https://api.github.com/repos/rorywalsh/vscabbage/releases?per_page=10';

// TODO(G): asset names are matched as vscabbage-<version>-<os>.vsix, which is
// how the alpha releases are named. Confirm the naming for stable releases.
const ASSET_PATTERN = /-(windows|macos|linux)\.vsix$/i;

type GitHubAsset = { name: string; size: number; browser_download_url: string };
type GitHubRelease = {
	tag_name: string;
	html_url: string;
	published_at: string | null;
	prerelease: boolean;
	draft: boolean;
	assets: GitHubAsset[];
};

function assetsByOs(release: GitHubRelease): Record<Os, ReleaseAsset | null> {
	const assets: Record<Os, ReleaseAsset | null> = { macos: null, windows: null, linux: null };
	for (const asset of release.assets) {
		const match = ASSET_PATTERN.exec(asset.name);
		if (!match) continue;
		const os = match[1].toLowerCase() as Os;
		assets[os] ??= { url: asset.browser_download_url, name: asset.name, size: asset.size };
	}
	return assets;
}

const hasDownloads = (release: GitHubRelease) => release.assets.some((asset) => ASSET_PATTERN.test(asset.name));

/** The newest stable release with downloads, or failing that the newest prerelease. */
function pick(releases: GitHubRelease[]): GitHubRelease | undefined {
	const published = releases.filter((release) => !release.draft && hasDownloads(release));
	return published.find((release) => !release.prerelease) ?? published[0];
}

function fromFallback(): Release {
	return { ...(fallback as Omit<Release, 'source'>), source: 'fallback' };
}

async function load(): Promise<Release> {
	// Set CABBAGE_RELEASE_OFFLINE=1 to build as if GitHub could not be reached.
	if (process.env.CABBAGE_RELEASE_OFFLINE) return fromFallback();

	try {
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github+json',
			'User-Agent': 'cabbageaudio.com site build',
		};
		// Unauthenticated requests are limited to 60 an hour per IP address.
		if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

		const response = await fetch(API_URL, { headers, signal: AbortSignal.timeout(8000) });
		if (!response.ok) throw new Error(`GitHub answered ${response.status}`);

		const release = pick((await response.json()) as GitHubRelease[]);
		if (!release) throw new Error('no release with downloads was found');

		return {
			version: release.tag_name,
			date: release.published_at ?? '',
			url: release.html_url,
			assets: assetsByOs(release),
			source: 'github',
		};
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		console.warn(`[release] Using the fallback release: ${reason}. See ${site.releasesUrl}`);
		return fromFallback();
	}
}

let cached: Promise<Release> | undefined;

/** The latest release. The lookup happens once, however many pages ask. */
export function getRelease(): Promise<Release> {
	cached ??= load();
	return cached;
}

/** "28 September 2026" */
export function formatDate(iso: string): string {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
		date
	);
}

/** "19.8 MB" */
export function formatSize(bytes: number): string {
	if (!bytes || bytes <= 0) return '';
	const megabytes = bytes / 1_000_000;
	return megabytes >= 1 ? `${megabytes.toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}
