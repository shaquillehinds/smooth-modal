import { useCallback, useRef } from 'react';
import { useKeyboardListeners } from '../../hooks/useKeyboardListeners';
import * as Layout from '../../utils/Layout.const';
import { runOnUI, type SharedValue, withTiming } from 'react-native-reanimated';
import {
  closeKeyboardTimingConfig,
  openKeyboardTimingConfig,
} from '../config/bottomSheetModal.constants';
import { type KeyboardEvent, type TextInput } from 'react-native';
import { wait } from '../../utils/wait';

type UseKeyboardAnimationProps = {
  avoidKeyboard?: boolean;
  inputsForKeyboardToAvoid?: React.RefObject<TextInput>[];
  translationY: SharedValue<number>;
  prevTranslationY: SharedValue<number>;
  modalContentTranslateY: SharedValue<number>;
  setDisableLayoutAnimation: (bool: boolean) => void;
};

export function keyboardAnimationController(props: UseKeyboardAnimationProps) {
  const { translationY, prevTranslationY, modalContentTranslateY } = props;

  const keyboardHeight = useRef(0);
  const setKeyboardHeight = useCallback((height: number) => {
    keyboardHeight.current = height;
  }, []);

  const adjustForKeyboardHeight = useCallback(
    (currentKeyboardHeight: number, previousKeyboardHeight: number) => {
      'worklet';
      const maxModalY = Layout.SCREEN_HEIGHT * -1;
      if (currentKeyboardHeight > 10) {
        if (translationY.value <= maxModalY) {
          modalContentTranslateY.value = withTiming(
            -currentKeyboardHeight,
            openKeyboardTimingConfig
          );
        } else {
          const maxGap = maxModalY - translationY.value;
          const height = translationY.value - currentKeyboardHeight;
          if (height < maxModalY) {
            const modalShift = translationY.value + maxGap;
            translationY.value = withTiming(
              modalShift,
              openKeyboardTimingConfig
            );
            prevTranslationY.value = modalShift;
            modalContentTranslateY.value = withTiming(
              -currentKeyboardHeight - maxGap,
              openKeyboardTimingConfig
            );
          } else {
            translationY.value = withTiming(height, openKeyboardTimingConfig);
            prevTranslationY.value = height;
          }
        }
      } else {
        const newTranslationY =
          translationY.value +
          (previousKeyboardHeight + modalContentTranslateY.value);
        translationY.value = withTiming(
          newTranslationY,
          closeKeyboardTimingConfig
        );
        prevTranslationY.value = newTranslationY;
        modalContentTranslateY.value = withTiming(0, closeKeyboardTimingConfig);
      }
    },
    []
  );

  const keyBoardShowListener = useCallback(async (e: KeyboardEvent) => {
    await wait(10);
    if (keyboardHeight.current) return;
    if (
      props.inputsForKeyboardToAvoid &&
      !props.inputsForKeyboardToAvoid.find((input) => {
        return input.current?.isFocused();
      })
    )
      return;
    setKeyboardHeight(e.endCoordinates.height);
    props.setDisableLayoutAnimation(true);
    runOnUI(adjustForKeyboardHeight)(keyboardHeight.current, 0);
  }, []);

  const keyboardHideListener = useCallback(async () => {
    if (!keyboardHeight.current) return;
    const previousKeyboardHeight = keyboardHeight.current;
    setKeyboardHeight(0);
    props.setDisableLayoutAnimation(false);
    runOnUI(adjustForKeyboardHeight)(
      keyboardHeight.current,
      previousKeyboardHeight
    );
  }, []);

  useKeyboardListeners({
    listeners: {
      keyboardWillShow: (e) => {
        Layout.isIOS && keyBoardShowListener(e);
      },
      keyboardWillHide: () => {
        Layout.isIOS && keyboardHideListener();
      },
      keyboardDidShow: (e) => {
        Layout.isAndroid && keyBoardShowListener(e);
      },
      keyboardDidHide: async () => {
        Layout.isAndroid && keyboardHideListener();
      },
    },
    subscribeCondition: () =>
      !!(props.avoidKeyboard || props.inputsForKeyboardToAvoid?.length),
  });
}
