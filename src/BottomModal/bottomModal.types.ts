import React from 'react';
import { type StyleProp, TextInput, type ViewStyle } from 'react-native';

export type BottomModalProps = {
  style?: StyleProp<ViewStyle>;
  bumperStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** iOS */
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
  /** Android */
  inputsToKeepVisibleWithKeyboard?: React.RefObject<TextInput>[];
};

export type BottomModalAnimatedProps = {
  showModal: boolean;
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((bool: boolean) => void);

  avoidKeyboard?: boolean;

  onModalShow?: () => Promise<void> | void;
  onModalClose?: () => Promise<void> | void;
} & BottomModalProps;
