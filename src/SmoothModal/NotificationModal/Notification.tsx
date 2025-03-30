import { type NotificationProps } from './notificationModal.types';
import Animated from 'react-native-reanimated';
import { notificationDurationMilliS } from './notificationModal.constants';
import { ComponentMounter } from '../components/Component.mounter';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NotificationController from './notification.controller';
import { notificationStyles } from './notificationModal.styles';

export function Notification(props: NotificationProps) {
  const controller = NotificationController(props);
  const content = props.notification.content;
  return (
    <ComponentMounter
      key={props.notification.id}
      mountDefault={true}
      showComponent={false}
      setShowComponent={() => {}}
      unMountDelayInMilliSeconds={notificationDurationMilliS}
      onComponentClose={controller.onComponentClose}
      component={
        <TouchableOpacity onPress={props.notification.onPress}>
          <Animated.View
            style={[
              props.notificationStyle,
              { height: props.notificationHeight },
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
                  content.payload.contentContainerStyle,
                ]}
              >
                {content.payload.image ? (
                  <Image
                    style={content.payload.imageStyle}
                    source={content.payload.image}
                  />
                ) : content.payload.Icon ? (
                  <View>{content.payload.Icon}</View>
                ) : undefined}
                <View>
                  <Text style={content.payload.titleStyle} numberOfLines={1}>
                    {content.payload.title}
                  </Text>
                  {content.payload.message ? (
                    <Text
                      numberOfLines={2}
                      style={content.payload.messageStyle}
                    >
                      {content.payload.message}
                    </Text>
                  ) : undefined}
                </View>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      }
    />
  );
}
