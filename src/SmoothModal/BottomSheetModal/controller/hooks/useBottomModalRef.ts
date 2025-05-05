import { useImperativeHandle, useRef } from 'react';
import type {
  BottomSheetController,
  BottomSheetModalRef,
} from '../../config/bottomSheetModal.types';
import type { ComponentMounterController } from '../../../components/Component.mounter';

export function useBottomModalRef(ref: BottomSheetModalRef) {
  const mounterRef = useRef<ComponentMounterController | null>(null);
  const sheetRef = useRef<BottomSheetController | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      openModal: () => mounterRef.current?.mountComponent(),
      closeModal: () => {
        sheetRef.current?.animateCloseModal();
        mounterRef.current?.unMountComponent();
      },
      snapToIndex: (index) => sheetRef.current?.snapToIndex(index),
      snapToPercentage: (percentage) =>
        sheetRef.current?.snapToPercentage(percentage),
    }),
    []
  );
  return {
    mounterRef,
    sheetRef,
  };
}
