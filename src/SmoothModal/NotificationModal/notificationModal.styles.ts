import {
  normalize,
  relativeX,
  relativeY,
  shadowStyles,
} from '@shaquillehinds/react-native-essentials';
import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
  notification: {
    alignSelf: 'center',
    position: 'absolute',
    width: relativeX(85),
    backgroundColor: 'transparent',
    borderRadius: relativeX(5),
  },
  notificationContent: {
    ...shadowStyles(),
    minHeight: relativeY(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: relativeY(1),
    paddingHorizontal: relativeX(1),
    justifyContent: 'center',
    backgroundColor: '#003648',
    borderRadius: relativeX(5),
  },
  notificationImage: {
    width: relativeX(12),
    height: relativeX(12),
    borderRadius: relativeX(3),
    marginRight: relativeX(1),
  },
  notificationTitle: {
    width: relativeX(70),
    fontWeight: 600,
    fontSize: normalize(14),
    color: 'white',
  },
  notificationMessage: {
    width: relativeX(70),
    color: 'white',
    fontSize: normalize(13),
  },
});
