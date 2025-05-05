import { Dimensions, PixelRatio, Platform } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const wHeight = Dimensions.get('window').height;

const diff = height - wHeight;

const scale = 0.11519078473722104;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = wHeight;
export const isSmallDevice = width < 375;
export const isBigDevice = width > 1100;
export const relativeY = (num: number) => (height - diff / 2) * (num / 100);
export const relativeX = (num: number) => width * (num / 100);
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function normalize(size: number) {
  const newSize = relativeY(size * scale);
  if (Platform.OS === 'ios') {
    return PixelRatio.roundToNearestPixel(newSize);
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const relativeYWorklet = (num: number) => {
  'worklet';
  return (height - diff / 2) * (num / 100);
};
