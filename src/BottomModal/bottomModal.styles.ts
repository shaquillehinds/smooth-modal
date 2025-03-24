import { StyleSheet } from 'react-native';
import { modalBottomOffset, modalHeight } from './bottomModal.constants';
import { relativeX, relativeY } from '../utils/Layout.const';

export const bottomModalStyle = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    width: relativeX(100),
    height: modalHeight,
    borderRadius: relativeX(10),
    position: 'absolute',
    bottom: modalBottomOffset,
    zIndex: 1000,
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
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,.1)',
    opacity: 1,
  },
});
