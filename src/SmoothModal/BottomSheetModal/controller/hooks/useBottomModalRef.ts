import { useImperativeHandle, useMemo, useRef } from 'react';
import type {
  BottomSheetController,
  BottomSheetModalController,
  BottomSheetModalRef,
  BottomSheetProps,
} from '../../config/bottomSheetModal.types';
import type { ComponentMounterController } from '../../../components/Component.mounter';
import { animateCloseTimingConfig } from '../../config/bottomSheetModal.constants';

type UseBottomModalRefProps = {
  ref: BottomSheetModalRef;
} & Pick<BottomSheetProps, 'showModal' | 'setShowModal'>;

export function useBottomModalRef({
  ref,
  showModal,
  setShowModal,
}: UseBottomModalRefProps) {
  const mounterRef = useRef<ComponentMounterController | null>(null);
  const sheetRef = useRef<BottomSheetController | null>(null);
  const modalRef: BottomSheetModalController = useMemo(() => {
    const hasState = setShowModal && typeof showModal === 'boolean';
    return {
      openModal: (openModalProps) => {
        if (hasState && !showModal) setShowModal(true);
        else mounterRef.current?.mountComponent(openModalProps);
      },
      closeModal: (closeModalProps) => {
        if (closeModalProps?.skipAnimation) {
          mounterRef.current?.hardUnMountComponent(closeModalProps);
          hasState && setShowModal(false);
          return;
        }
        if (closeModalProps?.isNavigating) {
          const closeProps = {
            duration: closeModalProps.duration || 100,
            easing: closeModalProps?.easing,
            onClose: closeModalProps?.onClose,
          };
          sheetRef.current?.animateCloseModal(closeProps);
          mounterRef.current?.unMountComponent(closeProps);
          if (hasState)
            setTimeout(() => setShowModal(false), closeProps.duration);
          return;
        }
        if (hasState && !closeModalProps?.duration) return setShowModal(false);
        sheetRef.current?.animateCloseModal(closeModalProps);
        mounterRef.current?.unMountComponent(closeModalProps);
        if (hasState)
          setTimeout(
            () => setShowModal(false),
            animateCloseTimingConfig.duration
          );
      },
      closeWithoutAnimation: () => {
        mounterRef.current?.hardUnMountComponent();
        hasState && setShowModal(false);
      },
      snapToIndex: (index) => sheetRef.current?.snapToIndex(index),
      snapToPercentage: (percentage) =>
        sheetRef.current?.snapToPercentage(percentage),
    };
  }, []);
  useImperativeHandle(ref, () => modalRef, []);
  return {
    mounterRef,
    sheetRef,
    modalRef,
  };
}
