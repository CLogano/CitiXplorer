import React, { useState, useEffect } from "react";
import { generateDestinationDetailPrompt } from "../../../../prompts";
import CONSTANTS from "../../../../constants";
import classes from "./Details.module.css";

const TypingAnimation = (props) => {

    const [content, setContent] = useState("");
    const [currentParagraph, setCurrentParagraph] = useState(0);
    const [doneTyping, setDoneTyping] = useState(false);
  
    const { text } = props;
    useEffect(() => {

      if (text.length > 0 && currentParagraph < text.length) {

        
          
          let shouldCancel = false;
          let paragraph = text[currentParagraph];

          const addLetter = async (index) => {
            if (index < paragraph.length && !shouldCancel) {

              setContent((prev) => prev + paragraph.charAt(index));
              await new Promise((resolve) => setTimeout(resolve, 20));
              addLetter(index + 1);

            } else if (!shouldCancel && currentParagraph < text.length - 1) {

              setCurrentParagraph(prev => prev + 1);
              setContent("");
            } else if (!shouldCancel) {
              setDoneTyping(true);
          }
          };
    
          addLetter(0);
    
        return () => {
          shouldCancel = true; // If the component is unmounted, stop the asynchronous operation
        };
        
      }
      
    }, [text, currentParagraph]);

    return (
      <div>
        {text.slice(0, currentParagraph).map((paragraph, index) => (
          <p key={index}>{paragraph}</p> // Display typed paragraphs
        ))}
        <span className={classes.text}>{content}</span>
        {!doneTyping && <span className={classes.cursor} />}
      </div>
    );
};

const Details = (props) => {

  const [text, setText] = useState(props.text ? props.text : []);


  const { name, location } = props.destination;
  useEffect(() => {

    async function fetchDetails(destinationName, location) {

        const textInput = generateDestinationDetailPrompt(destinationName, location);
        console.log(textInput)
        const textInputJSON = {
          content: textInput
        };

        try {

          const response = await fetch(CONSTANTS.apiURL + "/gpt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(textInputJSON),
          });

          const result = await response.json();
          console.log(result.data);

          if (result.data) {
            const paragraphs = result.data.split('\n');
            setText(paragraphs);
          }

        } catch (error) {
          console.log("Error occurred while calling API:", error);
        }

    }

    fetchDetails(name, location);
  }, [name, location]);

    return (
        <div className={classes.container}>
            <TypingAnimation text={text}/>
        </div>
    );
};

export default Details;