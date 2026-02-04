type Props = {
  increment?: number;
  max?: number;
  min?: number;
};

export default function useIncrementalDelay(props?: Props) {
  const min = props?.min ?? 0;
  const max = props?.max ?? 3;
  const increment = props?.increment ?? 0.05;

  let delay = min;

  function nextDelay() {
    if (delay < max) {
      delay += increment;
    }

    return delay + 's';
  }

  return nextDelay;
}
