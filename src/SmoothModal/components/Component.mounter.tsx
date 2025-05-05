import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Timer } from '../utils/Scheduler';

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
export type ComponentMounterController = {
  mountComponent: () => void;
  unMountComponent: () => void;
};
export type ComponentMounterRef = React.Ref<ComponentMounterController>;

export const ComponentMounter = forwardRef(
  (props: ComponentMounterProps, ref: ComponentMounterRef) => {
    const [mounted, setMounted] = useState(props.mountDefault || false);

    const justStop = useRef(false);
    const setJustStop = (bool: boolean) => (justStop.current = bool);

    const mountTimer = useMemo(
      () =>
        new Timer(() => {
          setMounted((prev) => {
            if (!prev) {
              props.onComponentShow && props.onComponentShow();
              return true;
            }
            return prev;
          });
        }, props.mountDelayInMilliSeconds || 0),
      []
    );

    const unMountTimer = useMemo(
      () =>
        new Timer(() => {
          setMounted((prev) => {
            if (prev) {
              props.onComponentClose && props.onComponentClose();
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
        mountComponent: () => {
          mountTimer.stop();
          mountTimer.start();
        },
        unMountComponent: () => {
          unMountTimer.stop();
          unMountTimer.start();
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
