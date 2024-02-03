import mockTag from '../../../utils/testing/mocks/mockTag';
import { ZetkinTagGroup } from 'utils/types/zetkin';
import {
  getTagColumns,
  JourneyTagColumnType,
  JourneyTagGroupColumn,
  JourneyUnsortedTagsColumn,
  JourneyValueTagColumn,
} from './journeyInstanceUtils';

describe('journeyInstanceUtils', () => {
  describe('getTagColumns()', () => {
    const tagMock = mockTag();
    const groupMock: ZetkinTagGroup = {
      id: 1,
      organization: {
        id: 1,
        title: 'KPD',
      },
      title: 'Group',
    };

    it('separates tags by group', () => {
      const columns = getTagColumns([
        {
          tags: [
            { ...tagMock, group: groupMock, id: 1 },
            { ...tagMock, group: { ...groupMock, id: 2 }, id: 2 },
          ],
        },
      ]) as JourneyTagGroupColumn[];

      expect(columns.length).toBe(2);
      expect(columns[0].type).toBe(JourneyTagColumnType.TAG_GROUP);
      expect(columns[1].type).toBe(JourneyTagColumnType.TAG_GROUP);

      expect(columns[0].group.id).toBe(1);
      expect(columns[1].group.id).toBe(2);
    });

    it('separates value tags from other columns', () => {
      const instance = {
        tags: [
          { ...tagMock, id: 1, value: 'Clara', value_type: 'string' },
          { ...tagMock, id: 2 },
        ],
      };

      const columns = getTagColumns([instance]);

      expect(columns.length).toBe(2);
      expect(columns[0].type).toBe(JourneyTagColumnType.VALUE_TAG);
      expect(columns[1].type).toBe(JourneyTagColumnType.UNSORTED);

      // Check that the value is correct
      const valueCol = columns[0] as JourneyValueTagColumn;
      expect(valueCol.tag.id).toBe(1);
      expect(valueCol.valueGetter(instance)).toBe('Clara');

      // There should be only one tag in unsorted
      const unsortedTags = (columns[1] as JourneyUnsortedTagsColumn).tagsGetter(
        instance.tags
      );
      expect(unsortedTags.map((tag) => tag.id)).toEqual([2]);
    });
  });
});
