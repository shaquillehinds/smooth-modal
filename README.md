P.S There are other components in the package such as:

- SmoothBottomModal
- SmoothBottomSheet
- SmoothBottomFlatlist
- SmoothBottomScrollView
- SmoothNotificationProvider
- useSmoothNotification

The documentation here only covers SmoothBottomModal.

# SmoothBottomModal Documentation

The `SmoothBottomModal` is a customizable, flexible bottom sheet component for React Native, supporting keyboard avoidance, drag behavior, and more.

---

## Installation

```tsx
import { SmoothBottomModal } from '@shaquillehinds/smooth-modal';
```

---

## Basic Usage

```tsx
const [showModal, setShowModal] = useState(false);

<SmoothBottomModal showModal={showModal} setShowModal={setShowModal}>
  {/* Modal Content */}
</SmoothBottomModal>;
```

---

## Props

### Core Props

| Prop             | Type                                                                       | Description                                     |
| :--------------- | :------------------------------------------------------------------------- | :---------------------------------------------- |
| **showModal**    | `boolean`                                                                  | Controls whether the modal is visible.          |
| **setShowModal** | `React.Dispatch<React.SetStateAction<boolean>> \| (bool: boolean) => void` | Function to update the visibility of the modal. |

---

### Drag Behavior

| Prop                              | Type                           | Description                                                                                                              |
| :-------------------------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **dragArea**                      | `'full' \| 'bumper' \| 'none'` | Defines which part of the modal is draggable. <br/>**Default:** `"bumper"`                                               |
| **allowDragWhileKeyboardVisible** | `boolean`                      | Allow dragging the modal even when the keyboard is visible. By default, dragging is disabled while the keyboard is open. |
| **hideBumper**                    | `boolean`                      | Hides the default bumper (drag handle) from the modal.                                                                   |
| **BumperComponent**               | `() => React.ReactNode`        | Provide a custom draggable bumper component, replacing the default bumper.                                               |

---

### Keyboard Handling

| Prop                         | Type                           | Description                                                                         |
| :--------------------------- | :----------------------------- | :---------------------------------------------------------------------------------- |
| **avoidKeyboard**            | `boolean`                      | Automatically adds bottom padding to prevent the keyboard from overlapping content. |
| **inputsForKeyboardToAvoid** | `React.RefObject<TextInput>[]` | Specify input refs to selectively trigger keyboard avoidance padding when focused.  |

---

### Mounting Behavior

| Prop             | Type                          | Description                                                                                                                      |
| :--------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **keepMounted**  | `boolean`                     | Prevents the modal from fully unmounting when closed. Useful with `bottomOffset` to keep the modal slightly visible when closed. |
| **bottomOffset** | `number`                      | Pushes the modal slightly up from the bottom when closed. Works best with `keepMounted`.                                         |
| **onModalShow**  | `() => Promise<void> \| void` | Function to run when the modal is shown (mounted).                                                                               |
| **onModalClose** | `() => Promise<void> \| void` | Function to run when the modal is closed (unmounted).                                                                            |

---

### Content Delay

| Prop                 | Type                                                       | Description                                                                                                                                                                                     |
| :------------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **showContentDelay** | `{ type?: 'mount' \| 'opacity'; timeInMilliSecs: number }` | Delay content rendering for performance optimization. <br/>- `"opacity"`: Delays showing the content with opacity transition. (**Default**) <br/>- `"mount"`: Mounts the content after a delay. |
|                      |                                                            | When using `type: "mount"`, set an explicit `height` or `minHeight` in `contentContainerStyle` to avoid layout shifts.                                                                          |

---

### Styling

| Prop                      | Type                   | Description                                                  |
| :------------------------ | :--------------------- | :----------------------------------------------------------- |
| **style**                 | `StyleProp<ViewStyle>` | Styles the modal sheet itself.                               |
| **contentContainerStyle** | `StyleProp<ViewStyle>` | Styles the modal’s internal content container.               |
| **bumperStyle**           | `StyleProp<ViewStyle>` | Styles the bumper (drag handle) itself.                      |
| **bumperContainerStyle**  | `StyleProp<ViewStyle>` | Styles the container around the bumper.                      |
| **backgroundColor**       | `string`               | Sets the background color of the modal and bumper container. |

---

### Backdrop

| Prop                            | Type              | Description                                                          |
| :------------------------------ | :---------------- | :------------------------------------------------------------------- |
| **BackdropComponent**           | `React.ReactNode` | Provide a custom backdrop component instead of the default BlurView. |
| **disableCloseOnBackdropPress** | `boolean`         | If `true`, tapping on the backdrop will not close the modal.         |

---

## Tips

- Use `keepMounted` + `bottomOffset` if you want the modal to stay slightly "peeking" when not fully open.
- Set a `minHeight` on the `contentContainerStyle` if using `showContentDelay.type: 'mount'` to avoid abrupt height changes.
- Use `inputsForKeyboardToAvoid` for finer control of when padding should be added for the keyboard.
- Provide a custom `BackdropComponent` if you want to personalize the modal background or add animations.

---

## Example: Modal with Keyboard Avoidance

```tsx
const [showModal, setShowModal] = useState(false);
const inputRef = useRef<TextInput>(null);

SmoothBottomModal<
  showModal={showModal}
  setShowModal={setShowModal}
  avoidKeyboard
  inputsForKeyboardToAvoid={[inputRef]}
>
  <TextInput ref={inputRef} placeholder="Type here" />
</SmoothBottomModal>;
```

---
