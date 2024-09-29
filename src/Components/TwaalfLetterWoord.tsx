import React, { useEffect, useMemo, useRef, useState } from "react";

import Grid from "@mui/material/Grid2";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { Char, toChar } from "../common/Character";
import { nanoid } from "nanoid";

interface RaadLetter {
  letter: Char;
  riddleIndex: number;
  finalWordIndex: number;
  checked: boolean;
}

interface ITwaalfLetterWoordPuzzle {
  nLetters: number;
  letterArray: Array<RaadLetter>;
  word: string;
}

interface ITwaalfLetterWoordPuzzleProps {
  puzzle: ITwaalfLetterWoordPuzzle;
}

function randomShuffle(array: number[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function newRandomTwaalfLetterPuzzle(word: string): ITwaalfLetterWoordPuzzle {
  const randomlyShuffledArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  randomShuffle(randomlyShuffledArray);

  let count = 0;
  const newArray = new Array<RaadLetter>(12);
  for (const letter of word) {
    newArray[count] = {
      letter: toChar(letter),
      riddleIndex: randomlyShuffledArray[count],
      finalWordIndex: count,
      checked: false,
    };
    ++count;
  }

  return {
    word: word,
    letterArray: newArray,
    nLetters: 0,
  };
}

function TwaalfLetterWoordPuzzle(props: ITwaalfLetterWoordPuzzleProps) {
  const [currentGameState, setCurrentGameState] = useState<RaadLetter[]>([]);

  useEffect(() => {
    setCurrentGameState(props.puzzle.letterArray);
  }, [props.puzzle]);

  return (
    <Grid
      container
      spacing={3}
      sx={{
        justifyContent: "center",
      }}
    >
      <Grid>
        <Table>
          <TableBody>
            <TableRow>
              {currentGameState
                // @ts-ignore: toSorted does not exist yet?
                .toSorted((a: RaadLetter, b: RaadLetter) => {
                  return a.riddleIndex < b.riddleIndex
                    ? -1
                    : a.riddleIndex > b.riddleIndex
                    ? 1
                    : 0;
                })
                .map((letter: RaadLetter) => {
                  return (
                    <TableCell
                      className="tile"
                      key={nanoid()}
                      sx={{
                        borderBottom: "0px",
                        padding: "2px",
                      }}
                    >
                      <button
                        className="tile-content active"
                        onClick={() => {
                          setCurrentGameState(
                            currentGameState.map((oldLetter) => {
                              return oldLetter === letter
                                ? {
                                    ...letter,
                                    checked: true,
                                  }
                                : oldLetter;
                            })
                          );
                        }}
                      >
                        <Typography variant="h3">
                          {letter.checked ? "" : letter.letter}
                        </Typography>
                      </button>
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid>
        <Table>
          <TableBody>
            <TableRow>
              {currentGameState.map((letter: RaadLetter) => {
                return (
                  <TableCell
                    className="tile"
                    sx={{
                      borderBottom: "0px",
                      padding: "2px",
                    }}
                  >
                    <button className="tile-content" key={nanoid()}>
                      <Typography variant="h3">
                        {letter.checked ? letter.letter : "."}
                      </Typography>
                    </button>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}

export default function TwaalfLetterWoord() {
  const [twelveLetterWordDatabase, setTwelveLetterWordDatabase] = useState<
    string[] | null
  >(null);
  const [puzzle, setPuzzle] = useState<ITwaalfLetterWoordPuzzle | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const answerTextFieldRef = useRef<any>();
  const [timerTimeSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    const loadDatabaseAsync = async () => {
      const fileContents = await fetch("twaalfletterwoorden.csv");
      const words = await fileContents.text();
      const listOfWords = words.split("\r\n");
      setTwelveLetterWordDatabase(listOfWords);
    };

    loadDatabaseAsync();
  }, []);

  useEffect(() => {
    generateNewPuzzle(twelveLetterWordDatabase);
  }, [twelveLetterWordDatabase]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimerSeconds((prevTime: number) => {
        return prevTime + 1;
      });
    }, 1000);

    if (isAnswerCorrect) {
      clearInterval(timerInterval);
    }

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [isAnswerCorrect]);

  const generateNewPuzzle = (listOfWords: string[] | null) => {
    if (!listOfWords || listOfWords.length === 0) {
      return;
    }

    const randomWord =
      listOfWords[Math.floor(Math.random() * listOfWords.length)];

    const newPuzzle = newRandomTwaalfLetterPuzzle(randomWord);

    if (answerTextFieldRef.current) {
      answerTextFieldRef.current.value = "";
    }

    setIsAnswerCorrect(null);
    setPuzzle(newPuzzle);
    setTimerSeconds(0);
  };

  const checkAnswer = () => {
    if (answerTextFieldRef && answerTextFieldRef.current && puzzle) {
      setIsAnswerCorrect(answerTextFieldRef.current.value === puzzle.word);
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
            generateNewPuzzle(twelveLetterWordDatabase);
          }}
        >
          Nieuw 12-letterwoord
        </Button>
      </Grid>

      <Grid>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
            }}
          >
            Time:
          </Typography>
          <Typography variant="h5">{`${Math.floor(timerTimeSeconds / 60)}:${
            timerTimeSeconds % 60 < 10 ? "0" : ""
          }${timerTimeSeconds % 60}`}</Typography>
        </Grid>
      </Grid>
      <Grid>
        {puzzle ? (
          <TwaalfLetterWoordPuzzle puzzle={puzzle} />
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
