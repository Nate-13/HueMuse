import React, { useState, useEffect } from 'react';

function MuseHeader() {
    const titleOptions = [
        "stars in the Milky Way",
        "drops of water in a thunderstorm",
        "steps walked in the past day",
        "games of chess played ever",
        "blinks in the past week",
        "human heartbeats in an hour",
        "photographs ever taken",
        "Google searches made",
        "emails sent this year",
        "cells in your body"
    ];

    const [title, setTitle] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let timeoutId;
        let typingIndex = 0;
        let deleting = false;

        const animateTitle = () => {
            const currentTitle = titleOptions[index];

            if (!deleting && typingIndex <= currentTitle.length) {
                // Typing characters
                setTitle(currentTitle.slice(0, typingIndex));
                typingIndex++;
                timeoutId = setTimeout(animateTitle, 50); // Typing speed
            } else if (deleting && typingIndex >= 0) {
                // Deleting characters
                setTitle(currentTitle.slice(0, typingIndex));
                typingIndex--;
                timeoutId = setTimeout(animateTitle, 30); // Deleting speed
            } else if (!deleting && typingIndex > currentTitle.length) {
                // Start deleting after a pause
                setTimeout(() => {
                    deleting = true;
                    animateTitle();
                }, 5000); // Pause before deleting
            } else if (deleting && typingIndex < 0) {
                // Move to the next title after deleting
                deleting = false;
                setIndex((prevIndex) => (prevIndex + 1) % titleOptions.length);
            }
        };

        animateTitle();

        return () => {
            clearTimeout(timeoutId); // Cleanup timeout to prevent memory leaks
        };
    }, [index]); // Re-run effect when the index changes

    return (
        <>
            
            <div className="header" id='header'>
            <div class="planet"></div>
            <div class="black-circle"></div>
            {/* <div className='name-box'>
                <span className='name h'>H</span>
                <span className='name u'>U</span>
                <span className='name e'>E</span>
                <span className='name m'>M</span>
                <span className='name u2'>U</span>
                <span className='name s'>S</span>
                <span className='name e2'>E</span>
            </div>   */}
                <div className='title-box'>
                    <h1 className="title">More color combinations than</h1>
                    <h1 className="title shift">{title}<span>.</span></h1>
                </div>
                <div>
                <div className='arrow-box'>
                <svg className='arrow-down' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
                </div>
                </div>
            </div>
        </>
        
    );
}

export default MuseHeader;