import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  animated: {
    transition: 'all 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
  },
}));

interface ZUIStackedStatusBarProps {
  colors: string[];
  values: number[];
}

const ZUIStackedStatusBar: React.FunctionComponent<
  ZUIStackedStatusBarProps
> = ({ values, colors }) => {
  const classes = useStyles();
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <Box
      borderRadius={50}
      display="flex"
      flexDirection="row"
      height={20}
      overflow="hidden"
    >
      {values.map((value, index) => {
        return (
          <Box
            key={index}
            bgcolor={colors[index]}
            className={classes.animated}
            minWidth={10}
            mr={index + 1 < values.length ? 0.3 : 0}
            width={value / total}
          />
        );
      })}
    </Box>
  );
};

export default ZUIStackedStatusBar;
