import { useEffect, useState } from 'react';

export default function useServerSide() {
  const [onServer, setOnServer] = useState(true);
  useEffect(() => setOnServer(false), []);

  return onServer;
}
