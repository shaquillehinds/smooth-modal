import { useEffect, useMemo, useRef, useState } from 'react';
import { Timer } from '../utils/Scheduler';

type ComponentMounterProps = {
  mountDefault?: boolean;
  showComponent: boolean;
  setShowComponent:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((show: boolean) => void);
  onComponentShow?: () => Promise<void> | void;
  onComponentClose?: () => Promise<void> | void;
  mountDelayInMilliSeconds?: number;
  unMountDelayInMilliSeconds?: number;
  component: React.JSX.Element;
};

export function ComponentMounter(props: ComponentMounterProps) {
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

  useEffect(() => {
    if (justStop.current) {
      setJustStop(false);
      setMounted(false);
    } else if (!props.showComponent) {
      unMountTimer.stop();
      unMountTimer.start();
    } else {
      if (mounted) {
        // Fixes out of sync and stuck modal by triggering an unmount
        // Basically if you get mounted twice the modal never properly unmounted
        props.setShowComponent(false);
        setJustStop(true);
      } else {
        mountTimer.stop();
        mountTimer.start();
      }
    }
    return () => {
      mountTimer.stop();
      unMountTimer.stop();
    };
  }, [props.showComponent]);

  if (!mounted) return null;
  return props.component;
}
