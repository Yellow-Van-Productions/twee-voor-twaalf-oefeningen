import React, { useEffect, useRef, useState } from "react";

import "./styles.css";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { Char, toChar } from "../common/Character";
import CounterComponent, { CountingDirectiong } from "./CounterComponent";

const N_LETTERS = 8;

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
          <td className="square center-piece" />
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

  const scrambledWordArray = new Array<Char>(N_LETTERS);
  let index = CLOCK_WISE_PAARDENSPRONG.indexOf(startPosition);
  for (const letter of word) {
    scrambledWordArray[CLOCK_WISE_PAARDENSPRONG[index]] = toChar(letter);
    if (direction === Direction.ClockWise) {
      index++;
      if (index > N_LETTERS - 1) {
        index -= N_LETTERS;
      }
    } else {
      index--;
      if (index < 0) {
        index += N_LETTERS;
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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const answerTextFieldRef = useRef<any>();

  useEffect(() => {
    const loadDatabaseAsync = async () => {
      const fileContents = await fetch("achtletterwoorden.csv");
      const words = await fileContents.text();
      const listOfWords = words.split("\r\n");

      for (const word of listOfWords) {
        if (word.length !== N_LETTERS) {
          console.log("Error, word of incorrect length: " + word);
          return;
        }
      }

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
    const randomStartPosition = Math.floor(Math.random() * (N_LETTERS - 1));

    const newPuzzle = scrambleWord(
      randomDirection,
      randomWord,
      randomStartPosition
    );

    if (answerTextFieldRef.current) {
      answerTextFieldRef.current.value = "";
    }

    setIsAnswerCorrect(null);
    setPuzzle(newPuzzle);
  };

  const checkAnswer = () => {
    if (answerTextFieldRef && answerTextFieldRef.current && puzzle) {
      setIsAnswerCorrect(
        answerTextFieldRef.current.value.toLowerCase().trim() ===
          puzzle.word.toLowerCase().trim()
      );
    } else {
      setIsAnswerCorrect(null);
    }
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
        <CounterComponent
          countingDirection={CountingDirectiong.Up}
          isPaused={isAnswerCorrect !== null}
        />
      </Grid>

      <Grid>
        {puzzle ? (
          <PaardensprongTable achtLetterWoord={puzzle.scrambledWord} />
        ) : (
          <CircularProgress />
        )}
      </Grid>

      <Grid>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <TextField
            label="Antwoord"
            variant="outlined"
            inputRef={answerTextFieldRef}
          />
          <Button onClick={() => checkAnswer()} variant="contained">
            Check
          </Button>
          {isAnswerCorrect === null ? (
            <Box
              sx={{
                width: "32px",
                height: "32px",
              }}
            ></Box>
          ) : isAnswerCorrect ? (
            <CheckIcon
              sx={{
                width: "32px",
                height: "32px",
                color: "green",
              }}
            />
          ) : (
            <CloseIcon
              sx={{
                width: "32px",
                height: "32px",
                color: "red",
              }}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
