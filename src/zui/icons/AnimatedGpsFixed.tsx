import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const PulsePath = styled('path')({
  animation: `${pulse} 1s infinite ease-in-out`,
});

export const AnimatedGpsFixed = ({ pulsing }: { pulsing: boolean }) => {
  return (
    <svg
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.94 11c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
        fill="currentColor"
      />
      {pulsing ? (
        <PulsePath
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
          fill="currentColor"
        />
      )}
    </svg>
  );
};
