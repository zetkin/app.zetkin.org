import slugify from 'slugify';

export default function createSlug(input: string) {
  const lowerCaseInput = input.toLocaleLowerCase();
  const slugified = slugify(lowerCaseInput, {
    //Removes any character that is not a-z, _ and " "
    remove: /[^a-z_  *]/,
    //Replaces spaces with "_"
    replacement: '_',
  });
  return slugified.slice(0, 40);
}
