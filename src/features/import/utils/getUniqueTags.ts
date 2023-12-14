export default function getUniqueTags(allTags: { tag_id: number }[]) {
  const uniqueTagIds = new Set<number>();
  return allTags.filter((tag) =>
    uniqueTagIds.has(tag.tag_id) ? false : uniqueTagIds.add(tag.tag_id)
  );
}
