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
import { getSequantialRandomId } from '../utils/randomSequentialId';
import { NotificationModal } from './NotificationModal';

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
        notificationHeight={props.notificationHeight}
        notificationStyle={props.notificationStyle}
      />
    </NotificationModalContext.Provider>
  );
}

export function useNotificationModal() {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }

  return context;
}
