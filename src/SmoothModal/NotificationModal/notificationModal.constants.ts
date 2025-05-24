import { relativeY, Scheduler } from '@shaquillehinds/react-native-essentials';

export const notificationLeaveDurationMilliS = 500;
export const notificationEnterDurationMilliS = 500;

export const notificationMountTimer = new Scheduler.SequentialTimer(
  notificationEnterDurationMilliS
);

export const notificationHeight = relativeY(8);
// how much the notification will move down when another one lands
export const notificationOffset = notificationHeight + notificationHeight * 0.1;
// how far off screen is the notification hidden before showing
export const initialNotificationPosition = -(notificationHeight + relativeY(3));
