import QRCode from 'qrcode';
import { FC, ReactNode, useEffect, useState } from 'react';

type Props = {
  clickable?: boolean;
  url: string;
};

const QRCodeImage: FC<Props> = ({ clickable, url }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    const updateCode = async () => {
      const qrCodeUrl = await QRCode.toDataURL(url, { width: 600 });

      setQrCodeDataUrl(qrCodeUrl);
    };

    updateCode();
  }, [url]);

  let output: ReactNode = null;

  if (qrCodeDataUrl) {
    output = <img alt={url} src={qrCodeDataUrl} style={{ width: '100%' }} />;

    if (clickable) {
      return (
        <a
          href={url}
          rel="noreferrer"
          style={{ width: '100%' }}
          target="_blank"
        >
          {output}
        </a>
      );
    }
  }

  return output;
};

export default QRCodeImage;
