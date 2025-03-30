import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const wHeight = Dimensions.get('window').height;

const diff = height - wHeight;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = wHeight;
export const isSmallDevice = width < 375;
export const isBigDevice = width > 1100;
export const relativeY = (num: number) => (height - diff / 2) * (num / 100);
export const relativeX = (num: number) => width * (num / 100);
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
