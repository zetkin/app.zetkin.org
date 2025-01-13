# ZUIEditor

This is Zetkin's block editor, built on top of ProseMirror and Remirror. This
document describes how it works for developers who want to use or develop it
further.

## Architecture

ZUIEditor uses [Remirror](https://www.remirror.io/), which in turn builds on
[ProseMirror](https://prosemirror.net/). Functionality is added in two ways
(often simultaneously), using Remirror extensions and using React UI components
that are overlaid on top of the ProseMiror DOM.

```
.---------------------------------------------.
|                  ZUIEditor                  |
|  _________________________________________  |
| |                      |                  | |
| |                      =    Extensions    | |
| |     UI components    |                  | |
| |                      |--------||--------| |
| |                      =                  | |
| |----------------------|                  | |
| |  (ProseMirror DOM)   |    (Remirror)    | |     Items in parentheses
| |----------------------|                  | |     belong to third-party
| | (ProseMirror logic)  =                  | |     components.
| '----------------------'------------------' |
|_____________________________________________|
```

- **Extensions** add functionality to the editor via Remirror, which in turn
  communicates with ProseMirror
- **Extensions** and **UI components** communicate in order to update UI or
  update state when the user interacts with the UI
- **UI components** read state from Remirror in order to update UI, and
  sometimes trigger updates directly

### Communicating from UI to extension

UI components are used to present a graphical interface through which the user
can interact with the editor, so they need to be able to trigger changes in the
editor by sending messages to it.

Components send messages to extensions using commands, that are exposed by the
editor using the `@command` decorator in the extension.

Example: The `ImageExtensionUI` presents the file picker and updates the image
block by invoking the `setImageFile()` command exposed by `ImageExtension`.

### Communicating from extension to UI

For UI components to be able to present accurate UI they need to know the state
of the underlying extension. Extensions can notify the UI of changes using
events.

Events are defined as part of the extension options using the `Handler` type,
and then invoked by the extension via `this.options`.

Example: `ImageExtensionUI` listens to an `onCreate` event that is dispatched by
the extension when it creates a new image block.

```ts
type ImageOptions = {
  onCreate?: Handler<() => void>; // <-- Define the event type
};

@extension({
  customHandlerKeys: [],
  defaultOptions: {},
  handlerKeys: ['onCreate'], // <-- Enable the event
  staticKeys: [],
})
export default class ImageExtension extends NodeExtension<ImageOptions> {
  createAndPick() {
    const node = this.type.create();
    this.options.onCreate(); // <-- Invoke the event
    return node;
  }
  // ...
}
```

The component listens for the event using `useExtensionEvent()`:

```ts
useExtensionEvent(ImageExtension, 'onCreate', () => {
  setFileDialogOpen(true);
});
```

### Reading editor state in components

UI components use the `Remirror` hooks directly to read editor state, such as
the current position of the cursor and selection, what blocks exist in the
document, etc.

## Interface

The `ZUIEditor` component exposes these properties:

- `enableX` (where X is a feature) configures the editor to include
  functionality, e.g. `enableImage` to enable the image block
- `onChange` is called whenever content changes and passes the content in the
  Zetkin block format
- `initialContent` is the initial content defined using the Zetkin block format

## Extended functionality

These are the custom extensions that are added by `ZUIEditor`. They should be
documented more properly as we get further.

- Button block
- Image block
- Placeholder
- Block menu
