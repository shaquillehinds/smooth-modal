import type React from 'react';
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';
import type { ModalWrapperProps } from '../../components/Modal.wrapper';
import type {
  AnimatedScrollViewProps,
  EasingFunction,
  EasingFunctionFactory,
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
  showModal?: boolean;
  setShowModal?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);

  _unMounter?: () => void;
  /**
   * Modal snaps to various positions of the screens overall height.
   * Takes a percentage of the screen height.
   * @example
   * [25, "50", "75%"]
   */
  snapPoints?: (number | string)[];

  /**
   * Defines which part of the modal is draggable.
   * "Full" makes the entire modal draggable.
   * @default "bumper"
   */
  dragArea?: 'full' | 'bumper' | 'none';
  /**
   * Prevents full unmounting. Use with bottomOffset if you want to see the modal when it's "closed".
   */
  keepMounted?: boolean;
  /**
   * Removes the top part of the modal that is draggable.
   */
  hideBumper?: boolean;
  /**
   * Adds content bottom padding when the keyboard is visible. Use inputsForKeyboardToAvoid if you only want the padding to be adding when certain inputs are focused.
   */
  avoidKeyboard?: boolean;
  /**
   * By default the modal isn't draggable when the keyboard is visible to prevent weird behavior when avoidKeyboard is active.
   * Add this prop to disable that behavior.
   */
  allowDragWhileKeyboardVisible?: boolean;
  /**
   * Function to run when the modal is mounting.
   */
  onModalShow?: () => Promise<void> | void;
  /**
   * Function to run when the modal is unmounting.
   */
  onModalClose?: () => Promise<void> | void;
  /**
   * Function to run when modal reaches a snapPoint
   */
  onSnapPointReach?: (snapPointIndex: number) => Promise<void> | void;
  /**
   * Style for the modal sheet itself, not the modal content.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the bumper itself, not it's container.
   */
  bumperStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the bumper container, not the actual bumper.
   */
  bumperContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Sets the background color of the modal and the bumper container.
   */
  backgroundColor?: string;
  /**
   * Style for the modal content container, not the modal sheet itself.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Provide a custom bumper component that replaces the default one. This component will be draggrable.
   */
  BumperComponent?: () => React.ReactNode;
  /**
   * Adds content bottom padding for the modal depending on if the provided inputRef is focused.
   */
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
  /**
   * Pushes the modal up. Useful when used with keepMounted prop and you want to still the modal in it's closed position.
   */
  bottomOffset?: number;
  /**
   * Delay as to when content should be shown.
   * Use 'mount' type for heavy loaded content that causes sluggish modal entry to improve performance.
   * Give the contentContainerStyle prop an appropriate minHeight or height when using type 'mount'.
   */
  showContentDelay?: {
    /**
     * @default - "opacity"
     */
    type?: 'mount' | 'opacity';
    timeInMilliSecs: number;
  };

  /**
   * Disables the use use of the portabl provider to render component
   */
  disablePortal?: boolean;
};

export type BottomSheetModalProps = {
  /**
   * Custom backdrop component instead of the default blurview
   */
  BackdropComponent?: React.ReactNode;
  onBackDropPress?: () => void;
  disableCloseOnBackdropPress?: boolean;
  /**
   * Uses expo blur view as the modal backdrop to blur content underneath the modal.
   */
  blurBackdrop?: 'ios' | 'android' | true;
  /**
   * Disables the Android warning for using blur view.
   */
  disableBlurWarning?: boolean;
} & BottomSheetProps &
  ModalWrapperProps;

export type BottomSheetContextProps = {
  scrollY: SharedValue<number>;
  maxScrollOffset: SharedValue<number>;
  inverted: SharedValue<boolean>;
  onBeginScroll: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  onUpdateScroll: (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  onEndScroll: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  scrollableComponentRef: ScrollComponentRef;
};

export type BottomModalContextProps = {
  modalRef: SmoothBottomModalRef;
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

export enum ModalState {
  CLOSED = 0,
  OPENING = 1,
  OPEN = 2,
  CLOSING = 3,
}

export type SnapPoint = {
  offset: number;
};

type SnapController = {
  snapToIndex: (snapPointIndex: number) => void;
  snapToPercentage: (percentage: number | string) => void;
};

export type AnimateCloseModalProps = {
  duration?: number;
  easing?: EasingFunction | EasingFunctionFactory;
};

export type SmoothBottomSheetRef = {
  getModalState: () => ModalState;
  animateCloseModal: (props?: AnimateCloseModalProps) => void;
} & SnapController;

export type SmoothBottomSheetRefObject = React.Ref<SmoothBottomSheetRef>;

export type CloseModalProps = {
  /**
   * Instantly unmounts modal without animation.
   * Useful for glitchy android navigation.
   */
  skipAnimation?: boolean;
  /**
   * Reduces animation duration to 100ms
   * Useful for glitchy android navigation.
   */
  isNavigating?: boolean;
  onClose?: () => void;
} & AnimateCloseModalProps;

export type OpenModalProps = {
  onOpen?: () => void;
};

export type SmoothBottomModalRef = {
  getModalState: () => ModalState | undefined;
  openModal: (props?: OpenModalProps) => void;
  closeModal: (props?: CloseModalProps) => void;
  closeWithoutAnimation: () => void;
} & SnapController;

export type SmoothBottomModalRefObject = React.Ref<SmoothBottomModalRef>;
