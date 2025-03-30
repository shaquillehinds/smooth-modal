import { isIOS, relativeY } from '../utils/Layout.const';
import { SequentialTimer } from '../utils/Scheduler';

export const notificationLeaveDurationMilliS = 500;
export const notificationEnterDurationMilliS = 500;

export const notificationMountTimer = new SequentialTimer(
  notificationEnterDurationMilliS
);

export const notificationHeight = relativeY(8);
// how much the notification will move down when another one lands
export const notificationOffset = notificationHeight + notificationHeight * 0.1;
// how far off screen is the notification hidden before showing
export const initialNotificationPosition = -(notificationHeight + relativeY(3));
// how much the notification moves down from it's initial y position, which is 0 (NOT initialNotificationPosition)
export const initialNotificationOffset =
  initialNotificationPosition +
  (isIOS ? notificationOffset : notificationHeight / 2);
