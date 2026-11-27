import { Box, Skeleton } from '@mui/material';

const ViewDataTableSkeleton = () => (
  <Box data-testid="view-table-skeleton" sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton height={40} variant="rounded" width={240} />
      <Skeleton height={40} variant="rounded" width={120} />
    </Box>
    {Array.from({ length: 10 }, (_, row) => (
      <Box
        key={row}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 3,
          py: 1.5,
        }}
      >
        <Skeleton height={24} variant="rounded" width={24} />
        {Array.from({ length: 4 }, (_, column) => (
          <Box key={column} sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton width={row === 0 ? '60%' : '85%'} />
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

export default ViewDataTableSkeleton;
