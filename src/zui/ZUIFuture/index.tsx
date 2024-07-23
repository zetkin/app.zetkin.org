import { FC } from 'react';
import { Skeleton } from '@mui/material';

import { IFuture } from 'core/caching/futures';

type ZUIFutureBuilderFunc<DataType> = (
  data: DataType,
  isLoading: boolean
) => JSX.Element | null;

/**
 * @param DataType The data type of the future's payload.
 * @category Async
 */
export interface ZUIFutureProps<DataType> {
  /**
   * The component to render when the data is loaded.
   */
  children: JSX.Element | null | ZUIFutureBuilderFunc<DataType>;

  /**
   * IFuture object representing the aysnchronous operation that rendering is waiting for.
   */
  future: IFuture<DataType>;

  /**
   * By default, if the IFuture object contains data, it will be rendered regardless of the loading state. Set this to `true` to render the skeleton instead in that case.
   */
  ignoreDataWhileLoading?: boolean;

  /**
   * The skeleton to render while the data is loading. Defaults to a [Skeleton](https://mui.com/components/skeleton/) component.
   */
  skeleton?: JSX.Element;

  /**
   * The height of the skeleton.
   */
  skeletonHeight?: number;

  /**
   * The width of the skeleton. Defaults to 50.
   */
  skeletonWidth?: number;
}

/**
 * Zetkin's equivalent of a [Suspense](https://react.dev/reference/react/Suspense) boundary.
 *
 * Typically looks something like this in everyday use.
 *
 * ```tsx
 * <ZUIFuture future={timelineUpdatesFuture}>
 *   {(updates) => (
 *     <ZUITimeline
 *       disabled={isLoading}
 *       onAddNote={async (note) => {
 *         setIsLoading(true);
 *         await addNote(note);
 *         setIsLoading(false);
 *       }}
 *       onEditNote={editNote}
 *       updates={updates}
 *     />
 *   )}
 * </ZUIFuture>
 * ```
 *
 * In the above code, `timelineUpdatesFuture` is an `IFuture` object
 * representing the asynchronous operation that the rendering is waiting for.
 * The `ZUIFuture` component will render the `ZUITimeline` component when the
 * data is loaded, and a skeleton while the data is loading.
 *
 * @category Async
 * @param {ZUIFutureProps} props
 * @return {JSX.Element}
 */
function ZUIFuture<DataType>(props: ZUIFutureProps<DataType>): ReturnType<FC> {
  const {
    children,
    future,
    ignoreDataWhileLoading = false,
    skeleton = (
      <Skeleton
        height={props.skeletonHeight}
        width={props.skeletonWidth || 50}
      />
    ),
  } = props;

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
