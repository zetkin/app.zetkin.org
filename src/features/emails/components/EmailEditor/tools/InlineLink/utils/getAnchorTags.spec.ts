/** @jest-environment jsdom */

import getAnchorTags from './getAnchorTags';

describe('getAnchorTags()', () => {
  it('finds A tags that are fully in range', () => {
    const div = document.createElement('div');
    div.innerHTML =
      'Some text <a id="one">with a link</a>, <a id="two">another link</a> and other text';
    document.body.append(div);

    const range = new Range();
    range.selectNodeContents(div);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(2);
    expect(anchors[0].id).toBe('one');
    expect(anchors[1].id).toBe('two');
  });

  it('ignores A tags outside of range', () => {
    const div = document.createElement('div');
    const text0 = document.createTextNode('Foo ');
    const text1 = document.createTextNode(' bar ');
    const text2 = document.createTextNode(' baz ');

    // Foo <a id="one">link</a> bar <a id="two">link</a> baz
    div.append(text0);
    div.append(anchorElement('one', 'link'));
    div.append(text1);
    div.append(anchorElement('one', 'link'));
    div.append(text2);

    //  Foo <a id="one">link</a> bar <a id="two">link</a> baz
    // |-------- selection --------|
    const range = new Range();
    range.setStart(text0, 0);
    range.setEnd(text1, 3);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(1);
    expect(anchors[0].id).toBe('one');
  });

  it('includes A tag that is partially selected as part of bigger selection', () => {
    const div = document.createElement('div');
    const text0 = document.createTextNode('Foo ');
    const text1 = document.createTextNode(' bar bar bar ');
    const text2 = document.createTextNode(' baz ');
    const link0 = anchorElement('one', 'link');
    const link1 = anchorElement('two', 'link');

    // Foo <a id="one">link</a> bar bar bar <a id="two">link</a> baz
    div.append(text0);
    div.append(link0);
    div.append(text1);
    div.append(link1);
    div.append(text2);

    //  Foo <a id="one">link</a> bar bar bar <a id="two">link</a> baz
    //                    |- selection -|
    const range = new Range();
    range.setStart(link0.firstChild!, 2);
    range.setEnd(text1, 7);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(1);
    expect(anchors[0].id).toBe('one');
  });

  it('includes A tag with fully selected contents', () => {
    const div = document.createElement('div');
    const link = anchorElement('one', 'This is the link text');
    div.append(link);

    // <a id="one">This is the link text</a>
    //             |---- selection ----|
    const range = new Range();
    range.selectNodeContents(link);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(1);
  });

  it('includes fully selected A tag', () => {
    const div = document.createElement('div');
    const link = anchorElement('one', 'This is the link text');
    div.append(link);

    // <a id="one">This is the link text</a>
    // |----------- selection -------------|
    const range = new Range();
    range.selectNode(link);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(1);
  });

  it('includes A tag whose text is partially selected', () => {
    const div = document.createElement('div');
    const link = anchorElement('one', 'This is the link text');
    div.append(link);

    // <a id="one">This is the link text</a>
    //               |- selection -|
    const range = new Range();
    range.setStart(link.firstChild!, 2);
    range.setEnd(link.firstChild!, 16);

    const anchors = getAnchorTags(range);
    expect(anchors).toHaveLength(1);
  });
});

function anchorElement(id: string, content: string): HTMLAnchorElement {
  const elem = document.createElement('a');
  elem.id = id;
  elem.textContent = content;
  return elem;
}
