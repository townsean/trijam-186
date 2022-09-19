const NUMBER_OF_ROUNDS = 5;
const NUMBER_OF_GUESSES = 4;

let _mysteryCountries = [];
let _correctGuessCount = 0;

main();

/**
 * App starting point
 */
function main() {
    const startButton = document.getElementById('start-game-button');
    startButton.addEventListener('click', () => {
        const startScene = document.getElementById('start-scene');
        startScene.classList.add('hidden');

        startGame();
    });

    const restartButton = document.getElementById('restart-game-button');
    restartButton.addEventListener('click', () => {
        const restartScene = document.getElementById('end-scene');
        restartScene.classList.add('hidden');

        const startScene = document.getElementById('start-scene');
        startScene.classList.remove('hidden');
    });
}

/**
 * Start new game
 */
async function startGame() {
    const gameScene = document.getElementById('game-scene');
    gameScene.classList.remove('hidden');

    _mysteryCountries = await getRandomCountries(NUMBER_OF_ROUNDS);
    _correctGuessCount = 0;
    let round = 0;
        
    startRound(round, _mysteryCountries);
}

/**
 * Show endgame scene
 */
function endGame() {
    const gameScene = document.getElementById('game-scene');
    gameScene.classList.add('hidden');

    const correctGuessSpan = document.getElementById('correct-guesses-span');

    if(_correctGuessCount == 1) {
        correctGuessSpan.innerText = `${_correctGuessCount} country`;
    } else {
        correctGuessSpan.innerText = `${_correctGuessCount} countries`;
    }

    const endScene = document.getElementById('end-scene');
    endScene.classList.remove('hidden');
}

/**
 * 
 * @param {*} round 
 * @param {*} countries 
 */
function startRound(round, countries) {
    // End game if last round
    if(round == NUMBER_OF_ROUNDS) {
        endGame();
    }

    let guessCount = 0;
    let guesses = [];

    const roundTracker = document.getElementById("round-tracker");
    roundTracker.innerText = `${round + 1}/${NUMBER_OF_ROUNDS}`;

    generateAttemptTrackers(NUMBER_OF_GUESSES);

    updateGuess(guessCount, countries[round], true);

    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    const onGuessButtonClicked = () => {
        const isCorrectGuess = guessInput.value.toLowerCase() == countries[round].name.toLowerCase();
        const overlay = document.getElementById("figure-overlay");
        guesses.push(guessInput.value);

        // Clear previous input
        guessInput.value = "";
        guessInput.focus();

        // User guessed correctly, ending round
        if(isCorrectGuess) {
            _correctGuessCount++;

            updateAttemptTracker(guessCount + 1, true);
            updateOverlayInfo(guesses, true, true, countries[round].name);

            overlay.classList.remove("hidden");

            setTimeout(() => {
                overlay.classList.add("hidden");

                // correct guess, advance round
                guessButton.removeEventListener('click', onGuessButtonClicked);
                startRound(round + 1, _mysteryCountries);
            }, 3000);
        } else {
            // Show next image
            guessCount++;

            // User guessed incorrect, but more attempts are remaining
            // Make another guess attempt
            if(guessCount != NUMBER_OF_GUESSES) {
                updateGuess(guessCount, countries[round]);

                updateOverlayInfo(guesses, false, false, countries[round].name);

                overlay.classList.remove("hidden");

                setTimeout(() => {
                    overlay.classList.add("hidden");
                }, 2000);

            } else {
                // User guessed incorrectly, but no more attempts are remaining
                updateAttemptTracker(guessCount, false);
                updateOverlayInfo(guesses, false, true, countries[round].name);

                overlay.classList.remove("hidden");

                setTimeout(() => {
                    overlay.classList.add("hidden");

                    // Max number of guesses, move to the next round
                    guessButton.removeEventListener('click', onGuessButtonClicked);
                    startRound(round + 1, _mysteryCountries);
                }, 3000);
            }
        }
    };

    guessButton.addEventListener('click', onGuessButtonClicked);
}

