import type React from 'react';
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';
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
import type { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';

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
  maxScrollOffset: SharedValue<number>;
  inverted: SharedValue<boolean>;
  onBeginScroll: () => void;
  onUpdateScroll: (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEndScroll: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  scrollableComponentRef: ScrollComponentRef;
};

export type BottomSheetFlatlistProps<T> = Omit<
  FlatListPropsWithLayout<T>,
  'onScroll'
> & {
  onScroll?: ReanimatedOnScroll | DefaultOnScroll;
  refFlatlist?: React.MutableRefObject<FlatList> | React.RefObject<FlatList>;
};

export type BottomSheetScrollViewProps = Omit<
  AnimatedScrollViewProps,
  'onScroll'
> & {
  onScroll?: ReanimatedOnScroll | DefaultOnScroll;
  refScrollView?:
    | React.MutableRefObject<AnimatedScrollView>
    | React.RefObject<AnimatedScrollView>;
};

export type DefaultOnScroll = (
  event: NativeSyntheticEvent<NativeScrollEvent>
) => void;
export type ReanimatedOnScroll = (event: ReanimatedScrollEvent) => void;

export type ScrollComponentRef =
  React.MutableRefObject<ScrollComponentRefProps>;

export type ScrollComponentRefProps = FlatList | AnimatedScrollView | null;
