//$lf-ignore
import { BlurView, type BlurViewProps } from 'expo-blur';
import { type PropsWithChildren } from 'react';
import { StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { zIndex } from '../styles/styles.const';
import { isAndroid, isIOS } from '../utils/Layout.const';

export type ModalBackgroundAnimatedProps = {
  blurViewProps?: BlurViewProps;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  onPress?: () => Promise<void> | void;
  avoidStatusBar?: boolean;
  blurBackdrop?: 'ios' | 'android' | true;
  disableBlurWarning?: boolean;
};

export function ModalBackgroundAnimated(
  props: PropsWithChildren<ModalBackgroundAnimatedProps>
) {
  if (
    props.blurBackdrop &&
    props.blurBackdrop !== 'ios' &&
    isAndroid &&
    !props.disableBlurWarning
  ) {
    console.warn(
      `Using background blur on Android is not recommended if you are changing screens while the modal is open. Android will most likely glitch and render a blank screen. To avoid this you can either:

A) Only use blur for ios.
B) If navigating, disable the screen transition animation for that navigation.
C) Only use blur background if you aren't changing screens with the modal is open.
D) Make sure the modal is closed before attempting to change screens.

You can use the modal ref to close the modal and use the onClose callback to transition if you choose option D. Like this
ref.current?.closeModal({onClose: ()=>{navigate("somescreen")}})
`
    );
  }
  const transparentBg = { backgroundColor: 'rgba(0,0,0,.2)' };
  const isTransparentView =
    !props.blurBackdrop ||
    (props.blurBackdrop !== true &&
      ((props.blurBackdrop !== 'ios' && isIOS) ||
        (props.blurBackdrop !== 'android' && isAndroid)));
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <Animated.View
        style={[
          { ...StyleSheet.absoluteFillObject, zIndex },
          props.style,
          props.animatedStyle,
        ]}
      >
        {props.children ??
          (isTransparentView ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                transparentBg,
                {
                  marginTop: props.avoidStatusBar
                    ? StatusBar.currentHeight
                    : undefined,
                },
              ]}
            />
          ) : (
            <BlurView
              style={[
                StyleSheet.absoluteFill,
                {
                  marginTop: props.avoidStatusBar
                    ? StatusBar.currentHeight
                    : undefined,
                },
              ]}
              intensity={15}
              tint={'dark'}
              experimentalBlurMethod={'dimezisBlurView'}
              {...props.blurViewProps}
            />
          ))}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
