import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import { MenuBar, IMenuItem } from "./AppMenuBar";

import Paardensprong from "./Components/Paardensprong";
import Taartpunt from "./Components/Taartpunt";
import TwaalfLetterWoord from "./Components/TwaalfLetterWoord";
import Home from "./Components/Home";

import { v4 as uuidv4 } from "uuid";

const title = "2 voor 12 Oefenen";
const menuItems: IMenuItem[] = [
  {
    navigation: "/",
    title: "12-letterwoord",
    component: <Navigate to="/" />,
  },
  {
    navigation: "/paardensprong",
    title: "Paardensprong",
    component: <Paardensprong />,
  },
  {
    navigation: "/taartpunt",
    title: "Taartpunt",
    component: <Taartpunt />,
  },
];

function App() {
  const theme = createTheme();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MenuBar title={title} menuItems={menuItems} />
        <Routes>
          <Route path={"/"} element={<TwaalfLetterWoord />} />
          {menuItems.map((item: IMenuItem) => {
            return (
              <Route
                key={uuidv4()}
                path={item.navigation}
                element={item.component}
              />
            );
          })}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
