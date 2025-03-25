import React from 'react';
import { type StyleProp, TextInput, type ViewStyle } from 'react-native';

export type BottomModalProps = {
  /** @Android In some occurences the backdrop renders on top of the modal. This prevents that */
  disableSafeArea?: boolean;
  style?: StyleProp<ViewStyle>;
  bumperStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  bumperContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
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
