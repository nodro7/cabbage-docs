# Cabbage forum theme

A Discourse theme that makes forum.cabbageaudio.com match cabbageaudio.com: the same logo, the same two colour palettes, the same type and the same top-level links. It changes how the forum looks. It does not touch categories, permissions or plugins.

## Status

Written for Discourse 2026.01.0, the version the forum runs. It has not yet been installed on a Discourse, so preview it before making it the default (see "Check before going live").

What was checked without installing it:

- The stylesheets compile against the Discourse source at the forum's version, for both palettes.
- The compiled styles were applied to the live forum's pages in a browser, without changing the forum, at desktop and phone widths. On the topic list and on a topic page, every piece of text met 4.5:1 in both palettes.
- Every text colour meets 4.5:1 on every ground it can sit on, in both palettes. Discourse derives its greys from the palette, and several of them fall short for small text, so the palettes set those shades themselves. `npm run forum-theme` repeats this check.
- The two small script files compile with the same steps Discourse uses for themes. They have not run inside Discourse, so the header logo and the footer line are the two things to look at first.

## What is in the folder

| File | What it does |
|---|---|
| `about.json` | The theme's name, the fonts and logo it ships, and the two palettes: Cabbage Dark and Cabbage Light. |
| `settings.yml` | The site addresses used in the footer line. They can be changed in the admin. |
| `common/color_definitions.scss` | The few colours the palettes cannot hold: borders, the focus ring and the green button. |
| `common/common.scss` | Fonts, header, buttons, code blocks, focus rings and the footer line. |
| `javascripts/.../cabbage-logo.gjs` | The header logo: the mark, "Cabbage" and "Forum". |
| `javascripts/.../cabbage-footer.gjs` | The footer line. |
| `assets/` | The two fonts with their licences, and the mark. |

## Install

1. Make the zip. From the repository root:

   ```bash
   npm run forum-theme
   ```

   This writes `forum-theme.zip`. Zipping the folder by hand works too.

2. In the forum admin, open Appearance, then Themes and components. Choose Install, then From your device, and upload the zip.

3. Add the header links (next section).

4. Choose the palettes (the section after that).

5. Use Preview on the theme's page to look at it without changing anything for visitors. When it is right, choose Set as default.

The current theme, Cabbage-Header, holds the blue bar with the "Back to Cabbage Site" link. That bar goes away when this theme becomes the default. Do not add Cabbage-Header to this theme as a component.

## Header links

The Docs, Learn and Install links come from the official Custom Header Links component.

1. In Themes and components, choose Install, then From a git repository, and enter:

   ```text
   https://github.com/discourse/discourse-custom-header-links
   ```

2. On the Cabbage theme's page, add Custom Header Links under Included components.

3. Open the component's settings. Set Links position to `right`, and add three links, in this order:

   | Text | Title | URL | View | Target | Hide on scroll |
   |---|---|---|---|---|---|
   | `Docs` | `Cabbage 3 documentation` | `https://cabbageaudio.com/docs/` | `vdo` | `self` | `remove` |
   | `Learn` | `Video lessons` | `https://cabbageaudio.com/learn/` | `vdo` | `self` | `remove` |
   | `Install` | `Install Cabbage 3` | `https://cabbageaudio.com/install/` | `vdo` | `self` | `remove` |

   Leave Locale empty.

What the values mean:

- The text of the last link must be exactly `Install`. The component gives each link a class made from its text, and the theme uses that class to draw Install as the green button.
- `vdo` shows the links on desktop only. A phone header has no room for them.
- `self` opens the link in the same tab.
- `remove` hides the links while a topic title is showing in the header.

### On phones

To put the same three links in the menu that opens from the header on a phone, add them to the sidebar. In the sidebar, choose Add custom section and give it the title `Cabbage`. Add Docs, Learn and Install with the addresses above, pick an icon for each, and tick Visible to everyone. The section then shows in the sidebar on desktop and in the menu on phones.

## Palettes

The theme brings two palettes. After the install it uses Cabbage Dark for everyone.

To follow each visitor's system setting, as the site does, open the theme's page and set:

| Setting | Value |
|---|---|
| Color Palette | Cabbage Light |
| Dark Color Palette | Cabbage Dark |

Visitors whose system is set to dark then get Cabbage Dark, and everyone else gets Cabbage Light.

To let members choose for themselves, tick "Color palette can be selected by users" on both palettes under Appearance, then Color palettes. The site setting `interface color selector` adds a light and dark switch to the sidebar or the header.

The theme also carries two settings over from the current theme, so nothing changes by surprise: the welcome banner stays off and search stays an icon in the header.

## The logo

The theme draws the header logo itself: the mark, the word "Cabbage" and the word "Forum". The logo images under Appearance, then Site logo, are no longer shown in the header. They are still used in emails, on the login page and for link previews, so replace them there when convenient.

## Changing things later

- **A site address in the footer line:** the theme's settings in the admin.
- **A header link:** the Custom Header Links settings.
- **A colour:** `about.json` for the palettes, `common/color_definitions.scss` for borders, focus and the green button. Run `npm run forum-theme` afterwards: it checks the contrast of every text colour again and stops if one falls below 4.5:1.
- **Fonts:** `npm run forum-theme` copies them from the same packages the site uses, so the two stay on the same version.

### Updating the theme on the forum

Discourse cannot update an uploaded theme in place: every upload makes a new theme. So after a change:

1. Upload the new zip. A second theme called Cabbage appears.
2. On its page, add Custom Header Links under Included components and choose the palettes again. The header links themselves are kept, because they belong to the component.
3. Preview it, set it as default, then delete the old copy.

Discourse can update a theme in place when it was installed from a Git repository that has the theme at its top level. If updates become frequent, a branch made with `git subtree split --prefix forum-theme` is such a repository, and the theme's page then offers Check for updates.

## Check before going live

Use Preview, in both palettes, at desktop and phone widths.

- Header: mark, "Cabbage", "Forum"; then Docs, Learn and the green Install button on desktop. Sign Up and Log In are quiet buttons, so Install is the only green one. On a narrow phone the header shows the mark and "Forum".
- Open a topic and scroll: the topic title takes over the header and only the mark stays.
- Headings and body text are in Instrument Sans, and topic titles are condensed. Code is in JetBrains Mono on the dark or pale grey ground, with a border.
- Buttons: Reply and New Topic are green with dark text. Other buttons are quiet, with a border.
- Tab through a page: the focus ring is white on dark and near-black on light, and nothing hides it.
- The bottom of a topic list shows the footer line with five links and the vegetables line.
- No error banner about the theme appears for admins. If one does, the two script files are the place to look.

## Not covered

- Category structure, permissions, plugins and email templates.
- The chat and AI plugins get the palette and fonts, with no styling of their own.
- The staff review queue keeps two of Discourse's own greys, which it uses both as text and as the ground of small labels. Some of its small print is below 4.5:1, as it is in Discourse's own themes.
