import { StyleSheet } from 'react-native';
import { relativeX, relativeY } from '../utils/Layout.const';

export const notificationStyles = StyleSheet.create({
  notification: {
    alignSelf: 'center',
    position: 'absolute',
  },
  notificationContent: {
    minHeight: relativeY(5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: relativeX(6),
    paddingVertical: relativeY(1),
    overflow: 'hidden',
  },
});
