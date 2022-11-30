import { FC, ReactElement, useEffect, useRef, useState } from 'react';

type ZUIAnimatedNumberRenderFunc = (value: string) => ReactElement;

interface ZUIAnimatedNumberProps {
  children: ZUIAnimatedNumberRenderFunc;
  decimals?: number;
  durationSeconds?: number;
  startValue?: number;
  value: number;
}

interface ZUIAnimatedNumberAnimState {
  fromValue: number | null;
  requestId: number | null;
  startTime: number | null;
}

const ZUIAnimatedNumber: FC<ZUIAnimatedNumberProps> = ({
  children,
  decimals = 0,
  durationSeconds = 0.5,
  startValue,
  value,
}) => {
  const [animatedValue, setAnimatedValue] = useState(value);

  const animRef = useRef<ZUIAnimatedNumberAnimState>({
    fromValue: null,
    requestId: null,
    startTime: null,
  });

  const animate = (time: number) => {
    const animState = animRef.current;
    if (animState.startTime === null || animState.fromValue === null) {
      // Animation just (re)started, set it up
      animState.startTime = time;
      animState.fromValue =
        startValue === undefined ? animatedValue : startValue;
    }

    const fullDiff = value - animState.fromValue;
    const t = Math.min(
      1.0,
      (time - animState.startTime) / (durationSeconds * 1000)
    );

    if (t < 1.0) {
      setAnimatedValue(animState.fromValue + t * fullDiff);
      animState.requestId = requestAnimationFrame(animate);
    } else {
      // Set to real value at end of animation, to avoid any bugs in the
      // calculation causing the final value to be anything but the real.
      setAnimatedValue(value);
    }
  };

  useEffect(() => {
    // Restart animation
    animRef.current.startTime = null;
    animRef.current.requestId = requestAnimationFrame(animate);
  }, [value]);

  return children(animatedValue.toFixed(decimals));
};

export default ZUIAnimatedNumber;
