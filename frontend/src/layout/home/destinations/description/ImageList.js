import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DestinationImage from "./DestinationImage";
import classes from "./ImageList.module.css";
import LoadingRing from "../../../../UI/LoadingRing";

const ImageList = (props) => {

    const [images, setImages] = useState([]);
    const [content, setContent] = useState(null);
    const [imagesLoaded, setImagesLoaded] = useState([]);
    const [index, setIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const { destination } = props;
    useEffect(() => {

        setIndex(0);
        setImages(destination.imageUrls)
        setImagesLoaded(Array(destination.imageUrls.length).fill(false));
        setContent(null);

    }, [destination]);

    useEffect(() => {

        const loadImages = async () => {
            let loadedImages = [];
            for (let i = 0; i < images.length; i++) {
                let img = new Image();
                img.src = images[i];
                await new Promise(r => img.onload=r);
                loadedImages.push(img);
                setImagesLoaded(prevState => {
                    let newState = [...prevState];
                    newState[i] = true;
                    return newState;
                });
            }
            return loadedImages;
        }

        const generateContent = () => {
            
            const newContent = images.map((image) => {
                return (
                    <li key={destination}>
                        <DestinationImage
                            id={destination}
                            src={image}
                            alt={destination}
                        />
                    </li>
                );
            });
            return newContent;
        }

        if (images && images.length > 0) {
            loadImages().then((loadedImages) => {
                setContent(generateContent(loadedImages));
            });
        }

    // eslint-disable-next-line
    }, [images]);

    const leftClickHandler = () => {

        if (index === 0) {
            return;
        }
        setIndex(index - 1);
    }

    const rightClickHandler = () => {

        if (index === content.length - 1) {
            return;
        }
        setIndex(index + 1);
    }

    const imageClickHandler = () => {
        setShowModal(true);
    };

    const closeModalHandler = () => {
        setShowModal(false);
    }

    return (
        <div className={classes.container}>
            {showModal && 
            ReactDOM.createPortal(
                (
                    <div className={classes.backdrop} onClick={closeModalHandler}>
                        <DestinationImage
                            id={destination}
                            src={images[index]}
                            alt={destination}
                            modalOpen={showModal}
                        />
                    </div>
                ),
                document.getElementById("modal-root")
            )}
            <span className={`material-symbols-rounded ${classes["arrow-left"]} ${index > 0 ? classes.nonempty : classes.empty}`} onClick={leftClickHandler}>
                arrow_back_ios
            </span>
            <ul className={classes.ul} onClick={imageClickHandler}>
                {!imagesLoaded[index] || !content ? <LoadingRing /> : content[index]}
            </ul>
            <span className={`material-symbols-rounded ${classes["arrow-right"]} ${classes.right} ${index < images.length - 1 ? classes.nonempty : classes.empty}`} onClick={rightClickHandler}>
                arrow_back_ios
            </span>
        </div>
    );
};

export default ImageList;