import { shadowStyles } from '@shaquillehinds/react-native-essentials';
import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
  notification: {
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  notificationContent: {
    ...shadowStyles(),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003648',
  },
});
