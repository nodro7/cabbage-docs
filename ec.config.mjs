// Expressive Code options: one code block setup for the docs and the
// marketing pages. They live in this file, not in astro.config.mjs, because
// the <Code> component needs to load them on its own.
//
// Token colours come from the --cb-code-* tokens (see src/syntax/theme.mjs).
// Frame colours are CSS variables, so they follow the theme on their own.
import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import csoundGrammar from './src/syntax/csound-grammar.mjs';
import jsonGrammar from './src/syntax/json-grammar.mjs';
import { cbDark, cbLight } from './src/syntax/theme.mjs';

/**
 * Lets every code block take keyboard focus, so a block that scrolls sideways
 * can be scrolled without a mouse, with or without JavaScript.
 *
 * Expressive Code's own script then removes the focus stop from blocks that
 * do not scroll. Left to itself, that script would instead mark each
 * scrolling block as a region with no name; several of those on one page are
 * landmarks that screen reader users cannot tell apart. A block that can
 * already take focus is left alone.
 */
const focusableCode = {
	name: 'cabbage-focusable-code',
	hooks: {
		postprocessRenderedBlock: ({ renderData }) => {
			const visit = (node) => {
				if (node.type === 'element' && node.tagName === 'pre') {
					node.properties.tabindex = '0';
					return true;
				}
				return node.children?.some(visit) ?? false;
			};
			visit(renderData.blockAst);
		},
	},
};

export default defineEcConfig({
	themes: [cbDark, cbLight],
	// The lenient JSON grammar replaces the bundled one (see json-grammar.mjs).
	shiki: { langs: [csoundGrammar, jsonGrammar] },
	// The token colours are already checked for AA contrast in tokens.css,
	// so they are used exactly as given.
	minSyntaxHighlightingColorContrast: 0,
	plugins: [pluginLineNumbers(), focusableCode],
	defaultProps: { showLineNumbers: false },
	styleOverrides: {
		borderRadius: '12px',
		borderWidth: '1px',
		borderColor: 'var(--cb-line)',
		codeBackground: 'var(--cb-bg)',
		codeForeground: 'var(--cb-fg)',
		codeFontFamily: 'var(--cb-font-mono)',
		codeFontSize: 'var(--cb-text-code)',
		codeLineHeight: '1.6923', // 22px at 13px
		codePaddingBlock: '14px',
		codePaddingInline: '20px',
		gutterBorderColor: 'transparent',
		gutterForeground: 'var(--cb-faint)',
		uiFontFamily: 'var(--cb-font-mono)',
		uiFontSize: 'var(--cb-text-code-label)',
		uiLineHeight: '1.44',
		uiPaddingBlock: '8.5px',
		uiPaddingInline: '16px',
		focusBorder: 'var(--cb-focus)',
		scrollbarThumbColor: 'var(--cb-line)',
		scrollbarThumbHoverColor: 'var(--cb-faint)',
		frames: {
			frameBoxShadowCssValue: 'none',
			editorBackground: 'var(--cb-bg)',
			editorTabBarBackground: 'var(--cb-chrome)',
			editorTabBarBorderColor: 'var(--cb-line)',
			editorTabBarBorderBottomColor: 'var(--cb-line)',
			editorTabsMarginInlineStart: '0',
			editorTabsMarginBlockStart: '0',
			editorTabBorderRadius: '0',
			editorActiveTabBackground: 'transparent',
			editorActiveTabForeground: 'var(--cb-fg)',
			editorActiveTabBorderColor: 'transparent',
			editorActiveTabIndicatorTopColor: 'transparent',
			editorActiveTabIndicatorBottomColor: 'transparent',
			terminalBackground: 'var(--cb-bg)',
			terminalTitlebarBackground: 'var(--cb-chrome)',
			terminalTitlebarForeground: 'var(--cb-fg)',
			terminalTitlebarBorderBottomColor: 'var(--cb-line)',
			terminalTitlebarDotsForeground: 'var(--cb-faint)',
			inlineButtonBackground: 'var(--cb-raise)',
			inlineButtonBackgroundIdleOpacity: '1',
			inlineButtonBackgroundHoverOrFocusOpacity: '1',
			inlineButtonBackgroundActiveOpacity: '1',
			inlineButtonForeground: 'var(--cb-fg)',
			inlineButtonBorder: 'var(--cb-line)',
			inlineButtonBorderOpacity: '1',
			tooltipSuccessBackground: 'var(--cb-green)',
			tooltipSuccessForeground: 'var(--cb-green-ink)',
		},
	},
});
