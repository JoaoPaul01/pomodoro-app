import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  resetKey: number;
  initialValue: string;
  isActive: boolean;
  isPaused: boolean; // Novo estado para pausar
}

const TimerComponent: React.FC<TimerProps> = ({ initialValue, isActive, resetKey, isPaused }) => {
  const [time, setTime] = useState(initialValue);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTime(initialValue); // Reset time when resetKey changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear any existing interval
    }
  }, [resetKey, initialValue]);

  useEffect(() => {
    if (isActive && !isPaused) { // isso é para pausar quando a pessoa quiser 
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const { minutes, seconds } = stringToNumber(prevTime);
          let newMinutes = minutes;
          let newSeconds = seconds - 1;

          if (newSeconds < 0) {
            newMinutes--;
            newSeconds = 59;
          }

          if (newMinutes < 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return '00:00';
          }

          return `${addZeroToNumber(newMinutes)}:${addZeroToNumber(newSeconds)}`;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    } else if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isActive, isPaused]);

  return <div>{time}</div>;
};

function addZeroToNumber(number: number) {
  return number < 10 ? `0${number}` : `${number}`;
}

function stringToNumber(timeString: string) {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return { minutes, seconds };
}

export default TimerComponent;
