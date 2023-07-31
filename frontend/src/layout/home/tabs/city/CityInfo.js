import React, { useEffect, useState } from "react";
import classes from "./CityInfo.module.css";
import LoadingRing from "../../../../UI/LoadingRing";

const CityInfo = (props) => {

    const [content, setContent] = useState(<LoadingRing className={classes.loading} />);
    const [loadedImages, setLoadedImages] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
    
    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const { cityData } = props;

    useEffect(() => {
        const loadImages = async () => {
            let images = [];
            for (let i = 0; i < cityData.images.length; i++) {
                let img = new Image();
                img.src = cityData.images[i];
                await new Promise(r => img.onload = r);
                images.push(img);
            }
            setLoadedImages(images);
        }
        loadImages();
    }, [cityData]);

    useEffect(() => {
        const generateContent = () => {
            const newContent = [...Array(cityData.paragraphs.length)].map((_, index) => {
    
                if (!isSmallScreen) {
                    if (index % 2 === 0) {
                        return (
                            <div className={classes["inner-container"]} key={index}>
                                <img className={classes.image} src={loadedImages[index]?.src} />
                                <p className={classes["right-paragraph"]}>{cityData.paragraphs[index]}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div className={classes["inner-container"]} key={index}>
                                <p className={classes["left-paragraph"]}>{cityData.paragraphs[index]}</p>
                                <img className={classes.image} src={loadedImages[index]?.src} />
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className={classes["inner-container-2"]} key={index}>
                            <img className={classes.image} src={loadedImages[index]?.src} />
                            <p className={classes.paragraph}>{cityData.paragraphs[index]}</p>
                        </div>
                    );
                }
    
            });
            setContent(newContent);
        };

        if (loadedImages.length === cityData.images.length) {
            generateContent();
        }

    }, [cityData, isSmallScreen, loadedImages])

    return (
        <div className={classes.container}>
            <div className={classes.name}>{cityData.name}</div>
            {content}
        </div>
    );
};

export default CityInfo;