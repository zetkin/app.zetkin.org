/**
 * Returns true if the event is being dispatched from
 * an input element where the user is typing.
 *
 * Returns false if the event is being dispatched from
 * any other element including input elements that
 * are not text fields (buttons).
 */
const isUserTyping = (e: KeyboardEvent): boolean => {
  if (!e.target) {
    return false;
  }

  const target = e.target as HTMLElement;
  const tagName = target.tagName.toLowerCase();

  if (
    (tagName === 'input' &&
      (target as HTMLInputElement).type !== 'submit' &&
      (target as HTMLInputElement).type !== 'button') ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.contentEditable === 'true'
  ) {
    return true;
  }
  return false;
};

export default isUserTyping;
