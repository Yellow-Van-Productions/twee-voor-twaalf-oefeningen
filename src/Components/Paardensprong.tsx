import React, { Suspense, useEffect, useMemo, useState } from "react";

import "./styles.css";
import Grid from "@mui/material/Grid2";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";

type Char =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "?";

function toChar(letter: string): Char {
  if (letter.length === 1) {
    return letter as Char;
  }
  return "?";
}

interface IPaardensprongTableProps {
  achtLetterWoord: Array<Char>;
}

function PaardensprongTable(props: IPaardensprongTableProps) {
  return props.achtLetterWoord ? (
    <table>
      <tbody>
        <tr>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[0]}</Typography>
          </td>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[1]}</Typography>
          </td>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[2]}</Typography>
          </td>
        </tr>
        <tr>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[3]}</Typography>
          </td>
          <td className="square center-piece"></td>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[4]}</Typography>
          </td>
        </tr>
        <tr>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[5]}</Typography>
          </td>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[6]}</Typography>
          </td>
          <td className="square">
            <Typography variant="h3">{props.achtLetterWoord[7]}</Typography>
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
    <></>
  );
}

enum Direction {
  ClockWise,
  CounterClockwise,
}

interface IPaardenSprongPuzzle {
  direction: Direction;
  startPosition: number;
  word: string;
  scrambledWord: Array<Char>;
}

function scrambleWord(
  direction: Direction,
  word: string,
  startPosition: number
): IPaardenSprongPuzzle {
  const CLOCK_WISE_PAARDENSPRONG = [0, 4, 5, 1, 7, 3, 2, 6];

  const scrambledWordArray = new Array<Char>(8);
  let index = CLOCK_WISE_PAARDENSPRONG.indexOf(startPosition);
  for (const letter of word) {
    scrambledWordArray[CLOCK_WISE_PAARDENSPRONG[index]] = toChar(letter);
    if (direction === Direction.ClockWise) {
      index++;
      if (index > 7) {
        index -= 8;
      }
    } else {
      index--;
      if (index < 0) {
        index += 8;
      }
    }
  }

  return {
    direction: direction,
    word: word,
    startPosition: startPosition,
    scrambledWord: scrambledWordArray,
  };
}

export default function Paardensprong() {
  const [eightLetterWordDatabase, setEightLetterWordDatabase] = useState<
    string[] | null
  >(null);
  const [puzzle, setPuzzle] = useState<IPaardenSprongPuzzle | null>(null);

  useEffect(() => {
    const loadDatabaseAsync = async () => {
      const fileContents = await fetch("achtletterwoorden.csv");
      const words = await fileContents.text();
      const listOfWords = words.split("\r");
      setEightLetterWordDatabase(listOfWords);
    };

    loadDatabaseAsync();
  }, []);

  useEffect(() => {
    generateNewWord(eightLetterWordDatabase);
  }, [eightLetterWordDatabase]);

  const generateNewWord = (listOfWords: string[] | null) => {
    if (!listOfWords || listOfWords.length === 0) {
      return;
    }

    const randomWord =
      listOfWords[Math.floor(Math.random() * listOfWords.length)];
    const randomDirection =
      Math.random() < 0.5 ? Direction.ClockWise : Direction.CounterClockwise;
    const randomStartPosition = Math.floor(Math.random() * 7);

    const newPuzzle = scrambleWord(
      randomDirection,
      randomWord,
      randomStartPosition
    );
    setPuzzle(newPuzzle);
  };

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
      margin={3}
    >
      <Grid>
        <Button
          variant="contained"
          onClick={() => {
            generateNewWord(eightLetterWordDatabase);
          }}
        >
          Nieuwe Paardensprong
        </Button>
      </Grid>
      <Grid>
        {puzzle ? (
          <PaardensprongTable achtLetterWoord={puzzle.scrambledWord} />
        ) : (
          <CircularProgress />
        )}
      </Grid>

      <Grid>
        <Grid container direction="row" spacing={1}>
          <TextField id="outlined-basic" label="Antwoord" variant="outlined" />
          <Button variant="contained">Check</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
