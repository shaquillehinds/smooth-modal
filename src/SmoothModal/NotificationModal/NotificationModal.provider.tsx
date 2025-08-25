import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
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
        setNotifications((prev) => {
          if (!id) return [...prev, { ...item, id: getSequantialRandomId() }];
          const hasItem = prev.find((prevItem) => prevItem.id === id);
          if (hasItem) return prev;
          return [...prev, { ...item, id }];
        })
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
  const value = useMemo(
    () => ({ addNotification, updateNotification, removeNotification }),
    []
  );
  return (
    <NotificationModalContext.Provider value={value}>
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
