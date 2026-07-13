export const objectToFormData = (
  obj: Record<string, string | string[]>
): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};
