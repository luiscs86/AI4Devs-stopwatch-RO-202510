// Global variables
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;

let countdownInterval = null;
let countdownTime = 0;
let countdownRunning = false;
let inputValue = '';

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Stop any running timers when switching pages
    if (pageId !== 'stopwatch') {
        stopStopwatch();
    }
    if (pageId !== 'countdown') {
        stopCountdown();
    }
}

// Stopwatch functionality
function toggleStopwatch() {
    const startButton = document.getElementById('stopwatch-start');
    
    if (stopwatchRunning) {
        stopStopwatch();
        startButton.textContent = 'Continue';
    } else {
        startStopwatch();
        startButton.textContent = 'Stop';
    }
}

function startStopwatch() {
    stopwatchRunning = true;
    const startTime = Date.now() - stopwatchTime;
    
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 10);
}

function stopStopwatch() {
    stopwatchRunning = false;
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function clearStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
    document.getElementById('stopwatch-start').textContent = 'Start';
}

function updateStopwatchDisplay() {
    const totalSeconds = Math.floor(stopwatchTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((stopwatchTime % 1000) / 10);
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;
    const msString = milliseconds.toString().padStart(2, '0') + '0';
    
    document.getElementById('stopwatch-display').innerHTML = `
        ${timeString}
        <div class="milliseconds">${msString}</div>
    `;
}

// Countdown functionality
function addDigit(digit) {
    if (inputValue.length < 6) {
        inputValue += digit;
        updateInputDisplay();
    }
}

function clearInput() {
    inputValue = '';
    updateInputDisplay();
    stopCountdown();
    countdownTime = 0;
    updateCountdownDisplay();
}

function updateInputDisplay() {
    const display = document.getElementById('input-display');
    if (inputValue === '') {
        display.textContent = 'Enter time: ';
    } else {
        // Format as MMSSCC (minutes, seconds, centiseconds)
        const formatted = inputValue.padStart(6, '0');
        const minutes = formatted.substring(0, 2);
        const seconds = formatted.substring(2, 4);
        const centiseconds = formatted.substring(4, 6);
        display.textContent = `Enter time: ${minutes}:${seconds}:${centiseconds}`;
    }
}

function setCountdown() {
    if (inputValue === '') return;
    
    stopCountdown();
    
    // Parse input (MMSSCC format)
    const formatted = inputValue.padStart(6, '0');
    const minutes = parseInt(formatted.substring(0, 2));
    const seconds = parseInt(formatted.substring(2, 4));
    const centiseconds = parseInt(formatted.substring(4, 6));
    
    // Convert to total milliseconds
    countdownTime = (minutes * 60 + seconds) * 1000 + centiseconds * 10;
    
    if (countdownTime > 0) {
        startCountdown();
    }
    
    updateCountdownDisplay();
}

function startCountdown() {
    countdownRunning = true;
    
    countdownInterval = setInterval(() => {
        countdownTime -= 10;
        
        if (countdownTime <= 0) {
            countdownTime = 0;
            stopCountdown();
            alert('Time\'s up!');
        }
        
        updateCountdownDisplay();
    }, 10);
}

function stopCountdown() {
    countdownRunning = false;
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function updateCountdownDisplay() {
    const totalCentiseconds = Math.floor(countdownTime / 10);
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = totalCentiseconds % 100;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`;
    const msString = centiseconds.toString().padStart(2, '0') + '0';
    
    document.getElementById('countdown-display').innerHTML = `
        ${timeString}
        <div class="milliseconds">${msString}</div>
    `;
}

// Initialize displays
document.addEventListener('DOMContentLoaded', function() {
    updateStopwatchDisplay();
    updateCountdownDisplay();
    updateInputDisplay();
});