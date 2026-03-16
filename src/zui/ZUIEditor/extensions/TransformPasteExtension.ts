import { Plugin, PluginKey } from '@remirror/pm/state';
import { extension, PlainExtension } from 'remirror';

@extension<Record<string, never>>({
  customHandlerKeys: [],
  defaultOptions: {},
  handlerKeys: [],
  staticKeys: [],
})
class TransformPasteExtension extends PlainExtension {
  createPlugin() {
    const pluginKey = new PluginKey('transformPaste');

    return new Plugin({
      key: pluginKey,
      props: {
        transformPastedHTML: (html: string) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          this.transformDOM(doc.body);
          return doc.body.innerHTML;
        },
      },
    });
  }

  private hasBlockContent(element: Element): boolean {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const tagName = child.tagName.toLowerCase();
      if (
        tagName === 'p' ||
        tagName === 'h1' ||
        tagName === 'h2' ||
        tagName === 'h3' ||
        tagName === 'h4' ||
        tagName === 'h5' ||
        tagName === 'h6' ||
        tagName === 'ul' ||
        tagName === 'ol' ||
        tagName === 'li' ||
        tagName === 'blockquote' ||
        tagName === 'pre' ||
        tagName === 'div'
      ) {
        return true;
      }
    }
    return false;
  }

  get name() {
    return 'transformPaste' as const;
  }

  private replaceTag(element: Element, newTag: string): void {
    const newElement = document.createElement(newTag);
    while (element.firstChild) {
      newElement.appendChild(element.firstChild);
    }
    for (const attr of Array.from(element.attributes)) {
      newElement.setAttribute(attr.name, attr.value);
    }
    if (element.parentNode) {
      element.parentNode.replaceChild(newElement, element);
    }
  }

  private transformDOM(element: Element): void {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      null
    );

    const elementsToProcess: Element[] = [];
    let node: Node | null = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        elementsToProcess.push(node as Element);
      }
      node = walker.nextNode();
    }

    for (const el of elementsToProcess) {
      const tagName = el.tagName.toLowerCase();

      if (tagName === 'div') {
        if (this.hasBlockContent(el)) {
          this.unwrapElement(el);
        } else {
          this.replaceTag(el, 'p');
        }
      } else if (tagName === 'span') {
        const style = el.getAttribute('style') || '';
        if (
          style.includes('font-weight') &&
          (style.includes('bold') ||
            style.includes('700') ||
            style.includes('900'))
        ) {
          this.replaceTag(el, 'strong');
        } else if (style.includes('font-style') && style.includes('italic')) {
          this.replaceTag(el, 'em');
        } else {
          this.unwrapElement(el);
        }
      } else if (tagName === 'b' || tagName === 'strong') {
        this.replaceTag(el, 'strong');
      } else if (tagName === 'i' || tagName === 'em') {
        this.replaceTag(el, 'em');
      } else if (tagName === 'br') {
        const parent = el.parentElement;
        if (parent && parent.tagName.toLowerCase() === 'p') {
          const text = parent.textContent || '';
          if (text.trim() === '') {
            parent.removeChild(el);
          }
        }
      } else if (tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
        this.replaceTag(el, 'h3');
      }
    }
  }

  private unwrapElement(element: Element): void {
    const parent = element.parentNode;
    if (!parent) {
      return;
    }

    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
}

export default TransformPasteExtension;
