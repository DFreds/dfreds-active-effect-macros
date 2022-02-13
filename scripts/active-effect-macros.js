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

      const activeEffect = this;
      const macro = activeEffect.getMacro();
      const parent = activeEffect.parent;

      const speaker = ChatMessage.getSpeaker();
      const item = parent instanceof Item ? parent : null;
      const actor =
        (parent instanceof Actor
          ? parent
          : parent instanceof Item
          ? item.actor
          : game.actors.get(speaker.actor)) ?? null;
      const token =
        actor?.token ??
        item?.actor?.token ??
        canvas.tokens.get(speaker.token) ??
        null;
      const character = game.user.character;
      const event = getEvent();

      const body = `(async ()=>{
        ${macro.data.command}
      })();`;
      const fn = Function(
        'activeEffect',
        'parent',
        'speaker',
        'item',
        'actor',
        'token',
        'character',
        'event',
        'args',
        body
      );

      try {
        fn.call(
          macro,
          activeEffect,
          parent,
          speaker,
          item,
          actor,
          token,
          character,
          event,
          args
        );
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
