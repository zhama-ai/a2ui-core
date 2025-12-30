# @zhama/a2ui-core

A2UI Protocol Core Library - Framework-agnostic TypeScript types and builders for A2UI protocol.

## Overview

A2UI (Agent to UI) is a JSON-based streaming UI protocol for dynamically rendering user interfaces. This library provides:

- **Types**: Complete TypeScript type definitions for A2UI v0.8 and v0.9
- **Builders**: Convenient functions to build messages and components
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
  text, column, button, card,
  createSurface, updateComponents, updateDataModel,
  createV09Messages,
  
  // Validators
  validateMessage,
  
  // Utils
  path, generateId,
  
  // Types
  type ComponentInstance,
  type ServerToClientMessage,
} from '@zhama/a2ui-core';

// Create components
const title = text('Hello World', { id: 'title', usageHint: 'h1' });
const greeting = text({ path: '/user/name' }, { id: 'greeting' });
const root = column(['title', 'greeting'], { id: 'root' });

// Create messages
const messages = createV09Messages({
  surfaceId: 'my-surface',
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
import type { ComponentInstance, ServerToClientMessage } from '@zhama/a2ui-core/types';

// Builders only
import { text, column, createV09Messages } from '@zhama/a2ui-core/builders';

// Validators only
import { validateMessage, validateMessages } from '@zhama/a2ui-core/validators';

// Utils only
import { path, uuid, deepMerge } from '@zhama/a2ui-core/utils';
```

## API Reference

### Types

#### Primitives
- `StringOrPath` - String literal or data path binding
- `NumberOrPath` - Number literal or data path binding
- `BooleanOrPath` - Boolean literal or data path binding
- `StringArrayOrPath` - String array literal or data path binding

#### Components (18 standard components)
**Content**: `TextComponent`, `ImageComponent`, `IconComponent`, `VideoComponent`, `AudioPlayerComponent`
**Layout**: `RowComponent`, `ColumnComponent`, `ListComponent`, `CardComponent`, `TabsComponent`, `DividerComponent`, `ModalComponent`
**Interactive**: `ButtonComponent`, `CheckBoxComponent`, `TextFieldComponent`, `DateTimeInputComponent`, `ChoicePickerComponent`, `SliderComponent`

#### Messages
- **v0.9**: `CreateSurfaceMessage`, `UpdateComponentsMessage`, `UpdateDataModelMessage`, `DeleteSurfaceMessage`
- **v0.8**: `BeginRenderingMessage`, `SurfaceUpdateMessage`, `DataModelUpdateMessage`

#### Other Types
- `Theme` - UI theme configuration
- `Action` - User action definition
- `ComponentInstance` - Component instance with ID

### Builders

#### Component Builders
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

#### Message Builders
```typescript
// v0.9
createSurface(surfaceId: string, catalogId?: string): CreateSurfaceMessage
updateComponents(surfaceId: string, components: ComponentInstance[]): UpdateComponentsMessage
updateDataModel(surfaceId: string, value: unknown, path?: string, op?: 'add' | 'replace' | 'remove'): UpdateDataModelMessage
deleteSurface(surfaceId: string): DeleteSurfaceMessage
createV09Messages(options): ServerToClientMessageV09[]

// v0.8
beginRendering(rootId: string, surfaceId?: string, styles?: Theme): BeginRenderingMessage
surfaceUpdate(components: ComponentInstanceV08[], surfaceId?: string): SurfaceUpdateMessage
dataModelUpdate(contents: ValueMap[], surfaceId?: string, path?: string): DataModelUpdateMessage
dataModelInit(data: DataObject, surfaceId?: string): DataModelUpdateMessage
pathUpdate(path: string, value: DataValue, surfaceId?: string): DataModelUpdateMessage
createV08Messages(options): ServerToClientMessageV08[]

// Utilities
messagesToJsonl(messages: ServerToClientMessage[]): string
jsonlToMessages(jsonl: string): ServerToClientMessage[]
```

#### Data Model Builders
```typescript
objectToValueMap(obj: DataObject, prefix?: string): ValueMap[]
valueToValueMap(key: string, value: DataValue): ValueMap
valueMapToObject(valueMaps: ValueMap[]): DataObject
normalizePath(path: string, pathMappings?: PathMappings): string
updatesToValueMap(updates: UpdateDataItem[], basePath?: string): ValueMap[]
flattenObjectToValueMap(obj: DataObject, basePath: string): ValueMap[]
```

### Validators

```typescript
validateMessage(message: ServerToClientMessage, options?: ValidationOptions): ValidationResult
validateMessages(messages: ServerToClientMessage[], options?: ValidationOptions): ValidationResult
validateV09Message(message: ServerToClientMessageV09, options?: ValidationOptions): ValidationResult
validateV08Message(message: ServerToClientMessageV08, options?: ValidationOptions): ValidationResult
```

### Utils

```typescript
path(dataPath: string): { path: string }           // Create data binding
isPathBinding(value): boolean                       // Check if value is a path binding
getLiteralValue<T>(value): T | undefined           // Get literal value from StringOrPath/NumberOrPath/BooleanOrPath
getPathValue(value): string | undefined            // Get path from binding
generateId(prefix?: string): string                // Generate unique component ID
resetIdCounter(): void                             // Reset ID counter (for new scenes)
uuid(): string                                     // Generate UUID v4
deepMerge<T>(target: T, source: Partial<T>): T    // Deep merge objects
```

### Constants

```typescript
STANDARD_CATALOG_ID  // Standard A2UI catalog URL
A2UI_EXTENSION_URI   // A2UI v0.9 extension URI
A2UI_EXTENSION_URI_V08  // A2UI v0.8 extension URI
A2UI_MIME_TYPE       // A2UI MIME type (application/json+a2ui)
```

## Protocol Versions

### v0.9 (Prompt-first)
Optimized for prompt-first embedding, more concise format:
- `createSurface` - Create a new surface with catalog ID
- `updateComponents` - Update components with flat component list
- `updateDataModel` - Update data model with JSON Patch-like operations
- `deleteSurface` - Delete surface

### v0.8 (Structured output)
Optimized for LLM structured output:
- `beginRendering` - Signal to begin rendering with root component
- `surfaceUpdate` - Update components
- `dataModelUpdate` - Update data model using ValueMap format
- `deleteSurface` - Delete surface

## Type Guards

```typescript
import { isV08Message, isV09Message } from '@zhama/a2ui-core';

if (isV09Message(message)) {
  // Handle v0.9 message
} else if (isV08Message(message)) {
  // Handle v0.8 message
}
```

## License

MIT

