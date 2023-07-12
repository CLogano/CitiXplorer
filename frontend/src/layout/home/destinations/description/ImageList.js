import React, { useEffect, useState } from "react";
import DestinationImage from "./DestinationImage";
// import CONSTANTS from "../../../../constants";
import classes from "./ImageList.module.css";
// import LoadingRing from "../../../../UI/LoadingRing";

const ImageList = (props) => {

    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);

    // const imageSearch = async (destination) => {

    //     try {
    //         const response = await fetch(CONSTANTS.apiURL + `/googleMaps/images?destination=${destination}&city=${destination.location}`);
    //         const result = await response.json();
    //         setImages(result.imageUrls || []);
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.log("Error occurred while calling API:", error);
    //     }
    // };

    const { destination } = props;
    useEffect(() => {
        setIndex(0);
        //setIsLoading(true);
        // imageSearch(props.destination);
        setImages(destination.imageUrls)
        
    }, [destination]);


    const data = images ?
        images.map((image) => {
            return (
                <li key={props.destination}>
                    <DestinationImage
                        id={props.destination}
                        src={image}
                        alt={props.destination}
                    />
                </li>
            );
        }) :
        null;

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
            {/* <button
                className={`${classes.arrow}
                    ${classes.left}
                    ${!isLoading && index > 0 ? classes.nonempty : classes.empty}`
            }
                onClick={leftClickHandler}
            /> */}
            <span class={`material-symbols-rounded ${classes.arrow} ${index > 0 ? classes.nonempty : classes.empty}`} onClick={leftClickHandler}>
                arrow_back_ios
            </span>
            {/* {isLoading ? (
                <LoadingRing className={classes.loading}/>
            ) : ( */}
            <ul className={classes.ul}>
                {data[index]}
            </ul>
            {/* )} */}
            {/* <button
                className={`${classes.arrow}
                    ${classes.right}
                    ${!isLoading && index < data.length - 1 ? classes.nonempty : classes.empty}`
                }
                onClick={rightClickHandler}
            /> */}
            <span class={`material-symbols-rounded ${classes.arrow} ${classes.right} ${index < data.length - 1 ? classes.nonempty : classes.empty}`} onClick={rightClickHandler}>
                arrow_back_ios
            </span>

        </div>
    );
};

export default ImageList;