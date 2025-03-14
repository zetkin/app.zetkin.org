import { getContrastColor } from 'utils/colorUtils';
import { funSwatches } from 'zui/theme/palette';

export default function getTagContrastColor(color: string) {
  let contrastColor = '';

  Object.values(funSwatches).forEach((funSwatch) => {
    if (color == funSwatch.dark.color) {
      contrastColor = funSwatch.dark.contrast;
    } else if (color == funSwatch.medium.color) {
      contrastColor = funSwatch.medium.contrast;
    } else if (color == funSwatch.light.color) {
      contrastColor == funSwatch.light.contrast;
    }
  });

  return contrastColor || getContrastColor(color);
}
