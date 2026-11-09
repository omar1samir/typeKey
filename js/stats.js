const themeToggle = document.getElementById('theme-toggle');

function applySavedTheme() {
    const isLightMode = localStorage.getItem('theme') === 'light';
    document.body.classList.toggle('light-mode', isLightMode);
    themeToggle.textContent = isLightMode ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute(
        'aria-label',
        isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
    );
}

function displayResult(id, value) {
    document.getElementById(id).textContent = value;
}

let results = null;

try {
    results = JSON.parse(sessionStorage.getItem('testResults') || 'null');
} catch {
    console.error('The saved test results could not be read.');
}

if (results) {
    displayResult('wpm', results.wpm);
    displayResult('accuracy', `${results.accuracy}%`);
    displayResult('time', `${results.timeElapsed}s`);
    displayResult('total-typed', results.totalTyped);
    displayResult('correct-count', results.correctCount ?? 0);
    displayResult('incorrect-count', results.incorrectCount ?? 0);
    displayResult('corrected-count', results.correctedCount ?? 0);
} else {
    console.warn('No completed test results found.');
}

themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    themeToggle.textContent = isLightMode ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute(
        'aria-label',
        isLightMode ? 'Switch to dark mode' : 'Switch to light mode'
    );
});

applySavedTheme();
