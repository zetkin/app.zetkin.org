import { ImportedFile } from '../utils/types';
import { useAppSelector } from 'core/hooks';

export default function useFile(): ImportedFile {
  return useAppSelector((state) => state.import.pendingFile);
}
