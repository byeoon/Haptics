import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import {get} from "enmity/api/settings";

import Settings from './components/Settings';

const Typing = getByProps('startTyping');
const Patcher = create('haptics');

const Haptics: Plugin = {
   ...manifest,

   onStart() {
      if(get(manifest.name, "vibrator", true)) { 
         setInterval(() => getByProps("triggerHaptic").triggerHaptic())
      }
   },

   onStop() {
      Patcher.unpatchAll();
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(Haptics);
