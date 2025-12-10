import type { ComponentMounterProps } from '@shaquillehinds/react-native-essentials';

export type SpotModalProps = {
  pageX: number;
  pageY: number;
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  backgroundColor?: string;
  disablePortal?: boolean;
  disableNativeModal?: boolean;
};
export type SmoothSpotModalProps = SpotModalProps &
  Omit<
    ComponentMounterProps,
    'showComponent' | 'setShowComponent' | 'component'
  >;
