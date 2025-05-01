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
};

export type BottomSheetModalProps = {
  /**
   * Custom backdrop component instead of the default blurview
   */
  BackdropComponent?: React.ReactNode;
  disableCloseOnBackdropPress?: boolean;
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
}

export type SnapPoint = {
  percentage: number;
  offset: number;
};
