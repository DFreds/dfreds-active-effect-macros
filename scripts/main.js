import ActiveEffectMacros from './active-effect-macros.js';
import Constants from './constants.js';

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
  const currentMacro =
    activeEffectConfig?.object?.getMacro()?.data?.command ?? '';
  const activeEffectNav = html.find('nav');
  activeEffectNav.append(
    '<a class="item" data-tab="macro"><i class="fas fa-code"></i> Macro</a>'
  );

  // TODO extract to template
  const effectsTab = html.find('section[data-tab="effects"]');
  effectsTab.after(
    `
    <section class="tab" data-tab="macro">
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
        <textarea name="command">${currentMacro}</textarea>
      </div>
    </section>
    `
  );

  // TODO add way to execute
  // <footer class="sheet-footer flexrow">
  //   <button class="execute" type="button"><i class="fas fa-dice-d20"></i> Execute On Macro</button>
  //   <button class="execute" type="button"><i class="fas fa-dice-d20"></i> Execute Off Macro</button>
  // </footer>
});

Hooks.on('preUpdateActiveEffect', (activeEffect, data, options, userId) => {
  const command = data?.command;

  if (!command) return;

  activeEffect?.setMacro(
    new Macro({
      name: `${activeEffect.data.label} macro`,
      type: CONST.MACRO_TYPES.SCRIPT,
      author: game.user.id,
      command,
    })
  );
});

Hooks.on('createActiveEffect', (activeEffect, data, userId) => {
  if (!activeEffect?.hasMacro()) return;

  activeEffect.executeMacro('on');
});

Hooks.on('deleteActiveEffect', (activeEffect, data, userId) => {
  if (!activeEffect?.hasMacro() || activeEffect?.data?.disabled === true)
    return;

  activeEffect.executeMacro('off');
});

Hooks.on('updateActiveEffect', (activeEffect, data, options, userId) => {
  if (!activeEffect?.hasMacro()) return;

  if (data?.disabled === true) {
    activeEffect.executeMacro('off');
  } else if (data?.disabled === false) {
    activeEffect.executeMacro('on');
  }
});
