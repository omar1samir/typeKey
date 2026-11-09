// selectors
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const restartButton = document.getElementById('restart-button');
const themeToggle = document.getElementById('theme-toggle');
const quoteModeButton = document.getElementById('quote-mode-button');
const timeModeButton = document.getElementById('time-mode-button');
const timeOptions = document.getElementById('time-options');
const timeButtons = document.querySelectorAll('.time-button');
const timerDisplay = document.getElementById('timer-display');

// storing the text and words in arrays
// the text array (quotes)
const TEXT_BANK = [
    'Small steps every day create remarkable results over time.',
    'The best way to learn is to practice with curiosity.',
    'A calm mind can solve problems with surprising clarity.',
    'Good design makes difficult things feel simple and natural.',
    'Every new skill begins with a single imperfect attempt.',
    'Rain tapped softly against the window throughout the afternoon.',
    'Kind words can brighten an ordinary day for someone nearby.',
    'The morning market was full of color, music, and warm bread.',
    'Keep your focus on progress rather than chasing perfection.',
    'A thoughtful question often opens the door to a better answer.',
    'Books turn quiet moments into journeys across time and place.',
    'Clear goals make it easier to decide what deserves your attention.',
    'The old bicycle carried us farther than we expected.',
    'Creativity grows when there is room to experiment and play.',
    'Strong habits are built by repeating small choices consistently.'
];

// the word array 
const WORD_BANK = [
    'about', 'after', 'again', 'against', 'almost', 'always', 'another', 'around',
    'because', 'before', 'begin', 'being', 'below', 'between', 'both', 'bring',
    'build', 'called', 'came', 'change', 'children', 'clear', 'close', 'common',
    'could', 'country', 'course', 'create', 'day', 'different', 'does', 'done',
    'down', 'each', 'early', 'earth', 'easy', 'enough', 'every', 'example',
    'face', 'family', 'far', 'feel', 'few', 'find', 'first', 'follow',
    'form', 'found', 'four', 'from', 'future', 'general', 'get', 'give',
    'go', 'good', 'great', 'group', 'grow', 'hand', 'happen', 'hard',
    'have', 'head', 'help', 'here', 'high', 'home', 'house', 'however',
    'idea', 'important', 'keep', 'kind', 'know', 'large', 'last', 'late',
    'learn', 'leave', 'less', 'letter', 'life', 'light', 'like', 'line',
    'little', 'long', 'look', 'made', 'make', 'many', 'mean', 'might',
    'more', 'most', 'move', 'much', 'must', 'name', 'near', 'need',
    'never', 'new', 'next', 'night', 'number', 'often', 'once', 'only',
    'open', 'order', 'other', 'over', 'part', 'place', 'point', 'possible',
    'power', 'problem', 'put', 'question', 'quick', 'quite', 'read', 'real',
    'really', 'right', 'same', 'say', 'school', 'second', 'seem', 'sentence',
    'several', 'should', 'show', 'side', 'small', 'something', 'sound', 'start',
    'state', 'still', 'story', 'strong', 'such', 'sure', 'take', 'talk',
    'tell', 'than', 'that', 'their', 'them', 'then', 'there', 'these',
    'thing', 'think', 'this', 'those', 'though', 'three', 'through', 'time',
    'together', 'too', 'under', 'until', 'use', 'usually', 'very', 'want',
    'water', 'well', 'where', 'which', 'while', 'whole', 'without', 'word',
    'work', 'world', 'would', 'write', 'year', 'young'
];

// storing the color classes, 
const COLOR_CLASSES = [
    'bg-green-500/20',
    'text-green-400',
    'bg-yellow-500/20',
    'text-yellow-400',
    'bg-red-500/20',
    'text-red-400'
];

// the state tracking variables
let textToType = '';
let currentIndex = 0;
let totalAttempts = 0;
let correctCount = 0;
let incorrectCount = 0;
let correctedCount = 0;
let startTime = null;
let timerId = null;
let isComplete = false;
let correctedIndices = new Set();
let gameMode = 'quote';
let timeLimit = 0;

function applySavedTheme() {
    // take the stored theme from localStorage
    const isLightMode = localStorage.getItem('theme') === 'light';
    document.body.classList.toggle('light-mode', isLightMode);
    themeToggle.textContent = isLightMode ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute(
        'aria-label',
        isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
    );
}

