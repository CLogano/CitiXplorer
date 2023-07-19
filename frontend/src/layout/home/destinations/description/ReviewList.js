import React, { useState, useEffect } from "react";
import classes from "./ReviewList.module.css";

const ReviewList = (props) => {

    const [reviews, setReviews] = useState([]);
    const [index, setIndex] = useState(0);

    const { destination } = props;
    useEffect(() => {
        setIndex(0);
        setReviews(destination.reviews)
    }, [destination]);

    const data = reviews ? reviews.map((review) => {

        //Dynamic rating
        const filledStars = review.rating;
        const stars = (<div className={classes.stars}>

            {[...Array(5)].map((_, index) => {

                if (index < filledStars) {
                    return <span key={index} class={`material-icons ${classes["outer-star"]}`}>star</span>
                } else if (index >= filledStars) {
                    return (<span key={index} class={`material-icons ${classes["outer-star"]}`}>star
                        <span class={`material-icons ${classes["inner-star"]}`}>star</span>
                    </span>);
                }
                return null;
            })}
        </div>);

        return (
            <div key={review} className={classes["review-container-outer"]}>
                <div className={classes["review-container-inner"]}>
                    {stars}
                    <div className={classes.date}>
                        {review.relative_time_description}
                    </div>
                </div>
                <div className={classes.review}>{`"${review.text}"`}</div>
            </div>
        );
    }) : 
    null;

    const leftClickHandler = () => {

        if (index === 0) {
            return;
        }
        setIndex(index - 1);
    };

    const rightClickHandler = () => {

        if (index === data.length - 1) {
            return;
        }
        setIndex(index + 1);
    };

    return (
        <div className={classes.container}>
            <span class={`material-symbols-rounded ${classes.arrow} ${index > 0 ? classes.nonempty : classes.empty}`} onClick={leftClickHandler}>
                arrow_back_ios
            </span>
            {data[index]}
            <span class={`material-symbols-rounded ${classes.arrow} ${classes.right} ${index < data.length - 1 ? classes.nonempty : classes.empty}`} onClick={rightClickHandler}>
                arrow_back_ios
            </span>
        </div>
    )
};

export default ReviewList;