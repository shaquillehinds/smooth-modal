import {
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

export type NotificationSizeOptions = {
  width?: number;
  height?: number;
  titleWidth?: number;
  messageWidth?: number;
  contentWidth?: number;
  imageSize?: number;
  borderRadius?: number;
};

export type NotificationBase = {
  notificationStyle?: StyleProp<ViewStyle>;
  avoidStatusBar?: boolean;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
} & NotificationSizeOptions;

export type NotificationType = 'component' | 'data';
export type NotificationDataPayload = {
  title?: string;
  message?: string;
  Icon?: JSX.Element;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
} & NotificationSizeOptions;

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
  activeOpacity?: number;
  onPress?: (content: NotificationContent, dismiss: () => void) => void;
  onNotificationLeave?: () => void;
  onNotificationEnter?: () => void;
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
