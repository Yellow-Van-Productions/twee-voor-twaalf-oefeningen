import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import { MenuBar, IMenuItem } from "./AppMenuBar";

import Paardensprong from "./Components/Paardensprong";
import Taartpunt from "./Components/Taartpunt";
import TwaalfLetterWoord from "./Components/TwaalfLetterWoord";
import Home from "./Components/Home";
import { nanoid } from "nanoid";

const title = "2 voor 12 Oefeningen";
const menuItems: IMenuItem[] = [
  {
    navigation: "/twaalf-letter-woord",
    title: "12-letterwoord",
    component: <TwaalfLetterWoord />,
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
          <Route path="/" element={<Home />} />
          {menuItems.map((item: IMenuItem) => {
            return (
              <Route
                key={nanoid()}
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
