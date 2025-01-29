const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
let score = 0;
let grid = Array(16).fill(0);

// Initialize the game grid
function init() {
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        gridContainer.appendChild(tile);
    }
    generateTile();
    generateTile();
    updateDisplay();
}

// Generate a new tile
function generateTile() {
    const emptyTiles = grid.reduce((acc, val, idx) => {
        if (val === 0) acc.push(idx);
        return acc;
    }, []);
    
    if (emptyTiles.length > 0) {
        const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        updateDisplay();
    }
}

// Update the display based on the grid state
function updateDisplay() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const value = grid[index];
        tile.textContent = value || '';
        tile.className = 'tile' + (value ? ` tile-${value}` : '');
    });
    scoreDisplay.textContent = score;
}

// Handle keypress events
function handleKeyPress(event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveTiles('up');
            break;
        case 'ArrowDown':
            moved = moveTiles('down');
            break;
        case 'ArrowLeft':
            moved = moveTiles('left');
            break;
        case 'ArrowRight':
            moved = moveTiles('right');
            break;
    }
    if (moved) {
        generateTile();
        if (!canMove()) {
            alert('Game Over! Your score: ' + score);
        }
    }
}

// Check if any moves are possible
function canMove() {
    // Check for empty cells
    if (grid.includes(0)) return true;
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const current = grid[i * 4 + j];
            if (
                (j < 3 && current === grid[i * 4 + j + 1]) || // Check right
                (i < 3 && current === grid[(i + 1) * 4 + j])  // Check down
            ) {
                return true;
            }
        }
    }
    return false;
}

// Move tiles in specified direction
function moveTiles(direction) {
    let moved = false;
    const oldGrid = [...grid];

    if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < 4; row++) {
            const line = grid.slice(row * 4, row * 4 + 4);
            const merged = mergeLine(direction === 'left' ? line : line.reverse());
            if (direction === 'right') merged.reverse();
            merged.forEach((val, col) => {
                const newVal = grid[row * 4 + col] = val;
                if (newVal !== oldGrid[row * 4 + col]) moved = true;
            });
        }
    } else {
        for (let col = 0; col < 4; col++) {
            const line = [
                grid[col],
                grid[col + 4],
                grid[col + 8],
                grid[col + 12]
            ];
            const merged = mergeLine(direction === 'up' ? line : line.reverse());
            if (direction === 'down') merged.reverse();
            merged.forEach((val, row) => {
                const newVal = grid[row * 4 + col] = val;
                if (newVal !== oldGrid[row * 4 + col]) moved = true;
            });
        }
    }

    if (moved) {
        updateDisplay();
    }
    return moved;
}

// Merge line of tiles
function mergeLine(line) {
    // Remove zeros and merge identical adjacent numbers
    let result = line.filter(val => val !== 0);
    for (let i = 0; i < result.length - 1; i++) {
        if (result[i] === result[i + 1]) {
            result[i] *= 2;
            score += result[i];
            result.splice(i + 1, 1);
        }
    }
    // Pad with zeros
    while (result.length < 4) {
        result.push(0);
    }
    return result;
}

// Radio Player Implementation
const audioPlayer = document.getElementById('audio-player');
const stationSelect = document.getElementById('station-select');
const playPauseButton = document.getElementById('play-pause');
const volumeControl = document.getElementById('volume');

// Radio Browser API base URL
const RADIO_API_BASE = 'https://de1.api.radio-browser.info/json/stations/search';

// Fetch radio stations
async function fetchRadioStations() {
    try {
        const response = await fetch(`${RADIO_API_BASE}?limit=50&hidebroken=true&order=clickcount&reverse=true`);
        const stations = await response.json();
        
        // Clear existing options except the first one
        stationSelect.innerHTML = '<option value="">Select a Radio Station</option>';
        
        // Add stations to select
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.url;
            option.textContent = station.name;
            stationSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching radio stations:', error);
    }
}

// Initialize radio player
function initializeRadioPlayer() {
    fetchRadioStations();

    // Handle station selection
    stationSelect.addEventListener('change', () => {
        if (stationSelect.value) {
            audioPlayer.src = stationSelect.value;
            if (playPauseButton.textContent === 'Pause') {
                audioPlayer.play();
            }
        }
    });

    // Handle play/pause
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            if (stationSelect.value) {
                audioPlayer.play();
                playPauseButton.textContent = 'Pause';
            }
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    // Handle volume
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Handle errors
    audioPlayer.addEventListener('error', () => {
        console.error('Error playing station');
        playPauseButton.textContent = 'Play';
    });
}

// Initialize radio player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeRadioPlayer();
});

// Start the game
init();
document.addEventListener('keydown', handleKeyPress);