// fisher yates shuffle to make sure it's randomized (better than Math.random)
function fisherYatesShuffle(items) {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledItems[index], shuffledItems[randomIndex]] = [
            shuffledItems[randomIndex],
            shuffledItems[index]
        ];
    }

    return shuffledItems;
}

// choosing a random word from the word & sentence bank
function chooseSentence() {
    return fisherYatesShuffle(TEXT_BANK)[0];
}

function chooseWords(count) {
    return fisherYatesShuffle(WORD_BANK)
        .slice(0, count)
        .map((word) => word.trim());
}

// 
function createWordMarkup(words, startingIndex, includeLeadingSpace = false) {
    let characterIndex = startingIndex;
    const leadingSpaceMarkup = includeLeadingSpace
        ? `<span id="char-${characterIndex++}" class="char">&nbsp;</span>`
        : '';
    const wordsMarkup = words.map((word, wordIndex) => {
        const wordMarkup = [...word].map((character) => {
            const characterMarkup = `<span id="char-${characterIndex}" class="char">${character}</span>`;
            characterIndex += 1;
            return characterMarkup;
        }).join('');

        const separatorMarkup = wordIndex < words.length - 1
            ? `<span id="char-${characterIndex}" class="char">&nbsp;</span>`
            : '';
        characterIndex += wordIndex < words.length - 1 ? 1 : 0;

        return `<span class="inline-block whitespace-nowrap">${wordMarkup}</span>${separatorMarkup}`;
    }).join('');

    return {
        markup: leadingSpaceMarkup + wordsMarkup,
        nextIndex: characterIndex
    };
}

function initGame() {
    textDisplay.innerHTML = createWordMarkup(textToType.split(' '), 0).markup;
}

function appendWords() {
    const newWords = chooseWords(20);
    const markup = createWordMarkup(newWords, textToType.length, true);
    textToType += ` ${newWords.join(' ')}`;
    textDisplay.insertAdjacentHTML('beforeend', markup.markup);
}

function updateTimerDisplay() {
    timerDisplay.textContent = gameMode === 'time'
        ? `${timeLimit}s`
        : 'Quote';
}

// for changing the test mode 
function updateModeControls() {
    const isTimeMode = gameMode === 'time';
    timeOptions.classList.toggle('hidden', !isTimeMode);
    timeOptions.classList.toggle('flex', isTimeMode);
    quoteModeButton.classList.toggle('active', !isTimeMode);
    timeModeButton.classList.toggle('active', isTimeMode);
    timeButtons.forEach((button) => {
        button.classList.toggle('active', Number(button.dataset.timeLimit) === timeLimit);
    });
}

function startTimer() {
    if (startTime !== null) {
        return;
    }

    startTime = Date.now();
    if (gameMode === 'time') {
        timerId = window.setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds);
            timerDisplay.textContent = `${remainingSeconds}s`;

            if (remainingSeconds === 0) {
                finishTest();
            }
        }, 250);
    }
}

function getCharacter(index) {
    return document.getElementById(`char-${index}`);
}

function animateTypedCharacter(character) {
    character.classList.remove('scale-110');
    requestAnimationFrame(() => {
        character.classList.add('scale-110');
        window.setTimeout(() => character.classList.remove('scale-110'), 120);
    });
}

function updateCursor() {
    document.querySelectorAll('.cursor').forEach((span) => span.classList.remove('cursor'));

    if (!isComplete) {
        getCharacter(currentIndex)?.classList.add('cursor');
    }
}

function finishTest() {
    isComplete = true;
    window.clearInterval(timerId);
    timerId = null;
    typingInput.blur();

    const elapsedSeconds = startTime === null
        ? 0
        : Math.floor((Date.now() - startTime) / 1000);
    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = elapsedMinutes > 0
        ? Math.round(((correctCount + correctedCount) / 5) / elapsedMinutes)
        : 0;
    const accuracy = totalAttempts > 0
        ? Math.round(((correctCount + correctedCount) / totalAttempts) * 100)
        : 0;
    const results = {
        wpm,
        accuracy,
        totalTyped: totalAttempts,
        correctCount,
        incorrectCount,
        correctedCount,
        timeElapsed: elapsedSeconds
    };

    sessionStorage.setItem('testResults', JSON.stringify(results));
    window.location.href = 'stats.html';
}

