import { Link } from '@mui/material';
import { FC } from 'react';

type LinkifiedTextProps = {
  text: string;
};

const LinkifiedText: FC<LinkifiedTextProps> = ({ text }) => {
  const LINK_REGEX = /(https:\/\/[^\s]+)/g;
  const parts = text.split(LINK_REGEX);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('https://')) {
          return (
            <Link
              key={`link-${idx}`}
              href={part}
              rel="noreferrer"
              target="_blank"
            >
              {part}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
};

export default LinkifiedText;
