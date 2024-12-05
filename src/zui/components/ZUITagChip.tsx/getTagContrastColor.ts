import { getContrastColor } from 'utils/colorUtils';
import { funSwatches } from 'zui/theme/palette';

export default function getTagContrastColor(color: string) {
  let contrastColor = '';

  Object.keys(funSwatches).forEach((funSwatch) => {
    const colorObject = funSwatches[funSwatch as keyof typeof funSwatches];
    if (color == colorObject.dark.color) {
      contrastColor = colorObject.dark.contrast;
    } else if (color == colorObject.medium.color) {
      contrastColor = colorObject.medium.contrast;
    } else if (color == colorObject.light.color) {
      contrastColor == colorObject.light.contrast;
    }
  });

  return contrastColor || getContrastColor(color);
}
