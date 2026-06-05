import slugify from 'slugify';

export default function createSlug(input: string) {
  const lowerCaseInput = input.toLocaleLowerCase();
  const slugified = slugify(lowerCaseInput, {
    //Removes any character that is not a-z, _ and " "
    remove: /[^a-z0-9_ ]/,
    //Replaces spaces with "_"
    replacement: '_',
  });
  // Slugs may not start with a number
  return slugified.replace(/^[0-9_]+/, '').slice(0, 40);
}
