import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { animateCloseTimingConfig } from '../BottomSheetModal/config/bottomSheetModal.constants';
import { Scheduler } from '@shaquillehinds/react-native-essentials';

export type ComponentMounterProps = {
  showComponent?: boolean;
  setShowComponent?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((show: boolean) => void);
  onComponentShow?: () => Promise<void> | void;
  onComponentClose?: () => Promise<void> | void;
  mountDelayInMilliSeconds?: number;
  unMountDelayInMilliSeconds?: number;
  mountDefault?: boolean;
  component: React.JSX.Element;
};

export type UnMountComponentProps = {
  duration?: number;
  onClose?: () => void;
};
export type MountComponentProps = {
  onOpen?: () => void;
};
export type ComponentMounterController = {
  mountComponent: (props?: MountComponentProps) => void;
  unMountComponent: (props?: UnMountComponentProps) => void;
  hardUnMountComponent: (
    props?: Omit<UnMountComponentProps, 'duration'>
  ) => void;
};
export type ComponentMounterRef = React.Ref<ComponentMounterController>;

export const ComponentMounter = forwardRef(
  (props: ComponentMounterProps, ref: ComponentMounterRef) => {
    const [mounted, setMounted] = useState(props.mountDefault || false);

    const justStop = useRef(false);
    const setJustStop = (bool: boolean) => (justStop.current = bool);

    const mountTimer = useMemo(
      () =>
        new Scheduler.Timer(() => {
          setMounted((prev) => {
            if (!prev) {
              props.onComponentShow?.();
              return true;
            }
            return prev;
          });
        }, props.mountDelayInMilliSeconds || 0),
      []
    );

    const unMountTimer = useMemo(
      () =>
        new Scheduler.Timer(() => {
          setMounted((prev) => {
            if (prev) {
              props.onComponentClose?.();
              return false;
            }
            return prev;
          });
        }, props.unMountDelayInMilliSeconds || 0),
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        mountComponent: (prop) => {
          mountTimer.stop();
          if (prop?.onOpen) {
            const timer = new Scheduler.Timer(() => {
              setMounted((prev) => {
                if (!prev) {
                  props.onComponentShow?.();
                  prop.onOpen?.();
                  return true;
                }
                return prev;
              });
            }, props.mountDelayInMilliSeconds || 0);
            return timer.start();
          }
          mountTimer.start();
        },
        unMountComponent: (prop) => {
          unMountTimer.stop();
          if (prop?.duration || prop?.onClose) {
            const timer = new Scheduler.Timer(() => {
              setMounted((prev) => {
                if (prev) {
                  props.onComponentClose?.();
                  prop.onClose?.();
                  return false;
                }
                return prev;
              });
            }, prop.duration || animateCloseTimingConfig.duration);
            return timer.start();
          }
          unMountTimer.start();
        },
        hardUnMountComponent: (prop) => {
          prop?.onClose?.();
          setMounted(false);
        },
      }),
      []
    );

    useEffect(() => {
      if (props.showComponent === undefined) {
      } else if (justStop.current) {
        setJustStop(false);
        setMounted(false);
      } else if (!props.showComponent) {
        unMountTimer.stop();
        unMountTimer.start();
      } else if (mounted) {
        props.setShowComponent?.(false);
        setJustStop(true);
      } else {
        mountTimer.stop();
        mountTimer.start();
      }

      return () => {
        mountTimer.stop();
        unMountTimer.stop();
      };
    }, [props.showComponent]);

    if (!mounted) return null;
    return props.component;
  }
);
