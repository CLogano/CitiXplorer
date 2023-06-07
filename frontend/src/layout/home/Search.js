import React, { useEffect, useState } from "react";
import PromptBox from "./PromptBox";
import LocationInput from "./LocationInput";
import classes from "./Search.module.css";
import Card from "../../UI/Card";

//placeholder
const locationTerms = [
    {content: "Your Location"},
    {content: "Paris"},
    {content: "London"},
    {content: "Porto"},
    {content: "Atlanta"},
    {content: "Amsterdam"},
    {content: "Metz"},
    {content: "Brussels"},
    {content: "Munich"},
    {content: "Florence"},
    {content: "Rome"},
    {content: "Athens"},
    {content: "New York City"},
];
const topicTerms = [
    {content: "Hiking"},
    {content: "Shopping"},
    {content: "Clubs"},
    {content: "Attractions"},
    {content: "Bars"},
    {content: "Restaurants"},
    {content: "Audio Tours"},
    {content: "Coffee shops"},
    {content: "Ice Cream"},
    {content: "Islands"},
    {content: "Red Light District"},
    
    
];

// const locationReducer = (state, action) => {
//     if (action.type === "USER_INPUT") {
//       return { value: action.val, isValid: locationTerms.find(item => {
//             const searchTerm = action.val.toLowerCase();
//             const term = item.content.toLowerCase();
//             return term === searchTerm;
//         }) != null };
//     }
//     if (action.type === "INPUT_BLUR") {
//       return { value: state.value, isValid: locationTerms.find(item => {
//             const searchTerm = state.value.toLowerCase();
//             const term = item.content.toLowerCase();
//             return term === searchTerm;
//         }) != null };
//     }
//     return { value: "", isValid: false };
// };
// const topicReducer = (state, action) => {
//     if (action.type === "USER_INPUT") {
//       return { value: action.val, isValid: topicTerms.find(item => {
//             const searchTerm = action.val.toLowerCase();
//             const term = item.content.toLowerCase();
//             return term === searchTerm;
//         }) != null };
//     }
//     if (action.type === "INPUT_BLUR") {
//       return { value: state.value, isValid: topicTerms.find(item => {
//             const searchTerm = state.value.toLowerCase();
//             const term = item.content.toLowerCase();
//             return term === searchTerm;
//         }) != null };
//     }
//     return { value: "", isValid: false };
// };

const Search = (props) => {

    const [formIsValid, setFormIsValid] = useState(false);
    const [location, setLocation] = useState(null);
    const [prompt, setPrompt] = useState(null);

    // const [locationState, dispatchLocation] = useReducer(locationReducer, {
    //     value: "",
    //     isValid: null,
    // });
    // const [topicState, dispatchTopic] = useReducer(topicReducer, {
    //     value: "",
    //     isValid: null,
    // });

    // const locationChangeHandler = useCallback((text) => {
    //     dispatchLocation({ type: "USER_INPUT", val: text });
    // }, []);
    
    // const validateLocationHandler = useCallback(() => {
    //     dispatchLocation({ type: "INPUT_BLUR" });
    // }, []);
    
    // const topicChangeHandler = useCallback((text) => {
    //     dispatchTopic({ type: "USER_INPUT", val: text });
    // }, []);
    
    // const validateTopicHandler = useCallback(() => {
    //     dispatchTopic({ type: "INPUT_BLUR" });
    // }, []);

    // const locationRef = useRef();
    // const topicRef = useRef();

    // const { isValid: locationIsValid } = locationState;
    // const { isValid: topicIsValid } = topicState;

    // useEffect(() => {
    //     const identifier = setTimeout(() => {
    //       setFormIsValid(locationIsValid && topicIsValid);
    //     }, 500);
    
    //     return () => {
    //       clearTimeout(identifier);
    //     };
    // }, [locationIsValid, topicIsValid]);

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(location && prompt);
        }, 500);
            
        return () => {
            clearTimeout(identifier);
        };
    }, [location, prompt]);

     const onSubmitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            props.search(location, prompt);
        }
    };

    const locationHandler = (location) => {
        setLocation(location);
    };

    const promptHandler = (prompt) => {
        setPrompt(prompt)
    };

    return (
        <Card className={classes.container}>
            <form className={classes.form} onSubmit={onSubmitHandler} >
                <LocationInput
                    id="Location"
                    type="text"
                    placeholder="Location: New York City, NY, United States"
                    location={locationHandler}
                />
                {/* <SearchInput 
                ref={topicRef}
                id="Topic"
                type="text"
                placeholder="Topic" 
                searchTerms={topicTerms} 
                isValid={topicIsValid}
                input={topicChangeHandler}
                onBlur={validateTopicHandler}
            /> */}
                <PromptBox 
                    placeholder="Prompt: Please recommend me 10 Italian restaurants in the $20-$30 price range."
                    topicTerms={topicTerms}
                    prompt={promptHandler}
                />
                <button className={classes["search-button"]} type="submit">Search</button>
            </form>
        </Card>
    );
};

export default Search;