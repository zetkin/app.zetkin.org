import { useState } from 'react';

export default function useSendTestEmail() {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
    sendTestEmail: () => {
      //TODO: real logic to send email here
      return new Promise<void>((resolve) => {
        setIsLoading(true);
        setTimeout(() => {
          resolve();
          setIsLoading(false);
        }, 4000);
      });
    },
  };
}
