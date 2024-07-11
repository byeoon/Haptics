import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import {get} from "enmity/api/settings";

import Settings from './components/Settings';

const Typing = getByProps('startTyping');
const Patcher = create('haptics');
let timer;
const Haptics: Plugin = {
   ...manifest,

   onStart() {
      if(get(manifest.name, "vibrator", true)) { 
         let interval = setInterval(getByProps("vibrate").vibrate(getByProps("View").Platform.select(
            { 
               ios: [10], 
               android: 10 
            }), true) 
         )
      timer = interval;
   }
   },

   onStop() {
      Patcher.unpatchAll();
      clearInterval(timer)
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(Haptics);
