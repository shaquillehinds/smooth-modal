import { type NotificationProps } from './notificationModal.types';
import Animated from 'react-native-reanimated';
import { notificationHeight } from './notificationModal.constants';
import { ComponentMounter } from '../components/Component.mounter';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NotificationController from './notification.controller';
import { notificationStyles } from './notificationModal.styles';
import { SwipeGesture } from '../gestures/Swipe.gesture';

let ImageComponent: typeof Image;

try {
  // Try to import expo-image
  const { Image: ExpoImage } = require('expo-image');
  ImageComponent = ExpoImage;
} catch (error) {
  try {
    // Fallback to react-native-fast-image
    const FastImage = require('react-native-fast-image').default;
    ImageComponent = FastImage;
  } catch (e) {
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
          activeOpacity={0.8}
          onPress={props.notification.onPress}
        >
          <SwipeGesture onActivation={controller.onSwipeUp} direction="UP">
            <Animated.View
              style={[
                props.notificationStyle,
                { height: notificationHeight },
                notificationStyles.notification,
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
                        resizeMode="contain"
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
                  <View style={{}}>
                    <Text
                      style={[
                        notificationStyles.notificationTitle,
                        content.payload.titleStyle,
                      ]}
                      numberOfLines={1}
                    >
                      {content.payload.title}
                    </Text>
                    {content.payload.message ? (
                      <Text
                        numberOfLines={2}
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
