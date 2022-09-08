// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = { children: CustomText[]; type: 'paragraph' };
type CustomText = { bold?: true; text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
