// The footer line: the site links and the closing line from
// cabbageaudio.com. The URLs are theme settings (see settings.yml).
//
// Discourse shows a footer only once the page has finished loading its
// list or topic, and says so with showFooter.

const CabbageFooter = <template>
  {{#if @outletArgs.showFooter}}
    <footer class="cabbage-footer">
      <div class="cabbage-footer__inner wrap">
        <nav class="cabbage-footer__links" aria-label="Cabbage">
          <a href={{settings.install_url}}>Install</a>
          <a href={{settings.docs_url}}>Docs</a>
          <a href={{settings.learn_url}}>Learn</a>
          <a href={{settings.cabbage2_url}}>Cabbage 2</a>
          <a href={{settings.github_url}}>GitHub</a>
        </nav>
        <p class="cabbage-footer__line">No vegetables were harmed in the making of
          this software.</p>
      </div>
    </footer>
  {{/if}}
</template>;

export default CabbageFooter;
