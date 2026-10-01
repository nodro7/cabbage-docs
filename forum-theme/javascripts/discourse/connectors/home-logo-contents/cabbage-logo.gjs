// The header logo: the Cabbage mark, the wordmark and the word "Forum".
// It replaces the logo images from the site settings.
//
// When a topic title takes over the header, Discourse passes
// minimized=true and only the mark stays visible. The words stay in the
// page for screen readers, so the link always has a name.

const CabbageLogo = <template>
  <img
    class="cabbage-logo__mark"
    src={{settings.theme_uploads.cabbage_mark}}
    width="36"
    height="34"
    alt=""
  />
  <span class="cabbage-logo__name">Cabbage</span>
  <span class="cabbage-logo__section">Forum</span>
</template>;

export default CabbageLogo;
