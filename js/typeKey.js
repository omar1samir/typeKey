const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');

const textToType = "This is a sample text for typing.";
let currentIndex = 0;

function startTest(){
    textDisplay.textContent = textToType.substring(0, currentIndex);
    typingInput.value = '';
    typingInput.focus();
}

function initGame() {
    currentIndex = 0;

    // Split the text into an array of characters
    const characters = textToType.split("");

    // Map over the characters to create HTML spans
    const spans = characters.map((char, index) => {
        // replace spaces with space code 
        let displayChar = char;
        if (char === " ") {
            displayChar = "&nbsp;";
        }

        // Return a span with a unique ID, a class, and the character inside
        return `<span id="char-${index}" class="char">${displayChar}</span>`;
    });

    // 3. Join the array of HTML strings back together and insert it
    textDisplay.innerHTML = spans.join("");
}

typingInput.addEventListener('input', () => {
    const typedText = typingInput.value;
    console.log(typedText);
    // ok now i want the program to compare the input with a string of text
    
    // if it is correct display it
    if (typedText === textToType.substring(0, typedText.length)) {
        
    }
    // if not do not display it 
    else {
        typingInput.value = typedText.slice(0, -1);
    }


T
});
// i want to make the input active to take inputs

initGame();
typingInput.focus();