import React from "react";

import "./styles.css";
import Grid from "@mui/material/Grid2";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

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
  | "z";

interface IPaardensprongTableProps {
  achtLetterWoord: Array<Char>;
}

function PaardensprongTable(props: IPaardensprongTableProps) {
  return (
    <table>
      <tbody>
        <tr>
          <td className="square">{props.achtLetterWoord[0]}</td>
          <td className="square">{props.achtLetterWoord[1]}</td>
          <td className="square">{props.achtLetterWoord[2]}</td>
        </tr>
        <tr>
          <td className="square">{props.achtLetterWoord[3]}</td>
          <td className="square center-piece">...</td>
          <td className="square">{props.achtLetterWoord[4]}</td>
        </tr>
        <tr>
          <td className="square">{props.achtLetterWoord[5]}</td>
          <td className="square">{props.achtLetterWoord[6]}</td>
          <td className="square">{props.achtLetterWoord[7]}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Paardensprong() {
  const achtLetterWoordScrambled = new Array<Char>(
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a"
  );

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid>
        <PaardensprongTable achtLetterWoord={achtLetterWoordScrambled} />
      </Grid>

      <Grid>
        <input></input>
      </Grid>
    </Grid>
  );
}
