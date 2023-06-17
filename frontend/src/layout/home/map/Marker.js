import React, { useState, useEffect } from "react";
import classes from "./Marker.module.css"
import { OverlayView } from '@react-google-maps/api';

const Marker = (props) => {

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2),
    });

    const [isSelected, setIsSelected] = useState(props.selected);

    useEffect(() => {
        setIsSelected(props.selected);
    }, [props.selected]);

    
    const handleClick = () => {
        if (!isSelected) {
            onSelectedHandler();
        }
    };

    const onSelectedHandler = () => {
        setIsSelected(true);
        props.onSelected(props.id);
    };

    const { selected } = props;
    useEffect(() => {
        if (!selected) {
            setIsSelected(false);
        }
    }, [selected]);

    return (
        <OverlayView
            position={props.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
        >
            <span
                class={`material-icons ${classes.marker} ${isSelected ? classes.selected :
                    classes["selected-reverse"]}`}
                onClick={handleClick}
            >location_on
                <div className={classes.tooltip} >{props.name}</div>
            </span>
        </OverlayView>
    )
};

export default Marker;