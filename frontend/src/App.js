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

  const cityHandler = (city) => {
    setCity(city);
  };

  const searchHandler = (value) => {
    setSearch(value);
  };

  const closeModalHandler = () => {
    setShowWelcomeModal(false);
  };

 const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <Fragment>
      {isMobile ?
        <div className={classes["mobile-container"]}>
          <div className={classes.mobile}>Welcome to CitiXplorer! Mobile support is coming soon.</div>
        </div> :
        <Fragment>
          {showWelcomeModal && pathLocation.pathname === "/" && <Modal onClose={closeModalHandler}>
            <div className={classes["welcome-container-outer"]}>
              <div className={classes["welcome-container-inner"]}>
                <h1 className={classes["welcome-header"]}>Welcome to CitiXplorer!</h1>
                <span className={`material-symbols-rounded ${classes["city-icon"]}`}>apartment</span>
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
      }
    </Fragment>
  );
};

export default App;