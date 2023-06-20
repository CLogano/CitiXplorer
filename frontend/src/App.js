import React, { Fragment } from "react";
import Home from "./layout/home/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Fragment>
  );
}

export default App;