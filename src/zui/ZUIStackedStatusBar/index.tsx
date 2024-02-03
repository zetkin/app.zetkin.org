import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  animated: {
    transition: 'all 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
  },
}));

interface ZUIStackedStatusBarProps {
  height?: number;
  values: {
    color: string;
    value: number;
  }[];
}

const ZUIStackedStatusBar: React.FunctionComponent<
  ZUIStackedStatusBarProps
> = ({ height = 20, values }) => {
  const classes = useStyles();
  const total = values.reduce((sum, valueObj) => sum + valueObj.value, 0);

  return (
    <Box
      borderRadius={50}
      display="flex"
      flexDirection="row"
      height={height}
      overflow="hidden"
    >
      {values.map((valueObj, index) => {
        return (
          <Box
            key={index}
            bgcolor={valueObj.color}
            className={classes.animated}
            minWidth={height / 2}
            mr={index + 1 < values.length ? 0.3 : 0}
            width={valueObj.value / total}
          />
        );
      })}
    </Box>
  );
};

export default ZUIStackedStatusBar;
