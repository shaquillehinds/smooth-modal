import { type PropsWithChildren } from 'react';
import { BottomSheetModal } from './BottomSheetModal';
import {
  type BottomSheetProps,
  type BottomSheetModalProps,
} from './bottomSheetModal.types';
import { ComponentMounter } from '../components/Component.mounter';
import { BottomSheet } from './BottomSheet';
import { bottomModalController } from './controller/bottomModal.controller';
import { ModalWrapper } from '../components/Modal.wrapper';
import { BottomSheetFlatlist as SmoothBottomFlatlist } from './BottomSheetFlatlist';
import { BottomSheetScrollView as SmoothBottomScrollView } from './BottomSheetScrollView';

function SmoothBottomModal(props: PropsWithChildren<BottomSheetModalProps>) {
  return (
    <ComponentMounter
      showComponent={props.showModal}
      setShowComponent={props.setShowModal}
      unMountDelayInMilliSeconds={300}
      onComponentShow={props.onModalShow}
      onComponentClose={props.onModalClose}
      component={<BottomSheetModal {...props} />}
    />
  );
}

function BottomSheetControl(props: PropsWithChildren<BottomSheetProps>) {
  const controller = bottomModalController(props);
  return (
    <ModalWrapper enableBackgroundContentPress>
      <BottomSheet {...props} controller={controller} />
    </ModalWrapper>
  );
}

function SmoothBottomSheet(props: PropsWithChildren<BottomSheetProps>) {
  return (
    <ComponentMounter
      showComponent={props.showModal}
      setShowComponent={props.setShowModal}
      unMountDelayInMilliSeconds={300}
      onComponentShow={props.onModalShow}
      onComponentClose={props.onModalClose}
      component={<BottomSheetControl {...props} />}
    />
  );
}

export {
  SmoothBottomModal,
  SmoothBottomSheet,
  SmoothBottomFlatlist,
  SmoothBottomScrollView,
};
