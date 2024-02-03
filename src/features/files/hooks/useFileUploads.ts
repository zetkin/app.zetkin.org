import { useRouter } from 'next/router';
import { Accept, DropzoneState, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ZetkinFile } from 'utils/types/zetkin';

export enum FileUploadState {
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export interface FileCategory {
  [mime: string]: string[];
}

export const FILECAT_IMAGES: FileCategory = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
};

export interface FileUpload {
  apiData: ZetkinFile | null;
  file: File;
  key: number;
  name: string;
  state: FileUploadState;
}

interface UseFileUploads {
  cancelFileUpload: (file: FileUpload) => void;
  fileUploads: FileUpload[];
  getDropZoneProps: DropzoneState['getRootProps'];
  openFilePicker: () => void;
  reset: () => void;
}

export default function useFileUploads(props?: {
  accept?: Accept;
  multiple?: boolean;
}): UseFileUploads {
  const { orgId } = useRouter().query;
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);

  const fileKeyRef = useRef<number>(1);
  const filesRef = useRef(fileUploads);
  const fileInput = useRef<HTMLInputElement>();

  const addFiles = (files: File[]) => {
    setFileUploads([
      ...filesRef.current,
      ...files.map((file) => {
        const fileUpload: FileUpload = {
          apiData: null,
          file: file,
          key: fileKeyRef.current++,
          name: file.name,
          state: FileUploadState.UPLOADING,
        };

        postFile(fileUpload);

        return fileUpload;
      }),
    ]);
  };

  // Creates input element for uploading files that works across browsers
  if (!fileInput.current && typeof document === 'object') {
    fileInput.current = document.createElement('input');
    fileInput.current.setAttribute('type', 'file');
    fileInput.current.onchange = (ev) => {
      const files = (ev.target as HTMLInputElement)?.files;
      if (files) {
        addFiles(Array.from(files));
      }
    };
  }

  async function postFile(upload: FileUpload): Promise<void> {
    const formData = new FormData();
    formData.append('file', upload.file);

    try {
      const res = await fetch(`/api/orgs/${orgId}/files`, {
        body: formData,
        method: 'POST',
      });

      const data = await res.json();
      setFileUploads(
        filesRef.current.map((file) =>
          file.key == upload.key
            ? { ...file, apiData: data.data, state: FileUploadState.SUCCESS }
            : file
        )
      );
    } catch (err) {
      // TODO: Handle error more gracefully
      setFileUploads(
        filesRef.current.map((file) =>
          file.key == upload.key
            ? { ...file, state: FileUploadState.FAILURE }
            : file
        )
      );
    }
  }

  useEffect(() => {
    filesRef.current = fileUploads;
  }, [fileUploads]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, []);

  const { getRootProps } = useDropzone({
    accept: props?.accept,
    multiple: props?.multiple,
    noClick: true,
    onDrop,
  });

  return {
    cancelFileUpload: (fileUpload) => {
      setFileUploads(
        fileUploads.filter((candidate) => candidate.key != fileUpload.key)
      );
    },
    fileUploads,
    getDropZoneProps: getRootProps,
    openFilePicker: () => {
      fileInput.current?.click();
    },
    reset: () => {
      setFileUploads([]);
    },
  };
}
