### A Simple React Native Bottom Sheet That Just Works.

#### Works The Same On IOS & Android

P.S There are other components in this package such as:

- `SmoothBottomModal`
- `SmoothBottomSheet`
- `SmoothBottomFlatlist`
- `SmoothBottomScrollView`
- `SmoothNotificationProvider`
- `useSmoothNotification`

The documentation here only covers `SmoothBottomModal` and `SmoothBottomSheet`.

# SmoothBottomModal & SmoothBottomSheet Documentation

The `SmoothBottomModal` & `SmoothBottomSheet` is a customizable, flexible bottom sheet component for React Native, supporting keyboard avoidance, drag behavior, and more.

Unlike`SmoothBottomModal`,`SmoothBottomSheet` doesn't have a backdrop component, can optionally stay mounted when "close" is called and it can't use React Native's default Modal for rendering a new root view overlay.

---

## Required Peer Dependencies

```json
"react-native-gesture-handler": ">=2.7.0",
"react-native-reanimated": ">=3.0.0"
```

---

## Installation

#### NPM

```bash
npm install @shaquillehinds/smooth-modal
```

#### Yarn

```bash
yarn add @shaquillehinds/smooth-modal
```

---

## Basic Usage

```tsx
import { SmoothBottomModal } from '@shaquillehinds/smooth-modal';
```

```tsx
const [showModal, setShowModal] = useState(false);

<SmoothBottomModal showModal={showModal} setShowModal={setShowModal}>
  {/* Modal Content */}
</SmoothBottomModal>;
```

#### OR

```tsx
const ref = useRef<BottomSheetModalController>(null);

<SmoothBottomModal ref={ref}>{/* Modal Content */}</SmoothBottomModal>;
```

---

## Props

### Core Props

##### Use Either ref or showModal, avoid using both as it can lead to unpredictable behavoir.

| Prop             | Type                                            | Description                                          |
| :--------------- | :---------------------------------------------- | :--------------------------------------------------- |
| **ref**          | `React.Ref<BottomSheetModalController>`         | Controls the modal's open, close and snap movements. |
| **showModal**    | `boolean`                                       | Controls whether the modal is visible.               |
| **setShowModal** | `React.Dispatch<React.SetStateAction<boolean>>` | Function to update the visibility of the modal.      |

---

### Drag Behavior

| Prop                              | Type                           | Description                                                                                                              |
| :-------------------------------- | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **snapPoints**                    | `(string\|number)[]`           | Defines points based on a percentage of the screen's height that the modal can snap to. Example `[25, "50", "75%"]`      |
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

| Prop                                     | Type                          | Description                                                                                                                      |
| :--------------------------------------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **keepMounted** (SmoothBottomSheet Only) | `boolean`                     | Prevents the modal from fully unmounting when closed. Useful with `bottomOffset` to keep the modal slightly visible when closed. |
| **bottomOffset**                         | `number`                      | Pushes the modal slightly up from the bottom when closed. Works best with `keepMounted`.                                         |
| **onModalShow**                          | `() => Promise<void> \| void` | Function to run when the modal is shown (mounted).                                                                               |
| **onModalClose**                         | `() => Promise<void> \| void` | Function to run when the modal is closed (unmounted).                                                                            |
| **disableAndroidBackButton**             | `boolean`                     | Only valid when using 'useNativeModal' prop. Stops modal from closing when the hardware back button is pressed on android.       |

---

### Overlay Behavior

| Prop                                        | Type      | Description                                                                                                                                                                      |
| :------------------------------------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **enableBackgroundContentPress**            | `boolean` | If `true` and there's no backdrop component, the background content that's below the modal will be touchable. Is always `true` on `SmoothBottomSheet`.                           |
| **useNativeModal** (SmoothBottomModal Only) | `boolean` | If `true`, uses React Native's default modal to render a new root view to render them modal. Useful if you need the modal to be absolute on top of navigation and other content. |

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

### Backdrop (SmoothBottomModal Only)

| Prop                            | Type                         | Description                                                                     |
| :------------------------------ | :--------------------------- | :------------------------------------------------------------------------------ |
| **BackdropComponent**           | `React.ReactNode`            | Provide a custom backdrop component instead of the default BlurView.            |
| **disableCloseOnBackdropPress** | `boolean`                    | If `true`, tapping on the backdrop will not close the modal.                    |
| **blurBackdrop**                | `'ios' \| 'android' \| true` | Uses expo blur view as the modal backdrop to blur content underneath the modal. |
| **disableBlurWarning**          | `boolean`                    | Disables the Android warning for using blur view.                               |

---

## Tips

- Use `keepMounted` + `bottomOffset` on `SmoothBottomSheet` if you want the modal to stay slightly "peeking" when not fully open. This won't work on SmoothBottomModal only SmoothBottomSheet.
- Set a `minHeight` on the `contentContainerStyle` if using `showContentDelay.type: 'mount'` to avoid abrupt height changes.
- Use `inputsForKeyboardToAvoid` for finer control of when padding should be added for the keyboard.
- Provide a custom `BackdropComponent` if you want to personalize the modal background or add animations.

---

## Examples

### Modal with Keyboard Avoidance

```tsx
const [showModal, setShowModal] = useState(false);
const inputRef = useRef<TextInput>(null);

<SmoothBottomModal
  showModal={showModal}
  setShowModal={setShowModal}
  avoidKeyboard
  inputsForKeyboardToAvoid={[inputRef]}
>
  <TextInput ref={inputRef} placeholder="Type here" />
</SmoothBottomModal>;
```

---

### Draggable Modal With ScrollView Or Flatlist

If you need the modal to be draggable when scrollable content is at the beginning (scroll offset at 0).

```tsx
import {
  SmoothBottomModal,
  SmoothBottomScrollView,
} from '@shaquillehinds/smooth-modal';
```

```tsx
const [showModal, setShowModal] = useState(false);

<SmoothBottomModal showModal={showModal} setShowModal={setShowModal}>
  <SmoothBottomScrollView>{/* ScrollView Content */}</SmoothBottomScrollView>
</SmoothBottomModal>;
```