function handleCharacter(typedCharacter) {
    if (isComplete || !typedCharacter) {
        return;
    }

    startTimer();

    const currentSpan = getCharacter(currentIndex);
    const expectedCharacter = textToType[currentIndex];
    totalAttempts += 1;

    if (typedCharacter === expectedCharacter) {
        const feedbackClasses = correctedIndices.has(currentIndex)
            ? ['bg-yellow-500/20', 'text-yellow-400']
            : ['bg-green-500/20', 'text-green-400'];
        currentSpan.classList.add(...feedbackClasses);
        if (correctedIndices.has(currentIndex)) {
            correctedCount += 1;
        } else {
            correctCount += 1;
        }
    } else {
        currentSpan.classList.add('bg-red-500/20', 'text-red-400');
        incorrectCount += 1;
    }
    animateTypedCharacter(currentSpan);

    currentIndex += 1;
    if (gameMode === 'time' && currentIndex >= textToType.length - 10) {
        appendWords();
    }

    if (gameMode === 'quote' && currentIndex === textToType.length) {
        finishTest();
    } else {
        updateCursor();
    }
}

function handleBackspace(event) {
    if (event.key !== 'Backspace' || currentIndex === 0 || isComplete) {
        return;
    }

    event.preventDefault();
    startTimer();
    currentIndex -= 1;

    const previousSpan = getCharacter(currentIndex);
    const wasCorrectOnFirstTry = previousSpan.classList.contains('text-green-400');
    const wasCorrectAfterMistake = previousSpan.classList.contains('text-yellow-400');
    if (previousSpan.classList.contains('text-red-400')) {
        correctedIndices.add(currentIndex);
    }
    previousSpan.classList.remove(...COLOR_CLASSES);
    previousSpan.classList.remove('scale-110');
    if (wasCorrectAfterMistake) {
        correctedCount -= 1;
    } else if (wasCorrectOnFirstTry) {
        correctCount -= 1;
    }
    totalAttempts = Math.max(0, totalAttempts - 1);
    updateCursor();
}

function resetGame() {
    window.clearInterval(timerId);
    gameMode = sessionStorage.getItem('gameMode') || 'quote';
    timeLimit = Number(sessionStorage.getItem('timeLimit') || 0);
    if (gameMode === 'time' && ![15, 30, 60].includes(timeLimit)) {
        timeLimit = 30;
        sessionStorage.setItem('timeLimit', String(timeLimit));
    }
    textToType = gameMode === 'time'
        ? chooseWords(50).join(' ')
        : chooseSentence();
    currentIndex = 0;
    totalAttempts = 0;
    correctCount = 0;
    incorrectCount = 0;
    correctedCount = 0;
    correctedIndices = new Set();
    startTime = null;
    timerId = null;
    isComplete = false;
    typingInput.value = '';
    updateTimerDisplay();
    updateModeControls();
    initGame();
    updateCursor();
    typingInput.focus();
}

typingInput.addEventListener('input', (event) => {
    // event.data is the character inserted by the browser.
    handleCharacter(event.data);
    typingInput.value = '';
});

typingInput.addEventListener('keydown', handleBackspace);
restartButton.addEventListener('click', resetGame);
quoteModeButton.addEventListener('click', () => {
    sessionStorage.setItem('gameMode', 'quote');
    resetGame();
});
timeModeButton.addEventListener('click', () => {
    sessionStorage.setItem('gameMode', 'time');
    if (!sessionStorage.getItem('timeLimit')) {
        sessionStorage.setItem('timeLimit', '30');
    }
    resetGame();
});
timeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        sessionStorage.setItem('gameMode', 'time');
        sessionStorage.setItem('timeLimit', button.dataset.timeLimit);
        resetGame();
    });
});
themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light-mode');
    // store the selected theme in localStorage
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    themeToggle.textContent = isLightMode ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute(
        'aria-label',
        isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
    );
});
document.addEventListener('click', () => typingInput.focus());

resetGame();
applySavedTheme();
