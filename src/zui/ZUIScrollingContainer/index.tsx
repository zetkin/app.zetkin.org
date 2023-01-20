import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, BoxProps, Theme } from '@mui/material';

type ZUIScrollingContainerProps = Omit<BoxProps, 'className' | 'overflow'> & {
  disableHorizontal?: boolean;
};

const useStyles = makeStyles<Theme, ZUIScrollingContainerProps>({
  container: {
    overflowX: (props) => (props.disableHorizontal ? 'auto' : 'scroll'),
    overflowY: 'scroll',
  },
});

const ZUIScrollingContainer: FC<ZUIScrollingContainerProps> = ({
  children,
  ...props
}) => {
  const styles = useStyles(props);

  return (
    <Box {...props} className={styles.container}>
      {children}
    </Box>
  );
};

export default ZUIScrollingContainer;
