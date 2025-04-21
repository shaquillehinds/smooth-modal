import type React from 'react';
import type { StyleProp, TextInput, ViewStyle } from 'react-native';
import type { ModalWrapperProps } from '../components/Modal.wrapper';
import type {
  AnimatedScrollViewProps,
  FlatListPropsWithLayout,
  SharedValue,
} from 'react-native-reanimated';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes';

export type BottomSheetProps = {
  showModal: boolean;
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);

  dragArea?: 'full' | 'bumper' | 'none';

  avoidKeyboard?: boolean;

  onModalShow?: () => Promise<void> | void;
  onModalClose?: () => Promise<void> | void;

  style?: StyleProp<ViewStyle>;
  bumperStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  bumperContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
};

export type BottomSheetModalProps = {
  BackdropComponent?: React.ReactNode;
  disableCloseOnBackdropPress?: boolean;
} & BottomSheetProps &
  ModalWrapperProps;

export type BottomSheetContextProps = {
  scrollY: SharedValue<number>;
  onBeginScroll: () => void;
  onUpdateScroll: (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onEndScroll: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
};

export type BottomSheetFlatlistProps<T> = Omit<
  FlatListPropsWithLayout<T>,
  'onScroll'
> & {
  onScroll?: (event: ReanimatedScrollEvent) => void;
};

export type BottomSheetScrollViewProps = Omit<
  AnimatedScrollViewProps,
  'onScroll'
> & {
  onScroll?: (event: ReanimatedScrollEvent) => void;
};
