import React, { useEffect, useState } from "react";
import DestinationImage from "./DestinationImage";
import CONSTANTS from "../../constants";
import classes from "./ImageList.module.css";
import LoadingRing from "../../UI/LoadingRing";

const ImageList = (props) => {

    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const imageSearch = async (destination) => {

        try {
            const response = await fetch(CONSTANTS.apiURL + `/googleMaps?destination=${destination}`);
            const result = await response.json();
            setImages(result.content.imageUrls);
            setIsLoading(false);
        } catch (error) {
            console.log("Error occurred while calling API:", error);
        }
    };

    useEffect(() => {
        setIndex(0);
        setIsLoading(true);
        imageSearch(props.destination);
    }, [props.destination]);


    const data = images.map((image) => {
        
        return (
            <DestinationImage
                key={props.destination}
                id={props.destination}
                src={image}
                alt={props.destination}
            />);
    });

    const leftClickHandler = () => {

        if (index === 0) {
            return;
        }
        setIndex(index - 1);
    }

    const rightClickHandler = () => {

        if (index === data.length - 1) {
            return;
        }
        setIndex(index + 1);
    }

    return (
        <div className={classes.container}>
            <button
                className={`${classes.arrow}
                    ${classes.left}
                    ${index > 0 ? classes.nonempty : classes.empty}`
            }
                onClick={leftClickHandler}
            />
            {isLoading ? (
                <LoadingRing />
            ) : (
                <ul className={classes.ul}>{data[index]}</ul>
            )}
            <button
                className={`${classes.arrow}
                    ${classes.right}
                    ${index < data.length - 1 ? classes.nonempty : classes.empty}`
                }
                onClick={rightClickHandler}
            />

        </div>
    );
};

export default ImageList;