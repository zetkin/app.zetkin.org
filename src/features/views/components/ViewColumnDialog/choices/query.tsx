import { PersonSearch } from '@mui/icons-material';

import { ColumnChoice } from '.';
import LocalQueryConfig from '../LocalQueryConfig';
import SingleIconCardVisual from '../SingleIconCardVisual';
import theme from 'theme';
import { SelectedViewColumn, ZetkinViewColumn } from '../../types';

const { blue } = theme.palette.viewColumnGallery;

export const customQuery: ColumnChoice = {
  color: blue,
  renderCardVisual: (color: string) => {
    return <SingleIconCardVisual color={color} icon={PersonSearch} />;
  },
  renderConfigForm: (props: {
    existingColumns: ZetkinViewColumn[];
    onOutputConfigured: (columns: SelectedViewColumn[]) => void;
  }) => <LocalQueryConfig onOutputConfigured={props.onOutputConfigured} />,
};
