import React, { useState, useEffect } from "react";
import classes from "./Marker.module.css"
import { OverlayViewF } from "@react-google-maps/api";
import { OverlayView } from "@react-google-maps/api";

const Marker = (props) => {

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
    });

    const { selected, onSelected, id, name, position, show } = props;

    const [isSelected, setIsSelected] = useState(selected);

    useEffect(() => {
        setIsSelected(selected);
    }, [selected]);

    const handleClick = () => {
        if (!isSelected) {
            setIsSelected(true);
            onSelected(id);
        }
    };
    
    useEffect(() => {
        if (!selected) {
            setIsSelected(false);
        }
    }, [selected]);

    return (
            <OverlayViewF
                position={position}
                mapPaneName={OverlayView.FLOAT_PANE}
                getPixelPositionOffset={getPixelPositionOffset}
            >
                <span
                    onClick={handleClick}
                    className={`material-icons
                        ${classes.marker}
                        ${show && classes.show}
                        ${isSelected ? classes.selected :
                            classes["selected-reverse"]}`
                    }
                >location_on
                <div className={classes.tooltip}>{name}</div>
                </span>
            </OverlayViewF>
    )
};

export default Marker;