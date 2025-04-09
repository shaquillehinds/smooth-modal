import { BlurView, type BlurViewProps } from 'expo-blur';
import { type PropsWithChildren } from 'react';
import { StatusBar, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { zIndex } from '../styles/styles.const';

export type ModalBackgroundAnimatedProps = {
  blurViewProps?: BlurViewProps;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  onPress?: () => Promise<void> | void;
  avoidStatusBar?: boolean;
};

export function ModalBackgroundAnimated(
  props: PropsWithChildren<ModalBackgroundAnimatedProps>
) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <Animated.View
        style={[
          { ...StyleSheet.absoluteFillObject, zIndex },
          props.style,
          props.animatedStyle,
        ]}
      >
        {props.children ?? (
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
            experimentalBlurMethod="dimezisBlurView"
            {...props.blurViewProps}
          />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
