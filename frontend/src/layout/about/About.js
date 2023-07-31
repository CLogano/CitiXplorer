import React, { useState, useEffect, Fragment } from "react";
import classes from "./About.module.css";
import atlantaPicture from "../../pictures/atlanta-history.PNG";
import parisPicture from "../../pictures/paris-search.PNG";
import laSagradaFamiliaPicture from "../../pictures/la-sagrada-familia-description.PNG";


const About = () => {

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1500);

    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 1500);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);


    const p1 = "Are you ready to embark on your next adventure, but tired of juggling between Google Maps, TripAdvisor, Wikipedia, and a myriad of other sites to piece together your itinerary? Say hello to CitiXplorer!";
    const p2 = "Every city whispers tales of its past, tales that are intricately woven into its architecture, avenues, and landmarks. CitiXplorer offers highlights and captivating narratives through an all-inclusive directory of historical attractions tailored to any city you wish to explore.";
    const p3 = "Our entries for each attraction are not just informative but highly intuitive. We blend in relevant data from Google, including ratings, operational hours, and more, giving you a streamlined view of what to expect. Then we take it several steps further. Each entry is enriched with AI-crafted descriptions using ChatGPT revealing the attraction’s history, underlining compelling reasons to visit, and highlighting intriguing points of interest in the vicinity.";
    const p4 = "Don’t just visit the city - truly understand it. CitiXplorer crafts extensive summaries that unfurl the history of the city itself, offering you a holistic sense of the place.";
    const p5 = "With CitiXplorer, you're not just touring a city; you're delving into its past, understanding its character, and unearthing its charm. Planning your travel was never so immersive and effortless!";
 
    return (
        <div className={classes.container}>
            <div className={classes["image-container"]}>
                <div className={classes["image-text"]}>About Us</div>
            </div>
            <div className={classes["inner-container"]}>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading} style={{marginTop: "4rem"}}>Transforming Your Travel Experience</h1>
                    <p className={classes.paragraph}>{p1}</p>
                </div>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading}>Unveiling Historical Highlights</h1>
                    <div className={classes["inner-container-3"]}>
                        <img className={classes.picture} src={parisPicture} alt="paris"></img>
                        <p className={classes["right-paragraph"]}>{p2}</p>
                    </div>
                </div>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading}>Providing Insightful Narratives</h1>
                    <div className={classes["inner-container-3"]}>
                        {isSmallScreen ? 
                            <Fragment>
                                <img className={classes.picture} src={laSagradaFamiliaPicture} alt="laSagradaFamilia"></img>
                                <p className={classes["left-paragraph"]}>{p3}</p>
                            </Fragment> : 
                            <Fragment>
                                <p className={classes["left-paragraph"]}>{p3}</p>
                                <img className={classes.picture} src={laSagradaFamiliaPicture} alt="laSagradaFamilia"></img>
                            </Fragment>
                        }
                    </div>
                </div>
                <div className={classes["inner-container-2"]}>
                    <h1 className={classes.heading}>Embracing the City's Essence</h1>
                    <div className={classes["inner-container-3"]}>
                        <img className={classes.picture} src={atlantaPicture} alt="Atlanta"></img>
                        <p className={classes["right-paragraph"]}>{p4}</p>
                    </div>
                </div>
                <div className={classes["inner-container-2"]}>
                    <p className={classes.paragraph}>{p5}</p>
                </div>
                <p className={classes.notice}>Note: Some results may be inaccurate due to limitations imposed by ChatGPT.</p>
            </div>
        </div>

    );
};

export default About;