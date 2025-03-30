import { ModalWrapper } from '../components/Modal.wrapper';
import { Notification } from './Notification';
import { type NotificationModalProps } from './notificationModal.types';

export function NotificationModal(props: NotificationModalProps) {
  const { notifications, setNotifications } = props;
  if (!notifications.length) return null; // uncomment this line when you done testing
  return (
    <ModalWrapper enableBackgroundContentPress>
      {notifications.map((notification, index) => (
        <Notification
          notificationStyle={props.notificationStyle}
          key={notification.id}
          notification={notification}
          index={index}
          setNotifications={setNotifications}
          notifications={notifications}
        />
      ))}
    </ModalWrapper>
  );
}
