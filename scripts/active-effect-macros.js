import Constants from './constants.js';

export default class ActiveEffectMacros {
  registerFunctions() {
    ActiveEffect.prototype.hasMacro = function () {
      return !!this.getFlag(Constants.MODULE_ID, 'macro');
    };

    ActiveEffect.prototype.getMacro = function () {
      if (this.hasMacro()) {
        return new Macro(this.getFlag(Constants.MODULE_ID, 'macro').data);
      }
    };

    ActiveEffect.prototype.setMacro = async function (macro) {
      if (macro instanceof Macro) {
        await this.unsetFlag(Constants.MODULE_ID, 'macro');
        return await this.setFlag(Constants.MODULE_ID, 'macro', {
          data: macro.data,
        });
      }
    };

    ActiveEffect.prototype.executeMacro = function (...args) {
      if (!this.hasMacro()) return;

      // const item = this;
      const activeEffect = this;
      // const macro = item.getMacro();
      const macro = activeEffect.getMacro();
      const parent = activeEffect.parent;

      // const speaker = ChatMessage.getSpeaker({ actor: item.actor });
      // const actor = item.actor ?? game.actors.get(speaker.actor);
      // const token = item.actor?.token ?? canvas.tokens.get(speaker.token);
      const character = game.user.character;
      const event = getEvent();

      //build script execution
      const body = `(async ()=>{
        ${macro.data.command}
      })();`;
      // const fn = Function(
      //   'item',
      //   'speaker',
      //   'actor',
      //   'token',
      //   'character',
      //   'event',
      //   'args',
      //   body
      // );
      const fn = Function(
        'activeEffect',
        'parent',
        'character',
        'event',
        'args',
        body
      );

      //attempt script execution
      try {
        fn.call(macro, activeEffect, parent, character, event, args);
      } catch (err) {
        ui.notifications.error('Error executing macro');
      }

      function getEvent() {
        let a = args[0];
        if (a instanceof Event) return args[0].shift();
        if (a?.originalEvent instanceof Event)
          return args.shift().originalEvent;
        return undefined;
      }
    };
  }
}
