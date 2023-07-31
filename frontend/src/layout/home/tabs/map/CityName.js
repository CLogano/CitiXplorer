import React, { useState, useEffect } from "react";
import classes from "./CityName.module.css";
import { OverlayView } from "@react-google-maps/api";
import { OverlayViewF } from "@react-google-maps/api";

const CityName = React.memo((props) => {

    const { name, id, lat, lng, selected, onSelected } = props;
    const [isSelected, setIsSelected] = useState(selected);

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
    });

    useEffect(() => {
        setIsSelected(selected);
    }, [selected]);

    
    const handleClick = () => {
        if (!isSelected) {
            setIsSelected(true);
            onSelected(id);
        } else {
            // setIsSelected(false);
            // props.onSelected(null);
        }
    };

    useEffect(() => {
        if (!selected) {
            setIsSelected(false);
        }
    }, [selected]);

    return (
        <OverlayViewF
            position={{ lat: lat, lng: lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
        >
            <div className={`${classes.name} ${selected ? classes.selected : ""}`} onClick={handleClick}>
                {name}
            </div>
        </OverlayViewF>
    );
});

export default CityName;