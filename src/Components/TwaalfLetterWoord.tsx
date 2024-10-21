import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { v4 as uuidv4 } from "uuid";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { useMediaQuery } from "react-responsive";
import { Char, toChar } from "../common/Character";
import CounterComponent, { CountingDirectiong } from "./CounterComponent";

const N_LETTERS = 12;

interface RaadLetter {
  letter: Char;
  riddleIndex: number;
  finalWordIndex: number;
  hidden: boolean;
  checked: boolean;
}

interface ITwaalfLetterWoordPuzzle {
  nLetters: number;
  letterArray: Array<RaadLetter>;
  word: string;
}

interface ITwaalfLetterWoordPuzzleProps {
  puzzle: ITwaalfLetterWoordPuzzle;
  onBuyingLetter: () => void;
}

function randomShuffle(array: any[]) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function newRandomTwaalfLetterPuzzle(
  word: string,
  bekendeLetters: number
): ITwaalfLetterWoordPuzzle {
  // Array: [0, 1, 2, 3, ...]
  const randomlyShuffledLetterArray = Array.from(Array(N_LETTERS).keys());
  randomShuffle(randomlyShuffledLetterArray);

  // Randomly hide some letters
  const randomlyShuffledBooleanArray = Array<boolean>(N_LETTERS);
  for (let index = 0; index < N_LETTERS - bekendeLetters; index++) {
    randomlyShuffledBooleanArray[index] = true;
  }
  randomShuffle(randomlyShuffledBooleanArray);

  let count = 0;
  const newArray = new Array<RaadLetter>(N_LETTERS);
  for (const letter of word) {
    newArray[count] = {
      letter: toChar(letter),
      riddleIndex: randomlyShuffledLetterArray[count],
      finalWordIndex: count,
      checked: false,
      hidden: randomlyShuffledBooleanArray[count],
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
  const isNarrowScreen = useMediaQuery({ query: "(max-width: 950px)" });

  useEffect(() => {
    setCurrentGameState(props.puzzle.letterArray);
  }, [props.puzzle]);

  const [currentGameState, setCurrentGameState] = useState<RaadLetter[]>([]);

  const sortedCurrentGameState = useMemo(() => {
    const sortedCurrentGameState = currentGameState.slice();
    sortedCurrentGameState.sort((a: RaadLetter, b: RaadLetter) => {
      return a.riddleIndex < b.riddleIndex
        ? -1
        : a.riddleIndex > b.riddleIndex
        ? 1
        : 0;
    });
    return sortedCurrentGameState;
  }, [currentGameState]);

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Table
          sx={{
            width: "auto",
          }}
        >
          <TableBody>
            <TableRow>
              {sortedCurrentGameState.map((letter: RaadLetter) => {
                return (
                  <TableCell
                    className={`tile-${isNarrowScreen ? "small" : "large"}`}
                    key={uuidv4()}
                    sx={{
                      borderBottom: "0px",
                      padding: "2px",
                    }}
                  >
                    <button
                      className={`tile-content-${
                        isNarrowScreen ? "small" : "large"
                      } active`}
                      onClick={() => {
                        if (letter.hidden || letter.checked) {
                          return;
                        }
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
                        props.onBuyingLetter();
                      }}
                    >
                      <Typography variant={isNarrowScreen ? "h6" : "h3"}>
                        {letter.hidden || letter.checked ? "" : letter.letter}
                      </Typography>
                    </button>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid size={12}>
        <Table
          sx={{
            width: "auto",
          }}
        >
          <TableBody>
            <TableRow>
              {currentGameState.map((letter: RaadLetter) => {
                return (
                  <TableCell
                    key={uuidv4()}
                    className={`tile-${isNarrowScreen ? "small" : "large"}`}
                    sx={{
                      borderBottom: "0px",
                      padding: "2px",
                    }}
                  >
                    <button
                      className={`tile-content-${
                        isNarrowScreen ? "small" : "large"
                      }`}
                    >
                      <Typography variant={isNarrowScreen ? "h6" : "h3"}>
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
  const PUZZLE_TIME_OUT = 120;
  const LETTER_COST = 10;
  const START_EURO_SCORE = 500;

  const [twelveLetterWordDatabase, setTwelveLetterWordDatabase] = useState<
    string[] | null
  >(null);
  const [puzzle, setPuzzle] = useState<ITwaalfLetterWoordPuzzle | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const answerTextFieldRef = useRef<any>();
  const [euroScore, setEuroScore] = useState<number>(START_EURO_SCORE);
  const [bekendeLetters, setBekendeLetters] = useState<number>(N_LETTERS);

  const buyLetter = () => {
    setEuroScore((previousScore: number) => {
      return previousScore - LETTER_COST;
    });
  };

  useEffect(() => {
    const loadDatabaseAsync = async () => {
      const fileContents = await fetch("twaalfletterwoorden.csv");
      const words = await fileContents.text();
      const listOfWords = words.split("\n").map((w) => w.trim());

      // verify contents:
      for (const word of listOfWords) {
        if (word.length !== N_LETTERS) {
          console.log("Error, word of incorrect length: " + word);
          return;
        }
      }

      setTwelveLetterWordDatabase(listOfWords);
    };

    loadDatabaseAsync();
  }, []);

  useEffect(() => {
    generateNewPuzzle(twelveLetterWordDatabase, bekendeLetters);
  }, [twelveLetterWordDatabase, bekendeLetters]);

  const generateNewPuzzle = (
    listOfWords: string[] | null,
    bekendeLetters: number
  ) => {
    if (!listOfWords || listOfWords.length === 0) {
      return;
    }

    const randomWord =
      listOfWords[Math.floor(Math.random() * listOfWords.length)];

    const newPuzzle = newRandomTwaalfLetterPuzzle(randomWord, bekendeLetters);

    if (answerTextFieldRef.current) {
      answerTextFieldRef.current.value = "";
    }

    setIsAnswerCorrect(null);
    setPuzzle(newPuzzle);
    setEuroScore(START_EURO_SCORE);
  };

  const onTimerTimerOut = useCallback(() => {
    setIsAnswerCorrect(false);
  }, []);

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
      <Grid
        size={12}
        sx={{
          textAlign: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            generateNewPuzzle(twelveLetterWordDatabase, bekendeLetters);
          }}
        >
          Nieuw 12-letterwoord
        </Button>
      </Grid>

      <Grid
        sx={{
          textAlign: "center",
        }}
      >
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
            }}
          >
            Score:
          </Typography>
          <Typography variant="h5">{`€${euroScore}`}</Typography>
        </Grid>
      </Grid>

      <Grid
        sx={{
          textAlign: "center",
        }}
      >
        <CounterComponent
          timeOutTimeSeconds={PUZZLE_TIME_OUT}
          onTimedOut={onTimerTimerOut}
          isPaused={isAnswerCorrect !== null}
          countingDirection={CountingDirectiong.Down}
        />
      </Grid>
      <Grid
        sx={{
          textAlign: "center",
        }}
      >
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
            }}
          >
            Bekende letters:
          </Typography>
          <Autocomplete
            disableClearable
            value={bekendeLetters}
            options={Array.from(Array(N_LETTERS + 1).keys())
              .reverse()
              .slice(0, 7)}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => {
              if (value) {
                setBekendeLetters(value);
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid
        sx={{
          textAlign: "-webkit-center",
        }}
      >
        {puzzle ? (
          <TwaalfLetterWoordPuzzle puzzle={puzzle} onBuyingLetter={buyLetter} />
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

        {isAnswerCorrect === false ? (
          <Typography>{puzzle?.word}</Typography>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
