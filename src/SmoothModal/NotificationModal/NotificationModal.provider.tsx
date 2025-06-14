import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  type NotificationItem,
  type NotificationModalProviderProps,
} from './notificationModal.types';
import { notificationMountTimer } from './notificationModal.constants';
import { NotificationModal } from './NotificationModal';
import { getSequantialRandomId } from '@shaquillehinds/react-native-essentials';

type NotificationModalContextProps = {
  addNotification: (notificationItem: Omit<NotificationItem, 'id'>) => void;
};

const NotificationModalContext =
  createContext<NotificationModalContextProps | null>(null);

export function NotificationModalProvider(
  props: PropsWithChildren<NotificationModalProviderProps>
) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const addNotification: NotificationModalContextProps['addNotification'] =
    useCallback((item) => {
      notificationMountTimer.start(() =>
        setNotifications((prev) => [
          ...prev,
          { ...item, id: getSequantialRandomId() },
        ])
      );
    }, []);
  return (
    <NotificationModalContext.Provider value={{ addNotification }}>
      {props.children}
      <NotificationModal
        notifications={notifications}
        setNotifications={setNotifications}
        notificationStyle={props.notificationStyle}
        avoidStatusBar={props.avoidStatusBar}
      />
    </NotificationModalContext.Provider>
  );
}

export function useNotificationModal() {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error(
      'useSmoothNotification must be in a SmoothNotificationProvider'
    );
  }

  return context;
}
