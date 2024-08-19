import { EmailInsights } from '../types';

type InputPoint = {
  id: string;
};

type OutputPoint = EmailInsights['opensByDate'][0];

type GetRelevantDataPoints = {
  mainPoint: OutputPoint | null;
  secondaryPoint: OutputPoint | null;
};

type Series = {
  startDate: Date;
  values: OutputPoint[];
};

export default function getRelevantDataPoints(
  inputPoint: InputPoint,
  main: Series,
  secondary: Series | null
): GetRelevantDataPoints {
  const [serieId, indexStr] = inputPoint.id.split('.');
  const index = parseInt(indexStr);
  if (serieId == 'main') {
    const mainPoint = main.values[index];
    const mainDate = new Date(mainPoint.date);
    const mainOffset = mainDate.getTime() - main.startDate.getTime();

    const secondaryPoint =
      secondary?.values.find((_, index) => {
        const nextPoint = secondary.values[index + 1];
        if (!nextPoint) {
          return true;
        }

        const nextOffset =
          new Date(nextPoint.date).getTime() - secondary.startDate.getTime();

        return nextOffset > mainOffset;
      }) ?? null;

    return {
      mainPoint: mainPoint,
      secondaryPoint: secondaryPoint,
    };
  } else if (secondary) {
    const secondaryPoint = secondary.values[index];
    const secondaryDate = new Date(secondaryPoint.date);
    const secondaryOffset =
      secondaryDate.getTime() - secondary.startDate.getTime();

    const mainPoint = main.values.find((item, index) => {
      const nextPoint = main.values[index + 1];
      if (!nextPoint) {
        return true;
      }

      const nextOffset =
        new Date(nextPoint.date).getTime() - main.startDate.getTime();

      return nextOffset > secondaryOffset;
    });

    return {
      mainPoint: mainPoint || null,
      secondaryPoint,
    };
  } else {
    throw new Error(
      'Secondary series must be supplied when input point is from secondary'
    );
  }
}