/**
 * Update data on the guess info overlay
 * @param {*} guesses Previous guess
 * @param {*} isCurrentGuessCorrect Boolean indicating whether current guess is correct
 * @param {*} isEndOfRound Boolean indicating whether or not the round is over
 * @param {*} countryName Correct name of the country
 */
function updateOverlayInfo(guesses, isCurrentGuessCorrect, isEndOfRound, countryName) {
    const overlayCountryName = document.getElementById("overlay-country-name");
    if(isEndOfRound) {
        overlayCountryName.innerText = countryName;
    } else {
        overlayCountryName.innerText = "";
    }

    const overlayGuesses = document.getElementById("overlay-guesses");
    overlayGuesses.innerHTML = "";

    for(let x = 0; x < guesses.length; x++) {
        let li = document.createElement("li");

        if(guesses[x]) {
            li.innerText = guesses[x];
            li.style = "text-decoration: line-through;"
        } else {
            li.innerText = "skipped";
        }

        if(isCurrentGuessCorrect && x == guesses.length - 1) {
            li.style = "";
        }

        overlayGuesses.appendChild(li);
    }
}

/**
 * Update guess image state
 * @param {*} guessCount 
 * @param {*} country 
 */
function updateGuess(guessCount, country, isInitialGuess = false) {
    const countryImage = document.getElementById("country-image");
    countryImage.src = country.images[guessCount].assetUrl;

    const countryImageCaption = document.getElementById("country-image-caption");
    countryImageCaption.innerText = `Guess ${guessCount + 1}`;

    // Don't update tracker until first guess attempt
    if(!isInitialGuess) {
        updateAttemptTracker(guessCount, false);
    }
}

/**
 * Update guess attempt tracker to match guess state
 * @param {*} guessCount 
 * @param {*} isCorrect 
 */
function updateAttemptTracker(guessCount, isCorrect) {
    const attemptTracker = document.getElementById("attempt-tracker");

    // Subtract guess because this is for the previous guess, not current
    if(isCorrect && guessCount != 0) {
        attemptTracker.childNodes[guessCount - 1].classList.add("attempt-tracker--correct")
    } {
        attemptTracker.childNodes[guessCount - 1].classList.add("attempt-tracker--incorrect")
    }
}

/**
 * Generate guess indicators
 * @param {*} numberOfAttempts 
 */
function generateAttemptTrackers(numberOfAttempts) {
    const attemptTracker = document.getElementById("attempt-tracker");
    attemptTracker.innerHTML = "";

    for(let x = 0; x < numberOfAttempts; x++) {
        let tracker = document.createElement("div");
        tracker.classList.add("attempt-tracker");
        tracker.id = x + 1;

        attemptTracker.appendChild(tracker);
    }
}

/**
 * Gets an array containing the given number of countries
 * @param {number} count 
 * @returns Array of randomly selected countries
 */
async function getRandomCountries(count) {
    let randomCountries = [];
    let indexes = [];
    let countries = await getCountries();

    // Loop until {count} unique indexes are found
    while(indexes.length < count) {
        let index = getRandomInt(0, countries.length);

        if(indexes.includes(index)) {
            continue;
        } else {
            indexes.push(index);
        }
    }

    // Create array of countries based of array of indexes
    for(let index of indexes) {
        randomCountries.push(countries[index]);
    }

    return randomCountries;
}

/**
 * Gets an array of countries
 * @returns Array of countries
 */
async function getCountries() {
    let countries = [];
    try {
        const response = await fetch('scripts/countries.json');
        if(response.ok) {
            const data = await response.json();
            if(data) {
                countries = data.countries;
            }
        } else {
            throw response.statusText;
        }
    }
    catch (error) {
        console.error(error);
    } finally {
        return countries;
    }
}

/**
 * Gets a random number between min (inclusive) and max (exclusive)
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
 * @param {*} min Minimum number
 * @param {*} max Maximum number
 * @returns A random number between min and max
 */
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}