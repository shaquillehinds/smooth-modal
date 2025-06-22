import {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
  useSmoothBottomModalRef,
} from './SmoothModal/BottomSheetModal';
import {
  NotificationModalProvider as SmoothNotificationProvider,
  useNotificationModal as useSmoothNotification,
} from './SmoothModal/NotificationModal';

export type * from './SmoothModal/BottomSheetModal/config/bottomSheetModal.types';
// export { PortalProvider as SmoothModalPortalProvider } from '@shaquillehinds/react-native-essentials';
export {
  PortalProvider as SmoothModalPortalProvider,
  type PortalItem,
} from './SmoothModal/components/Portal.provider';

export {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
  SmoothNotificationProvider,
  useSmoothNotification,
  useSmoothBottomModalRef,
};
export default SmoothBottomModal;
