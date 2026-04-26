import { useEffect, useState } from 'react';

const currentClock = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export function useClock() {
  const [clock, setClock] = useState(currentClock);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(currentClock()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return clock;
}

