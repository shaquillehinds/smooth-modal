import { type PropsWithChildren } from 'react';
import { BottomSheetModal } from './components/BottomSheetModal';
import {
  type BottomSheetProps,
  type BottomSheetModalProps,
} from './config/bottomSheetModal.types';
import { ComponentMounter } from '../components/Component.mounter';
import { BottomSheet } from './components/BottomSheet';
import { ModalWrapper } from '../components/Modal.wrapper';
import { BottomSheetFlatlist as SmoothBottomFlatlist } from './components/BottomSheetFlatlist';
import { BottomSheetScrollView as SmoothBottomScrollView } from './components/BottomSheetScrollView';
import { bottomModalController } from './controller';

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
  if (props.keepMounted) return <BottomSheetControl {...props} />;
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
