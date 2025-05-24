import { StyleSheet } from 'react-native';
import { modalBottomOffset, modalHeight } from './bottomSheetModal.constants';
import { zIndex } from '../../styles/styles.const';
import {
  relativeShort,
  relativeX,
  relativeY,
} from '@shaquillehinds/react-native-essentials';

export const bottomModalStyle = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'white',
    width: relativeX(100),
    height: modalHeight,
    borderRadius: relativeShort(7),
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
    height: relativeY(0.2),
    alignSelf: 'center',
    marginVertical: relativeY(1.4),
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
