import pako from 'pako';
import Image from 'next/image';
import QRCode from 'qrcode';
import { FC, useEffect, useState } from 'react';

async function createQRCode(ids: number[]): Promise<string> {
  const arr = new BigInt64Array(ids.map((id) => BigInt(id)));

  const compressed = pako.deflate(arr.buffer);

  console.log('Generating compressed', compressed);

  return await QRCode.toDataURL([{ data: compressed, mode: 'byte' }], {});
}

interface IMyQRCodeProps {
  ids: number[];
}

const MyQRCode: FC<IMyQRCodeProps> = ({ ids }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    const getCode = async () => {
      const code = await createQRCode(ids);
      setCode(code);
    };
    getCode();
  }, []);

  if (code) {
    return <Image alt="QR Code" height={200} src={code} width={200} />;
  }

  return <div />;
};

export default MyQRCode;
