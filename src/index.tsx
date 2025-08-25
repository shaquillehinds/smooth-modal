import {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
  useSmoothBottomModalRef,
} from './SmoothModal/BottomSheetModal';

export type * from './SmoothModal/BottomSheetModal/config/bottomSheetModal.types';
export {
  PortalProvider as SmoothModalPortalProvider,
  type PortalItem,
  usePortalComponent as useSmoothPortalComponent,
  usePortal as useSmoothPortal,
} from '@shaquillehinds/react-native-essentials';

export * from './SmoothModal/SpotModal';
export * from './SmoothModal/OptionsModalView';
export * from './SmoothModal/NotificationModal';

export {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
  useSmoothBottomModalRef,
};
export default SmoothBottomModal;
