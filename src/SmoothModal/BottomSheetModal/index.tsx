import { type PropsWithChildren } from 'react';
import { BottomSheetModal } from './BottomSheetModal';
import { type BottomSheetModalProps } from './bottomSheetModal.types';
import { ComponentMounter } from '../components/Component.mounter';

export function SmoothBottomModal(
  props: PropsWithChildren<BottomSheetModalProps>
) {
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
