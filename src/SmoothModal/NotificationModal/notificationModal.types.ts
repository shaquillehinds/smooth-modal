import {
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

type NotificationBase = {
  notificationStyle: StyleProp<ViewStyle>;
  notificationHeight: number;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
};

export type NotificationType = 'component' | 'data';
export type NotificationDataPayload = {
  title: string;
  message?: string;
  Icon?: JSX.Element;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};
export type NotificationContent =
  | {
      type: 'component';
      payload: React.ReactNode;
    }
  | { type: 'data'; payload: NotificationDataPayload };

export type NotificationItem = {
  id: string;
  style?: StyleProp<ViewStyle>;
  content: NotificationContent;
  duration?: number;
  onPress?: () => void;
  onNotificationLeave?: () => void;
};

export type NotificationProps = {
  notification: NotificationItem;
  index: number;
} & NotificationBase;

export type NotificationModalProps = NotificationBase;

export type NotificationModalProviderProps = Omit<
  NotificationBase,
  'notifications' | 'setNotifications'
>;
