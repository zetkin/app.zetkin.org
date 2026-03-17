import { ObjectMark } from 'remirror';

export default function isObjectMark(
  mark: string | ObjectMark
): mark is ObjectMark {
  return typeof mark != 'string';
}
