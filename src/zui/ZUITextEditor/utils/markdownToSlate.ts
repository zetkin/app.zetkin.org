import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate from 'remark-slate';
import { unified } from 'unified';

export interface SlateEl {
  [key: string]: string | unknown;
  children?: SlateEl[];
}

function slateReplace(
  slateArray: SlateEl[],
  field: string,
  match: string | null,
  replace: string
) {
  return slateArray.map((item) => {
    if (!match && !!item[field]) {
      item[replace] = item[field];
    }
    if (item[field] === match) {
      item[field] = replace;
    }
    if (item.children) {
      item.children = slateReplace(item.children, field, match, replace);
    }
    return item;
  });
}

export const markdownToSlate = (markdownString: string): Promise<SlateEl[]> =>
  unified()
    .use(markdown)
    .use(slate)
    .use(remarkGfm)
    .process(markdownString)
    .then(
      (file) => {
        let slateArray = file.result as SlateEl[];

        slateArray = slateReplace(slateArray, 'type', 'list_item', 'list-item');
        slateArray = slateReplace(
          slateArray,
          'type',
          'ul_list',
          'bulleted-list'
        );
        slateArray = slateReplace(
          slateArray,
          'type',
          'ol_list',
          'numbered-list'
        );
        slateArray = slateReplace(
          slateArray,
          'type',
          'heading_one',
          'heading-one'
        );
        slateArray = slateReplace(
          slateArray,
          'type',
          'heading_two',
          'heading-two'
        );
        slateArray = slateReplace(
          slateArray,
          'type',
          'block_quote',
          'block-quote'
        );
        slateArray = slateReplace(slateArray, 'link', null, 'url');
        return slateArray.map((item) => {
          return item;
        });
      },
      (error) => {
        throw error;
      }
    );
