import { FC } from 'react';
import { Skeleton } from '@mui/material';

import { IFuture } from 'core/caching/futures';

type ZUIFutureBuilderFunc<DataType> = (
  data: DataType,
  isLoading: boolean
) => JSX.Element | null;

interface ZUIFutureProps<DataType> {
  children: JSX.Element | null | ZUIFutureBuilderFunc<DataType>;
  future: IFuture<DataType>;
  ignoreDataWhileLoading?: boolean;
  skeleton?: JSX.Element;
  skeletonHeight?: number;
  skeletonWidth?: number;
}

function ZUIFuture<DataType>({
  children,
  future,
  ignoreDataWhileLoading = false,
  skeleton,
  skeletonHeight,
  skeletonWidth = 50,
}: ZUIFutureProps<DataType>): ReturnType<FC> {
  if (!skeleton) {
    skeleton = <Skeleton height={skeletonHeight} width={skeletonWidth} />;
  }

  if (future.data) {
    if (future.isLoading && ignoreDataWhileLoading) {
      return skeleton;
    }

    if (typeof children == 'function') {
      return children(future.data, future.isLoading);
    } else {
      return children;
    }
  } else if (future.isLoading) {
    return skeleton;
  } else {
    // TODO: Handle errors somehow?
    return null;
  }
}

export default ZUIFuture;
