import { type NotificationProps } from './notificationModal.types';
import Animated from 'react-native-reanimated';
import { notificationHeight } from './notificationModal.constants';
import { ComponentMounter } from '../components/Component.mounter';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NotificationController from './notification.controller';
import { notificationStyles } from './notificationModal.styles';
import { SwipeGesture } from '../gestures/Swipe.gesture';

let ImageComponent: typeof Image;
let type: 'expo' | 'fast-image' | 'react-native' = 'expo';

try {
  const { Image: ExpoImage } = require('expo-image');
  ImageComponent = ExpoImage;
  try {
    const FastImage = require('react-native-fast-image');
    if (FastImage) {
      type = 'fast-image';
      ImageComponent = FastImage;
    } else {
      type = 'react-native';
      ImageComponent = Image;
    }
  } catch (e) {
    type = 'react-native';
    ImageComponent = Image;
  }
} catch (error) {
  try {
    const FastImage = require('react-native-fast-image');
    if (FastImage) {
      type = 'fast-image';
      ImageComponent = FastImage;
    } else {
      type = 'react-native';
      ImageComponent = Image;
    }
  } catch (e) {
    type = 'react-native';
    ImageComponent = Image;
  }
}

export function Notification(props: NotificationProps) {
  const controller = NotificationController(props);
  const content = props.notification.content;
  return (
    <ComponentMounter
      key={props.notification.id}
      mountDefault={true}
      showComponent={false}
      setShowComponent={() => {}}
      unMountDelayInMilliSeconds={controller.notificationDurationMilliS}
      onComponentClose={controller.onComponentClose}
      component={
        <TouchableOpacity
          activeOpacity={props.notification.activeOpacity || 0.8}
          onPress={() => {
            props.notification.onPress &&
              props.notification.onPress(
                props.notification.content,
                controller.onSwipeUp
              );
          }}
        >
          <SwipeGesture onActivation={controller.onSwipeUp} direction="UP">
            <Animated.View
              style={[
                { height: notificationHeight },
                notificationStyles.notification,
                props.notificationStyle,
                props.notification.style,
                controller.notifAnimatedStyle,
              ]}
            >
              {content.type === 'component' ? (
                content.payload
              ) : (
                <View
                  style={[
                    notificationStyles.notificationContent,
                    { height: notificationHeight },
                    content.payload.contentContainerStyle,
                  ]}
                >
                  {content.payload.image ? (
                    <View>
                      <ImageComponent
                        //@ts-ignore
                        contentFit="contain"
                        resizeMode={type === 'expo' ? undefined : 'contain'}
                        style={[
                          notificationStyles.notificationImage,
                          content.payload.imageStyle,
                        ]}
                        source={
                          typeof content.payload.image === 'string'
                            ? { uri: content.payload.image }
                            : content.payload.image
                        }
                      />
                    </View>
                  ) : content.payload.Icon ? (
                    <View>{content.payload.Icon}</View>
                  ) : undefined}
                  <View>
                    {content.payload.title ? (
                      <Text
                        style={[
                          notificationStyles.notificationTitle,
                          content.payload.titleStyle,
                        ]}
                        numberOfLines={content.payload.message ? 1 : 2}
                      >
                        {content.payload.title}
                      </Text>
                    ) : undefined}

                    {content.payload.message ? (
                      <Text
                        numberOfLines={content.payload.title ? 2 : 3}
                        style={[
                          notificationStyles.notificationMessage,
                          content.payload.messageStyle,
                        ]}
                      >
                        {content.payload.message}
                      </Text>
                    ) : undefined}
                  </View>
                </View>
              )}
            </Animated.View>
          </SwipeGesture>
        </TouchableOpacity>
      }
    />
  );
}
