import { FC, ReactElement, useEffect, useRef, useState } from 'react';

interface ZUIResponsiveContainerProps {
  children: (width: number) => ReactElement | null;
  onWidthChange?: (width: number, container: HTMLDivElement) => void;
  ssrWidth: number;
}

const FrontendResponsiveContainer: FC<
  Pick<ZUIResponsiveContainerProps, 'children' | 'onWidthChange'>
> = ({ children, onWidthChange }) => {
  const [width, setWidth] = useState(0);

  const widthRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver>(
    new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    })
  );

  useEffect(() => {
    if (onWidthChange && widthRef.current) {
      onWidthChange(width, widthRef.current);
    }
  }, [width, onWidthChange]);

  useEffect(() => {
    const element = widthRef.current;
    const observer = observerRef.current;
    if (element) {
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={widthRef} style={{ width: '100%' }}>
      {children(width)}
    </div>
  );
};

const ZUIResponsiveContainer: FC<ZUIResponsiveContainerProps> = ({
  children,
  onWidthChange,
  ssrWidth,
}) => {
  const [onServer, setOnServer] = useState(true);

  useEffect(() => {
    setOnServer(false);
  }, []);

  if (onServer) {
    return children(ssrWidth);
  } else {
    return (
      <FrontendResponsiveContainer onWidthChange={onWidthChange}>
        {children}
      </FrontendResponsiveContainer>
    );
  }
};

export default ZUIResponsiveContainer;
