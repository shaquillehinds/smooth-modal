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
  addNotification: (
    notificationItem: Omit<NotificationItem, 'id'>,
    id?: string
  ) => void;
  updateNotification: (
    notificationId: string,
    notificationItem: Omit<NotificationItem, 'id'>
  ) => void;
  removeNotification: (notificationId: string) => void;
};

const NotificationModalContext =
  createContext<NotificationModalContextProps | null>(null);

export function NotificationModalProvider(
  props: PropsWithChildren<NotificationModalProviderProps>
) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const addNotification: NotificationModalContextProps['addNotification'] =
    useCallback((item, id) => {
      notificationMountTimer.start(() =>
        setNotifications((prev) => [
          ...prev,
          { ...item, id: id || getSequantialRandomId() },
        ])
      );
    }, []);
  const updateNotification: NotificationModalContextProps['updateNotification'] =
    useCallback((id, newItem) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...newItem, id } : item))
      );
    }, []);
  const removeNotification: NotificationModalContextProps['removeNotification'] =
    useCallback((notificationId) => {
      setNotifications((prev) =>
        prev.filter((item) => item.id !== notificationId)
      );
    }, []);
  return (
    <NotificationModalContext.Provider
      value={{ addNotification, updateNotification, removeNotification }}
    >
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
