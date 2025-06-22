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
