import { SequentialTimer } from '../utils/Scheduler';

export const notificationDurationMilliS = 5000;
export const notificationLeaveDurationMilliS = 500;
export const notificationEnterDurationMilliS = 500;
export const notificationVisibleDurationMilliS =
  notificationDurationMilliS - notificationLeaveDurationMilliS;

export const notificationMountTimer = new SequentialTimer(
  notificationEnterDurationMilliS
);
