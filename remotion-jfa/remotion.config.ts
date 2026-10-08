import {Config} from '@remotion/cli/config';

// A cena é WebGL (Three.js): o Chromium do render precisa de GPU por software ou real.
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
