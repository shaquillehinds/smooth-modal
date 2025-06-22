import React, {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';

export type PortalKey = number | string;
export type PortalItem = { key: PortalKey; element: ReactNode };
export type OnPortalMount = (key: PortalKey) => void;
export type OnPortalUnMount = OnPortalMount;
export interface PortalContextValue {
  mount: (
    key: PortalKey,
    element: ReactNode,
    onMount?: OnPortalMount
  ) => PortalKey;
  update: (key: PortalKey, element: ReactNode) => void;
  unmount: (key: PortalKey, OnPortalUnMount?: OnPortalUnMount) => void;
}

export const PortalContext = createContext<PortalContextValue | undefined>(
  undefined
);

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [portals, setPortals] = useState<PortalItem[]>([]);
  const keys = useRef<Record<string, true>>({});

  const mount: PortalContextValue['mount'] = (key, element, onMount) => {
    if (keys.current[key]) return key;
    setPortals((prev) => [...prev, { key, element }]);
    keys.current[key] = true;
    onMount?.(key);
    return key;
  };

  const update = (key: PortalKey, element: ReactNode) => {
    if (!keys.current[key]) return;
    setPortals((prev) =>
      prev.map((item) => (item.key === key ? { ...item, element } : item))
    );
  };

  const unmount: PortalContextValue['unmount'] = (key, onUnMount) => {
    if (!keys.current[key]) return;
    setPortals((prev) => prev.filter((item) => item.key !== key));
    delete keys.current[key];
    onUnMount?.(key);
  };

  return (
    <PortalContext.Provider value={{ mount, update, unmount }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {portals.map(({ key, element }) => (
          <React.Fragment key={key}>{element}</React.Fragment>
        ))}
      </View>
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    return null;
  }
  return context;
};

// export {
//   PortalProvider,
//   usePortal,
// } from '@shaquillehinds/react-native-essentials';
