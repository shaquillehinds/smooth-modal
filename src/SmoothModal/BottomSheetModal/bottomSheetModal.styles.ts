import { StyleSheet } from 'react-native';
import { modalBottomOffset, modalHeight } from './bottomSheetModal.constants';
import { relativeX, relativeY } from '../utils/Layout.const';
import { zIndex } from '../styles/styles.const';

export const bottomModalStyle = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'white',
    width: relativeX(100),
    height: modalHeight,
    borderRadius: relativeX(10),
    position: 'absolute',
    bottom: modalBottomOffset,
    zIndex,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingBottom: relativeY(10),
  },
  bumper: {
    backgroundColor: 'rgba(156,170,180,0.3)',
    width: relativeX(15),
    borderRadius: 5,
    height: relativeY(0.4),
    alignSelf: 'center',
    marginVertical: relativeY(3),
  },
  bumperContainer: {
    width: relativeX(100),
    zIndex: zIndex + 5,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex,
    backgroundColor: 'rgba(0,0,0,.1)',
    opacity: 1,
  },
});
