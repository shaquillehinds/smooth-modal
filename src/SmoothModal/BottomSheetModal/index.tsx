import { forwardRef, type PropsWithChildren } from 'react';
import { BottomSheetModal } from './components/BottomSheetModal';
import {
  type BottomSheetProps,
  type BottomSheetModalProps,
  type BottomSheetModalRef,
  type BottomSheetRef,
} from './config/bottomSheetModal.types';
import { ComponentMounter } from '../components/Component.mounter';
import { BottomSheet } from './components/BottomSheet';
import { ModalWrapper } from '../components/Modal.wrapper';
import { BottomSheetFlatlist as SmoothBottomFlatlist } from './components/BottomSheetFlatlist';
import { BottomSheetScrollView as SmoothBottomScrollView } from './components/BottomSheetScrollView';
import { bottomModalController } from './controller';
import { useBottomModalRef } from './controller/hooks/useBottomModalRef';

const SmoothBottomModal = forwardRef(
  (
    props: PropsWithChildren<BottomSheetModalProps>,
    ref: BottomSheetModalRef
  ) => {
    const { mounterRef, sheetRef } = useBottomModalRef(ref);
    return (
      <ComponentMounter
        ref={mounterRef}
        showComponent={props.showModal}
        setShowComponent={props.setShowModal}
        unMountDelayInMilliSeconds={400}
        onComponentShow={props.onModalShow}
        onComponentClose={props.onModalClose}
        component={
          <BottomSheetModal
            {...props}
            _unMounter={() => mounterRef.current?.unMountComponent()}
            ref={sheetRef}
          />
        }
      />
    );
  }
);

const BottomSheetControl = forwardRef(
  (props: PropsWithChildren<BottomSheetProps>, ref: BottomSheetRef) => {
    const controller = bottomModalController(props);
    return (
      <ModalWrapper enableBackgroundContentPress>
        <BottomSheet {...props} controller={controller} ref={ref} />
      </ModalWrapper>
    );
  }
);

const SmoothBottomSheet = forwardRef(
  (
    props: PropsWithChildren<BottomSheetModalProps>,
    ref: BottomSheetModalRef
  ) => {
    const { mounterRef, sheetRef } = useBottomModalRef(ref);
    return (
      <ComponentMounter
        ref={mounterRef}
        showComponent={props.showModal}
        setShowComponent={props.setShowModal}
        unMountDelayInMilliSeconds={400}
        onComponentShow={props.onModalShow}
        onComponentClose={props.onModalClose}
        component={
          <BottomSheetControl
            {...props}
            _unMounter={() => mounterRef.current?.unMountComponent()}
            ref={sheetRef}
          />
        }
      />
    );
  }
);

export {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
};
