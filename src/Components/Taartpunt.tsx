import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import CounterComponent, { CountingDirectiong } from "./CounterComponent";
import "./Taartpunt.scss";

const N_LETTERS = 9;

enum Direction {
  ClockWise,
  CounterClockwise,
}

interface ITaartPuntPuzzle {
  direction: Direction;
  startPosition: number;
  word: string;
  omittedIndex: number;
}

function TaartpuntLayout(props: { puzzle: ITaartPuntPuzzle }) {
  const { word, omittedIndex, startPosition, direction } = props.puzzle;
  let characters = word.split("");
  characters.splice(omittedIndex, 1, "?");
  characters = characters.map((_, i, a) => a[(i + startPosition) % a.length]);
  if (direction === Direction.CounterClockwise) {
    characters = characters.reverse();
  }

  return (
    <>
      <div className="puzzle">
        <ul className="taart">
          {characters.map((_, i) => (
            <li className="punt" key={i}>
              {" "}
            </li>
          ))}
        </ul>
        <div className="tvt">
          <h3>2V</h3>
          <h3>12</h3>
        </div>
        <div className="letters">
          {characters.map((char, i) => (
            <span key={i}> {char}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Taartpunt() {
  const [nineLetterWordDatabase, setNineLetterWordDatabase] = useState<
    string[] | null
  >(null);
  const [puzzle, setPuzzle] = useState<ITaartPuntPuzzle | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const answerTextFieldRef = useRef<any>();

  useEffect(() => {
    const loadDatabaseAsync = async () => {
      const fileContents = await fetch("negenletterwoorden.csv");
      const words = await fileContents.text();
      const listOfWords = words.split("\n").map((w) => w.trim());

      for (const word of listOfWords) {
        if (word.length !== N_LETTERS) {
          console.log("Error, word of incorrect length: " + word, word.length);
          return;
        }
      }

      setNineLetterWordDatabase(listOfWords);
    };

    loadDatabaseAsync();
  }, []);

  useEffect(() => {
    generateNewWord(nineLetterWordDatabase);
  }, [nineLetterWordDatabase]);

  const generateNewWord = (listOfWords: string[] | null) => {
    if (!listOfWords || listOfWords.length === 0) {
      return;
    }

    const randomWord =
      listOfWords[Math.floor(Math.random() * listOfWords.length)];
    const randomDirection =
      Math.random() < 0.5 ? Direction.ClockWise : Direction.CounterClockwise;
    const randomStartPosition = Math.floor(Math.random() * (N_LETTERS - 1));
    // Do not take the first or last letter as missing
    const omittedLetterPosition =
      1 + Math.floor(Math.random() * (randomWord.length - 2));

    const newPuzzle: ITaartPuntPuzzle = {
      word: randomWord,
      direction: randomDirection,
      startPosition: randomStartPosition,
      omittedIndex: omittedLetterPosition,
    };

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
            generateNewWord(nineLetterWordDatabase);
          }}
        >
          Nieuwe Taartpunt
        </Button>
      </Grid>

      <Grid>
        <CounterComponent
          countingDirection={CountingDirectiong.Up}
          isPaused={isAnswerCorrect !== null}
        />
      </Grid>

      <Grid>
        {puzzle ? <TaartpuntLayout puzzle={puzzle} /> : <CircularProgress />}
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
