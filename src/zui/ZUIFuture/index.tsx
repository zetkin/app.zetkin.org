import { FC } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

import { IFuture } from 'core/caching/futures';
import { isEmptyData } from 'zui/ZUIFutures';
import Msg from 'core/i18n/Msg';
import messageIds from 'zui/l10n/messageIds';

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
   * What to render if fetching data has failed.
   */
  errorIndicator?: React.ReactElement;

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
 * Facilitates displaying fallback content while an {@link IFuture} object is loading.
 *
 * ZUIFuture is Zetkin's equivalent of a
 * [Suspense](https://react.dev/reference/react/Suspense) boundary, and
 * typically looks something like this in everyday use.
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
    errorIndicator,
    future,
    ignoreDataWhileLoading = false,
    skeleton = (
      <Skeleton
        height={props.skeletonHeight}
        width={props.skeletonWidth || 50}
      />
    ),
  } = props;

  if (future.data && (!future.isLoading || !isEmptyData(future))) {
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
    return (
      errorIndicator || (
        <Box
          alignItems="center"
          data-testid="error-indicator"
          display="flex"
          flexDirection="column"
          justifyItems="center"
          padding={3}
          width="100%"
        >
          <ErrorOutlined color="error" fontSize="large" />
          <Typography variant="body1">
            <Msg id={messageIds.futures.errorLoading} />
          </Typography>
        </Box>
      )
    );
  }
}

export default ZUIFuture;
