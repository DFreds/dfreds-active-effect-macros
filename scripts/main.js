import ActiveEffectMacros from './active-effect-macros.js';

Hooks.once('init', () => {
  // new Settings().registerSettings();
  // new HandlebarHelpers().registerHelpers();

  game.dfreds = game.dfreds || {};
});

Hooks.once('ready', () => {
  const activeEffectMacros = new ActiveEffectMacros();
  activeEffectMacros.registerFunctions();
});

Hooks.on('renderActiveEffectConfig', (activeEffectConfig, html, data) => {
  const activeEffectNav = html.find('nav');
  activeEffectNav.append(
    '<a class="item" data-tab="macro"><i class="fas fa-code"></i> Macro</a>'
  );

  // TODO extract to template
  const effectsTab = html.find('section[data-tab="effects"]');
  effectsTab.after(
    `
    <section class="tab" data-tab="macro">
      <form class="editable flexcol" autocomplete="off">
        <div class="form-group">
          <label>Scope</label>
            <select name="scope" disabled="">
              <option value="global" selected="">global</option>
              <option value="actors">actors</option>
              <option value="actor">actor</option>
            </select>
        </div>

        <div class="form-group">
          <label>Type</label>
          <select name="type" disabled="">
            <option value="script" selected="">script</option>
            <option value="chat">chat</option>
          </select>
        </div>

        <div class="form-group stacked command">
          <label>Command</label>
          <textarea name="command"></textarea>
        </div>
      </form>
    </section>
    `
  );

  // <footer class="sheet-footer flexrow">
  //   <button type="submit"><i class="fas fa-save"></i> Save Macro</button>
  //   <button class="execute" type="button"><i class="fas fa-dice-d20"></i> Execute Macro</button>
  // </footer>
});
