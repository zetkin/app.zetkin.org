import { Box } from '@mui/material';

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
            minWidth={height / 2}
            mr={index + 1 < values.length ? 0.3 : 0}
            sx={{
              transition: 'all 0.5s cubic-bezier(0.83, 0, 0.17, 1)',
            }}
            width={valueObj.value / total}
          />
        );
      })}
    </Box>
  );
};

export default ZUIStackedStatusBar;
