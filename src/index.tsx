import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import { getByProps } from 'enmity/metro';
import { create } from 'enmity/patcher';
import manifest from '../manifest.json';
import {get} from "enmity/api/settings";
import Settings from './components/Settings';

const Patcher = create('haptics');
const hapticsProp = getByProps("trigerHaptic");
const vibrateProp = getByProps("vibrate");
const viewProp = getByProps("View");
const LazyActionSheet = getByProps("openLazy", "hideActionSheet");

let timer;
let actionsheetTimer;

const Haptics: Plugin = {
   ...manifest,

   onStart() {
      if(get(manifest.name, "vibrator", true)) { 
         let interval = setInterval(vibrateProp.vibrate(viewProp.Platform.select(
            { 
               ios: [10], 
               android: 10 
            }), true) 
         )
      timer = interval;
   }

   const hapticsActionSheet = Patcher.before(LazyActionSheet, 'openLazy', (_, [component, key]) => {
      let intervalAS = setInterval(() => hapticsProp.triggerHaptic());
      actionsheetTimer = intervalAS;
      hapticsActionSheet();
      setTimeout(hapticsActionSheet, 250);
      return intervalAS;

   });


   
   },

   onStop() {
      Patcher.unpatchAll();
      clearInterval(timer);
      clearInterval(actionsheetTimer);
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(Haptics);
