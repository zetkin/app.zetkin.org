import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FC, useState } from 'react';

import LibraryImageCard from './LibraryImageCard';
import messageIds from 'features/files/l10n/messageIds';
import useFiles from 'features/files/hooks/useFiles';
import { useMessages } from 'core/i18n';
import { ZetkinFile } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIFuture from 'zui/ZUIFuture';

type Props = {
  onClose: () => void;
  onSelectFile: (file: ZetkinFile) => void;
  open: boolean;
  orgId: number;
  type?: TypeOption;
};

type TypeOption = keyof typeof messageIds.typeFilter.options;

const TYPE_OPTIONS: Record<TypeOption, string[]> = {
  image: ['image/png', 'image/jpeg'],
};

const FileLibraryDialog: FC<Props> = ({
  onClose,
  onSelectFile,
  open,
  orgId,
  type,
}) => {
  const [sorting, setSorting] = useState('date');
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState<TypeOption | 'any'>(
    type || 'any'
  );
  const filesFuture = useFiles(orgId);
  const messages = useMessages(messageIds);

  return (
    <ZUIDialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title={messages.libraryDialog.title()}
    >
      <Box display="flex" gap={1} mt={1}>
        <TextField
          fullWidth
          label={messages.searching.label()}
          onChange={(ev) => setFilterText(ev.currentTarget.value)}
          value={filterText}
        />
        <FormControl fullWidth>
          <InputLabel>{messages.sorting.label()}</InputLabel>
          <Select
            label={messages.sorting.label()}
            onChange={(ev) => setSorting(ev.target.value)}
            value={sorting}
          >
            <MenuItem value="date">{messages.sorting.options.date()}</MenuItem>
            <MenuItem value="originalName">
              {messages.sorting.options.originalName()}
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl disabled={!!type} fullWidth>
          <InputLabel>{messages.typeFilter.label()}</InputLabel>
          <Select
            label={messages.typeFilter.label()}
            onChange={(ev) =>
              setFilterType(
                ev.target.value == 'any'
                  ? 'any'
                  : (ev.target.value as TypeOption)
              )
            }
            value={filterType}
          >
            <MenuItem value="any">{messages.typeFilter.anyOption()}</MenuItem>
            {Object.keys(TYPE_OPTIONS).map((typeStr) => {
              if (!(typeStr in TYPE_OPTIONS)) {
                throw new Error('Unknown format');
              }

              // This cast is safe because the error above would have been
              // thrown if typeStr is not one of the allowed strings.
              const typeKey = typeStr as TypeOption;

              return (
                <MenuItem key={typeKey} value={typeKey}>
                  {messages.typeFilter.options[typeKey]()}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <ZUIFuture future={filesFuture}>
          {(allFiles) => {
            const filteredFiles = allFiles.filter((file) => {
              const matchesText =
                !filterText ||
                file.original_name.toLowerCase().includes(filterText);

              const matchesType =
                filterType == 'any' ||
                TYPE_OPTIONS[filterType].includes(file.mime_type);

              return matchesText && matchesType;
            });
            const sortedFiles = filteredFiles.sort((f0, f1) => {
              if (sorting == 'originalName') {
                return f0.original_name.localeCompare(f1.original_name);
              } else {
                const d0 = new Date(f0.uploaded);
                const d1 = new Date(f1.uploaded);
                return d1.getTime() - d0.getTime();
              }
            });

            return (
              <Grid container>
                {sortedFiles.map((file) => (
                  <Grid key={file.id} md={3} p={1} xs={12}>
                    <LibraryImageCard
                      imageFile={file}
                      onSelectImage={() => onSelectFile(file)}
                    />
                  </Grid>
                ))}
              </Grid>
            );
          }}
        </ZUIFuture>
      </Box>
    </ZUIDialog>
  );
};

export default FileLibraryDialog;
