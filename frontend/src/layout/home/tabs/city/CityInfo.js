import React, { useEffect, useState } from "react";
import classes from "./CityInfo.module.css";
import LoadingRing from "../../../../UI/LoadingRing";

const CityInfo = (props) => {

    const [content, setContent] = useState(<LoadingRing className={classes.loading} />);

    const { cityData } = props;

    useEffect(() => {

        const loadImages = async () => {
            let loadedImages = [];
            for (let i = 0; i < cityData.images.length; i++) {
                let img = new Image();
                img.src = cityData.images[i];
                await new Promise(r => img.onload=r);
                loadedImages.push(img);
            }
            return loadedImages;
        }

        const generateContent = (loadedImages) => {
            const newContent = [...Array(cityData.paragraphs.length)].map((_, index) => {
                if (index % 2 === 0) {
                    return (
                        <div className={classes["inner-container"]}>
                            <img className={classes.image} src={loadedImages[index].src} />
                            <p className={classes["right-paragraph"]}>{cityData.paragraphs[index]}</p>
                        </div>
                    );
                } else {
                    return (
                        <div className={classes["inner-container"]}>
                            <p className={classes["left-paragraph"]}>{cityData.paragraphs[index]}</p>
                            <img className={classes.image} src={loadedImages[index].src} />
                        </div>
                    )
                }
            });
            return newContent;
        }

        loadImages().then((loadedImages) => {
            setContent(generateContent(loadedImages));
        });

    }, [cityData]);

    return (
        <div className={classes.container}>
            <div className={classes.name}>{cityData.name}</div>
            {content}
        </div>
    );
};

export default CityInfo;