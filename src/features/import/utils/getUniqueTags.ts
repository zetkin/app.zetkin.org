export default function getUniqueTags(allTags: { id: number }[]) {
  const uniqueTagIds = new Set<number>();
  return allTags.filter((tag) =>
    uniqueTagIds.has(tag.id) ? false : uniqueTagIds.add(tag.id)
  );
}
