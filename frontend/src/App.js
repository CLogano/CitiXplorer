import React, { Fragment, useState } from "react";
import classes from "./App.module.css";
import Modal from "./UI/Modal";
import Header from "./layout/header/Header";
import Home from "./layout/home/Home";
import About from "./layout/about/About";
import Contact from "./layout/contact-us/Contact";
import { Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function App() {
  
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const pathLocation = useLocation();
  // const [clickedCity, setClickedCity] = useState(null);

  const cityHandler = (city) => {
    setCity(city);
    // mapUpdateRef.current.forceMapUpdate();
  };

  // const clickedCityHandler = (city) => {
  //   setCity(city);
  //   setClickedCity(city);
  // };

  const searchHandler = (value) => {
    setSearch(value);
  };

  const closeModalHandler = () => {
    setShowWelcomeModal(false);
 };

  return (
    <Fragment>
      {showWelcomeModal && pathLocation.pathname === "/" && <Modal onClose={closeModalHandler}>
                <div className={classes["welcome-container-outer"]}>
                    <div className={classes["welcome-container-inner"]}>
                        <h1 className={classes["welcome-header"]}>Welcome to CitiXplorer!</h1>
                        <span class={`material-symbols-rounded ${classes["city-icon"]}`}>apartment</span>
                    </div>
                    <p className={classes["welcome-description"]}>To get started, enter a city in the search bar or interact with the map to search for historical attractions!</p>
                </div>
      </Modal>}
      <Header searchHandler={searchHandler} cityHandler={cityHandler} city={city} />
      <Routes>
        <Route path="/" element={<Home cityHandler={cityHandler} city={city} search={search} searchHandler={searchHandler} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
      </Routes>
    </Fragment>
  );
}

export default App;