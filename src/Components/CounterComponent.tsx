import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";

export enum CountingDirectiong {
  Up,
  Down,
}

interface ICountDownProps {
  timeOutTimeSeconds?: number;
  isPaused: boolean;
  countingDirection: CountingDirectiong;

  onTimedOut?: () => void;
}

export default function CounterComponent(props: ICountDownProps) {
  const [timeSeconds, setTimerSeconds] = useState<number>(
    props.timeOutTimeSeconds ?? 0
  );
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  const { onTimedOut, timeOutTimeSeconds, isPaused, countingDirection } = {
    ...props,
  };

  useEffect(() => {
    setTimerSeconds(props.timeOutTimeSeconds ?? 0);
  }, [props.timeOutTimeSeconds]);

  useEffect(() => {
    if (hasEnded && onTimedOut) {
      onTimedOut();
    } else if (!hasEnded && !isPaused) {
      setTimerSeconds(timeOutTimeSeconds ?? 0);
    }
  }, [hasEnded, timeOutTimeSeconds, onTimedOut, isPaused]);

  useEffect(() => {
    let timerInterval = setInterval(() => {
      setTimerSeconds((previousTime: number) => {
        if (
          previousTime === 0 &&
          countingDirection === CountingDirectiong.Down
        ) {
          clearInterval(timerInterval);

          setHasEnded(true);
          return 0;
        } else {
          switch (countingDirection) {
            case CountingDirectiong.Up:
              return previousTime + 1;
            case CountingDirectiong.Down:
            default:
              return previousTime - 1;
          }
        }
      });
    }, 1000);

    if (isPaused) {
      clearInterval(timerInterval);
    }

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [isPaused, countingDirection]);

  return (
    <Grid container direction="row" alignItems="center" spacing={1}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
      >
        Time:
      </Typography>
      <Typography variant="h5">{`${Math.floor(timeSeconds / 60)}:${
        timeSeconds % 60 < 10 ? "0" : ""
      }${timeSeconds % 60}`}</Typography>
    </Grid>
  );
}
