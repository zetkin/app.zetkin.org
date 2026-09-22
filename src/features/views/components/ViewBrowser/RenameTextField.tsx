import { TextField } from '@mui/material';
import {
  ChangeEvent,
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  ViewBrowserFolderItem,
  ViewBrowserItem,
  ViewBrowserViewItem,
} from 'features/views/hooks/useViewBrowserItems';

const RenameTextField: FC<{
  item: ViewBrowserFolderItem | ViewBrowserViewItem;
  onRenamed: (
    item: ViewBrowserItem,
    newTitle: string,
    canceled?: boolean
  ) => void;
}> = ({ item, onRenamed }) => {
  const inputRef = useRef<HTMLInputElement>();
  const [value, setValue] = useState(item.title);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    let canceled = false;

    const onApply = () => {
      if (canceled) {
        return;
      }

      onRenamed(item, input.value, false);
    };

    const onKeypress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onApply();
        return;
      }

      if (e.key === 'Escape') {
        canceled = true;
        onRenamed(item, item.title, true);
        return;
      }
    };

    const onFocus = () => {
      canceled = false;
    };

    input.addEventListener('blur', onApply);
    input.addEventListener('focus', onFocus);
    input.addEventListener('keydown', onKeypress);

    requestAnimationFrame(() => {
      input.focus();
    });

    return () => {
      input.removeEventListener('blur', onApply);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('keydown', onKeypress);
    };
  }, [item, onRenamed]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <TextField
      inputRef={inputRef}
      onChange={onChange}
      sx={{
        '& .MuiInputBase-input': {
          py: '10px',
        },
      }}
      value={value}
    />
  );
};

export default RenameTextField;
