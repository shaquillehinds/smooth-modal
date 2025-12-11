# @shaquillehinds/smooth-modal

A comprehensive collection of smooth, performant modal and notification components for React Native. This compilation package provides everything you need for creating beautiful overlays, dropdowns, bottom sheets, menus, and in-app notifications.

[![npm version](https://img.shields.io/npm/v/@shaquillehinds/.smooth-modalsvg)](https://www.npmjs.com/package/@shaquillehinds/)smooth-modal
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📦 What's Included

This package exports all components from the following packages:

- **[DropdownSelector](#dropdown-selector)** - Smart, position-aware dropdown selectors
- **[BottomSheet](#bottom-sheet)** - Performant bottom sheet with snap points and keyboard handling
- **[SpotModal](#spot-modal)** - Position-based modals that appear at specific coordinates
- **[MenuModal](#menu-modal)** - Context menus triggered by press or long-press
- **[InAppNotification](#in-app-notification)** - Beautiful notification system with gesture support

## 🚀 Installation

```bash
npm install @shaquillehinds/smooth-modal
```

or

```bash
yarn add @shaquillehinds/smooth-modal
```

### Peer Dependencies

All packages require the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-svg
```

or

```bash
yarn add react-native-reanimated react-native-gesture-handler react-native-svg
```

> **Important:** Make sure to complete the setup instructions for [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation).

## 📚 Package Components

---

### Dropdown Selector

A beautifully animated, fully customizable dropdown selector that intelligently adapts to screen position and just works out of the box.

<img src="https://raw.githubusercontent.com/shaquillehinds/react-native-dropdown-selector/master/assets/dropdownselector.gif" alt="dropdown selector example" height="500"/>

#### Features

- 🎯 **Smart Positioning** - Automatically detects available screen space and renders upward or downward
- 🎨 **Fully Customizable** - Style every element from the button to individual items
- 🔄 **Smooth Animations** - Fluid spring and timing animations with configurable parameters
- 🔍 **TypeScript Support** - Full type safety with generic type support
- 🪶 **Lightweight** - Minimal dependencies, built on react-native-essentials

#### Quick Start

```tsx
import { DropDownSelector } from '@shaquillehinds/'smooth-modal;
import { useState } from 'react';

function MyComponent() {
  const [selectedValue, setSelectedValue] = useState<string>('apple');

  const fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
  ];

  return (
    <DropDownSelector
      items={fruits}
      selectedItem={selectedValue}
      onSelect={setSelectedValue}
      placeholder="Select a fruit"
    />
  );
}
```

#### Documentation

For complete API reference and advanced usage examples, see the [DropdownSelector package documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-dropdown-selector).

---

### Bottom Sheet

A performant, highly customizable bottom sheet component with snap points, keyboard awareness, and portal system for rendering above navigation.

<img src="https://raw.githubusercontent.com/shaquillehinds/react-native-bottom-sheet/master/assets/bottomsheet.gif" alt="bottom sheet example" height="500"/>

#### Features

- 🎯 **Multiple Snap Points** - Define custom snap positions as percentages of screen height
- 📱 **Keyboard Aware** - Intelligent keyboard avoidance with per-input customization
- 🎨 **Fully Customizable** - Style every aspect from bumper to backdrop
- 🔄 **Portal System** - Renders at app root level above navigation
- 📜 **Scrollable Content** - Built-in FlatList and ScrollView components
- ⚡ **High Performance** - Optimized animations using `useImperativeHandle`

#### Provider Setup

Wrap your app with `BottomSheetPortalProvider` at the root level:

```tsx
import { BottomSheetPortalProvider } from '@shaquillehinds/'smooth-modal;

export default function App() {
  return (
    <BottomSheetPortalProvider>
      {/* Your app content */}
    </BottomSheetPortalProvider>
  );
}
```

#### Quick Start

```tsx
import React, { useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import {
  BottomSheetModal,
  useBottomSheetRef,
} from '@shaquillehinds/'smooth-modal;
import type { BottomModalRefObject } from '@shaquillehinds/'smooth-modal;

export default function MyScreen() {
  const [showModal, setShowModal] = useState(false);
  const bottomSheetRef = useRef<BottomModalRefObject>(null);

  return (
    <View>
      <Button title="Open Bottom Sheet" onPress={() => setShowModal(true)} />

      <BottomSheetModal
        showModal={showModal}
        setShowModal={setShowModal}
        ref={bottomSheetRef}
        snapPoints={['25%', '50%', '90%']}
      >
        <View style={{ padding: 20 }}>
          <Text>Bottom Sheet Content</Text>
        </View>
      </BottomSheetModal>
    </View>
  );
}
```

#### Documentation

For complete API reference and advanced usage examples, see the [BottomSheet package documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-bottom-sheet).

---

### Spot Modal

A simple, intelligent position-based modal that renders content at specific screen coordinates. Perfect for context menus, dropdowns, tooltips, and any UI element that needs to appear at a designated spot on the screen.

<img src="https://raw.githubusercontent.com/shaquillehinds/react-native-spot-modal/master/assets/spotmodal.gif" alt="spot modal example" height="500"/>

#### Features

- 🎯 **Coordinate-Based Positioning** - Render modals at any X/Y coordinates on the screen
- 🧠 **Smart Boundary Detection** - Automatically adjusts position to stay within screen bounds
- 📱 **Orientation Aware** - Handles device rotation and recalculates position accordingly
- 🔌 **Portal Support** - Render modals at the root level to avoid z-index issues
- ⚡ **Smooth Animations** - Built with react-native-reanimated for 60fps animations

#### Provider Setup

Wrap your app with `SpotModalPortalProvider` at the root level:

```tsx
import { SpotModalPortalProvider } from '@shaquillehinds/'smooth-modal;

export default function App() {
  return (
    <SpotModalPortalProvider>{/* Your app content */}</SpotModalPortalProvider>
  );
}
```

#### Quick Start

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SpotModal } from '@shaquillehinds/'smooth-modal;

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePress = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setPosition({ x: pageX, y: pageY });
    setShowModal(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Tap anywhere on this button</Text>
      </TouchableOpacity>

      <SpotModal
        showModal={showModal}
        setShowModal={setShowModal}
        pageX={position.x}
        pageY={position.y}
        backgroundColor="rgba(0, 0, 0, 0.5)"
      >
        <View
          style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}
        >
          <Text>Modal at tap location!</Text>
        </View>
      </SpotModal>
    </View>
  );
}
```

#### Documentation

For complete API reference and advanced usage examples, see the [SpotModal package documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-spot-modal).

---

### Menu Modal

A simple, elegant context menu modal for React Native that appears at the touch location. Perfect for creating contextual menus, dropdown options, and interactive lists triggered by press or long-press gestures.

<img src="https://raw.githubusercontent.com/shaquillehinds/react-native-menu-modal/master/assets/menumodal.gif" alt="menu modal example" height="500"/>

#### Features

- 🎯 **Position-aware** - Opens at exact touch coordinates
- ⚡ **Flexible activation** - Trigger on press or long-press
- 🎨 **Highly customizable** - Style every aspect of the menu
- 🔧 **TypeScript support** - Fully typed for excellent DX
- 🎁 **Zero config** - Works out of the box, no provider required!

#### Quick Start

```tsx
import { MenuModal } from '@shaquillehinds/'smooth-modal;

// Works immediately without any setup!
<MenuModal
  backgroundColor="#1a1a1a"
  options={[
    { title: 'Edit', onOptionPress: () => console.log('Edit') },
    { title: 'Delete', onOptionPress: () => console.log('Delete') },
    { title: 'Share', onOptionPress: () => console.log('Share') },
  ]}
>
  <Text>Press me!</Text>
</MenuModal>;
```

#### Optional Provider Setup

The `MenuModalPortalProvider` is **optional**. The menu modal works out of the box by falling back to React Native's `Modal` component. However, the portal provider offers better control:

```tsx
import { MenuModalPortalProvider } from '@shaquillehinds/'smooth-modal;

export default function App() {
  return (
    <MenuModalPortalProvider>{/* Your app content */}</MenuModalPortalProvider>
  );
}
```

#### Documentation

For complete API reference and advanced usage examples, see the [MenuModal package documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-menu-modal).

---

### In-App Notification

A beautiful, customizable, and performant in-app notification system for React Native that just works. Built with React Native Reanimated for smooth 60fps animations and gesture support.

<img src="https://raw.githubusercontent.com/shaquillehinds/react-native-in-app-notification/master/assets/inappnotification.gif" alt="in-app notification example" height="500"/>

#### Features

- 🎨 **Fully Customizable** - Complete control over styling, sizing, and behavior
- 🎭 **Flexible Content** - Support for both data-driven notifications and custom components
- 🖼️ **Image Support** - Automatic detection for expo-image, react-native-fast-image, or standard Image
- ⚡ **Performant** - Built on Reanimated for smooth 60fps animations
- 👆 **Gesture Support** - Swipe up to dismiss notifications
- 🎪 **Queue Management** - Smart notification stacking and timing

#### Provider Setup

Wrap your app with `InAppNotificationProvider`:

```tsx
import { InAppNotificationProvider } from '@shaquillehinds/'smooth-modal;

export default function App() {
  return (
    <InAppNotificationProvider>
      {/* Your app content */}
    </InAppNotificationProvider>
  );
}
```

#### Quick Start

```tsx
import { useInAppNotification } from '@shaquillehinds/'smooth-modal;

function MyComponent() {
  const { addNotification } = useInAppNotification();

  const showNotification = () => {
    addNotification({
      title: 'Success!',
      message: 'Your action was completed',
      imageUrl: 'https://example.com/icon.png',
      duration: 3000,
    });
  };

  return <Button title="Show Notification" onPress={showNotification} />;
}
```

#### Documentation

For complete API reference and advanced usage examples, see the [InAppNotification package documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-in-app-notification).

---

## 🎨 Styling Philosophy

All packages in this collection are built on `@shaquillehinds/react-native-essentials`, which provides:

- Predefined border radius sizes (`soft`, `medium`, `large`)
- Shadow utilities with platform-specific handling
- Responsive sizing based on device orientation
- Flexible layout components with intuitive props

## 🔧 Common Setup

For optimal performance across all packages, configure your project properly:

### React Native Reanimated

Add the Babel plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

### React Native Gesture Handler

Wrap your app entry point:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your providers and app content */}
    </GestureHandlerRootView>
  );
}
```

### Complete Provider Setup Example

Here's a recommended provider setup that works with all packages:

```tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetPortalProvider,
  SpotModalPortalProvider,
  MenuModalPortalProvider,
  InAppNotificationProvider,
} from '@shaquillehinds/'smooth-modal;

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <InAppNotificationProvider>
        <BottomSheetPortalProvider>
          <SpotModalPortalProvider>
            <MenuModalPortalProvider>
              {/* Your app content */}
              <YourAppContent />
            </MenuModalPortalProvider>
          </SpotModalPortalProvider>
        </BottomSheetPortalProvider>
      </InAppNotificationProvider>
    </GestureHandlerRootView>
  );
}
```

**Note:** Not all providers are required - only include the ones you're actively using in your app.

## 🐛 Troubleshooting

### Animations Not Working

1. Ensure `react-native-reanimated` babel plugin is configured
2. Clear Metro cache: `npx react-native start --reset-cache`
3. Rebuild your app after adding the babel plugin

### Modals Not Appearing

1. Verify you've wrapped your app with the required providers
2. Check that peer dependencies are installed correctly
3. Ensure gesture handler is properly initialized

### Z-Index Issues

1. Use portal providers for proper layering
2. Place portal providers inside `GestureHandlerRootView` but outside `NavigationContainer`
3. Verify provider setup order matches the example above

### TypeScript Errors

1. Ensure you're using compatible versions of peer dependencies
2. Check that `@types/react` and `@types/react-native` are up to date
3. Clear TypeScript cache and restart your IDE

## 📖 Individual Package Documentation

For detailed documentation on each package, please visit:

- [DropdownSelector Documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-dropdown-selector)
- [BottomSheet Documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-bottom-sheet)
- [SpotModal Documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-spot-modal)
- [MenuModal Documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-menu-modal)
- [InAppNotification Documentation](https://www.npmjs.com/package/@shaquillehinds/react-native-in-app-notification)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to any of the individual package repositories.

## 📄 License

MIT © [Shaquille Hinds](https://github.com/shaquillehinds)

All packages in this collection are licensed under the MIT License.

## 🙏 Acknowledgments

Built with:

- [@shaquillehinds/react-native-essentials](https://www.npmjs.com/package/@shaquillehinds/react-native-essentials) - Core utilities and components
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) - Smooth animations
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) - Touch handling
- [react-native-svg](https://github.com/software-mansion/react-native-svg) - Vector graphics

## 📮 Support

- 📧 Email: shaqdulove@gmail.com
- 🐛 Report Issues: Check individual package repositories
- 💬 Discussions: GitHub Discussions on individual package repos

---

Made with ❤️ by [Shaquille Hinds](https://github.com/shaquillehinds)
