# @zhama/a2ui-core

A2UI Protocol Core Library - Framework-agnostic TypeScript types and builders for A2UI v0.9 protocol.

> **Note**: This library uses A2UI v0.9 format exclusively. While v0.9 is still in draft status
> according to [a2ui.org](https://a2ui.org/), it offers a cleaner and more modern API.

## Overview

A2UI (Agent to UI) is a JSON-based streaming UI protocol for dynamically rendering user interfaces. This library provides:

- **Types**: Complete TypeScript type definitions for A2UI v0.9
- **Builders**: Convenient functions to build messages and components
- **Surface**: Surface ID constants and creation utilities
- **Validators**: Message validation utilities
- **Utils**: Utility functions for path bindings and data manipulation

## Installation

```bash
npm install @zhama/a2ui-core
# or
pnpm add @zhama/a2ui-core
```

## Quick Start

```typescript
import {
  // Builders
  text, column, button, h1,
  createSurface, updateComponents, updateDataModel,
  createV09Messages,
  
  // Surface
  SURFACE_IDS, createA2UISurface,
  
  // Validators
  validateMessage,
  
  // Utils
  path, generateId,
  
  // Types
  type ComponentInstance,
  type ServerToClientMessageV09,
} from '@zhama/a2ui-core';

// Create components
const title = h1('Hello World', { id: 'title' });
const greeting = text({ path: '/user/name' }, { id: 'greeting' });
const root = column(['title', 'greeting'], { id: 'root' });

// Create messages
const messages = createV09Messages({
  surfaceId: SURFACE_IDS.CHAT,
  components: [title, greeting, root],
  dataModel: { user: { name: 'John' } },
});

// Validate messages
const result = validateMessage(messages[0]);
console.log(result.valid); // true
```

## Modular Imports

You can import specific modules for tree-shaking:

```typescript
// Types only
import type { ComponentInstance, ServerToClientMessageV09 } from '@zhama/a2ui-core/types';

// Builders only
import { text, column, createV09Messages } from '@zhama/a2ui-core/builders';

// Validators only
import { validateMessage, validateMessages } from '@zhama/a2ui-core/validators';

// Utils only
import { path, uuid, deepMerge } from '@zhama/a2ui-core/utils';

// Surface utilities
import { SURFACE_IDS, createA2UISurface, createChatSurface } from '@zhama/a2ui-core/surface';
```

## API Reference

### Component Builders

```typescript
// Content components
text(content: StringOrPath, options?: TextOptions): ComponentInstance
image(url: StringOrPath, options?: ImageOptions): ComponentInstance
icon(name: StringOrPath, options?: IconOptions): ComponentInstance
video(url: StringOrPath, options?: VideoOptions): ComponentInstance
audioPlayer(url: StringOrPath, options?: AudioPlayerOptions): ComponentInstance

// Layout components
row(children: ChildrenProperty, options?: LayoutOptions): ComponentInstance
column(children: ChildrenProperty, options?: LayoutOptions): ComponentInstance
list(children: ChildrenProperty, options?: ListOptions): ComponentInstance
card(childId: string, options?: CardOptions): ComponentInstance
tabs(items: TabItem[], options?: TabsOptions): ComponentInstance
divider(options?: DividerOptions): ComponentInstance
modal(entryPointChildId: string, contentChildId: string, options?: ModalOptions): ComponentInstance

// Interactive components
button(childId: string, action: Action, options?: ButtonOptions): ComponentInstance
checkbox(label: StringOrPath, value: BooleanOrPath, options?: CheckBoxOptions): ComponentInstance
textField(label: StringOrPath, text?: StringOrPath, options?: TextFieldOptions): ComponentInstance
dateTimeInput(value: StringOrPath, options?: DateTimeInputOptions): ComponentInstance
choicePicker(options: ChoiceOption[], value: StringArrayOrPath, usageHint: string, opts?: ChoicePickerOptions): ComponentInstance
slider(value: NumberOrPath, options?: SliderOptions): ComponentInstance

// Convenience helpers
textButton(buttonText: string, action: Action, options?: ButtonOptions): [ComponentInstance, ComponentInstance]
h1(content: StringOrPath, options?: TextOptions): ComponentInstance
h2(content: StringOrPath, options?: TextOptions): ComponentInstance
h3(content: StringOrPath, options?: TextOptions): ComponentInstance
h4(content: StringOrPath, options?: TextOptions): ComponentInstance
h5(content: StringOrPath, options?: TextOptions): ComponentInstance
caption(content: StringOrPath, options?: TextOptions): ComponentInstance
body(content: StringOrPath, options?: TextOptions): ComponentInstance
```

### Message Builders

```typescript
createSurface(surfaceId: string, catalogId?: string): CreateSurfaceMessage
updateComponents(surfaceId: string, components: ComponentInstance[]): UpdateComponentsMessage
updateDataModel(surfaceId: string, value: unknown, path?: string, op?: 'add' | 'replace' | 'remove'): UpdateDataModelMessage
deleteSurface(surfaceId: string): DeleteSurfaceMessage
createV09Messages(options): ServerToClientMessageV09[]

// Utilities
messagesToJsonl(messages: ServerToClientMessageV09[]): string
jsonlToMessages(jsonl: string): ServerToClientMessageV09[]
```

### Surface Module

```typescript
// Surface ID constants
SURFACE_IDS.CHAT           // '@chat' - Chat content area
SURFACE_IDS.RECOMMENDATION // '@recommendation' - Agent recommendations
SURFACE_IDS.INPUT_FORM     // '@input-form' - Input collection forms
SURFACE_IDS.ORCHESTRATION  // '@orchestration' - Multi-agent orchestration
SURFACE_IDS.STATUS         // '@status' - Status messages
SURFACE_IDS.RESULT         // '@result' - Agent results
SURFACE_IDS.CONFIRM        // '@confirm' - Confirmation dialogs
SURFACE_IDS.NOTIFICATION   // '@notification' - Notifications

// Surface creation functions
createA2UISurface(rootId: string, components: ComponentInstance[], surfaceId?: string): SurfaceResult
createA2UISurfaceWithData(rootId: string, components: ComponentInstance[], dataModel: DataObject, surfaceId?: string): SurfaceResult
createDeleteSurfaceMessage(surfaceId: string): ServerToClientMessageV09

// Convenience functions
createChatSurface(rootId: string, components: ComponentInstance[]): SurfaceResult
createRecommendationSurface(rootId: string, components: ComponentInstance[]): SurfaceResult
createInputFormSurface(rootId: string, components: ComponentInstance[]): SurfaceResult
createOrchestrationSurface(rootId: string, components: ComponentInstance[]): SurfaceResult
createStatusSurface(rootId: string, components: ComponentInstance[]): SurfaceResult
```

### Data Model

```typescript
objectToValueMap(obj: DataObject, prefix?: string): ValueMap[]
valueToValueMap(key: string, value: DataValue): ValueMap
valueMapToObject(valueMaps: ValueMap[]): DataObject
normalizePath(path: string, pathMappings?: PathMappings): string
```

### Validators

```typescript
validateMessage(message: ServerToClientMessage, options?: ValidationOptions): ValidationResult
validateMessages(messages: ServerToClientMessage[], options?: ValidationOptions): ValidationResult
validateV09Message(message: ServerToClientMessageV09, options?: ValidationOptions): ValidationResult
```

### Utils

```typescript
path(dataPath: string): { path: string }           // Create data binding
isPathBinding(value): boolean                       // Check if value is a path binding
getLiteralValue<T>(value): T | undefined           // Get literal value
getPathValue(value): string | undefined            // Get path from binding
generateId(prefix?: string): string                // Generate unique component ID
resetIdCounter(): void                             // Reset ID counter
uuid(): string                                     // Generate UUID v4
deepMerge<T>(target: T, source: Partial<T>): T    // Deep merge objects
```

### Constants

```typescript
STANDARD_CATALOG_ID  // Standard A2UI catalog URL
A2UI_EXTENSION_URI   // A2UI v0.9 extension URI
A2UI_MIME_TYPE       // A2UI MIME type (application/json+a2ui)
```

## v0.9 Message Format

A2UI v0.9 uses a cleaner, flatter format:

```typescript
// Component format
{ id: 'title', component: 'Text', text: 'Hello World', usageHint: 'h1' }

// Messages
{ createSurface: { surfaceId: '@chat', catalogId: '...' } }
{ updateComponents: { surfaceId: '@chat', components: [...] } }
{ updateDataModel: { surfaceId: '@chat', op: 'replace', value: { ... } } }
{ deleteSurface: { surfaceId: '@chat' } }
```

## License

MIT
