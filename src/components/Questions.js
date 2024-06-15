import MusicManager from './MusicManager';
import Config from './Config';
const apiUrl = process.env.API_URL;

let questionsArray = [];
export let lives = Config.initialLives;
export let points = 0;

const livesDiv = document.getElementById("lives-container");
const gameOverDiv = document.getElementById("game-over-screen");
const restartButton = document.getElementById("retry");

export async function getQuestions(level, gameMode, gameLevel, totalLevels) {
    
    const baseDifficulty = gameLevel;
    const maxDifficulty = Config.maxDifficulty * totalLevels;

    const difficulty = baseDifficulty * level * 10;

    console.log("Calculated difficulty for current level:", difficulty, "/", maxDifficulty);
    console.log("Fetching questions for level:", level);

        const response = await fetch(apiUrl + '/generate-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject: gameMode, difficulty: difficulty, maxDifficulty: maxDifficulty, numberQuestions: Config.numEnemies})
        });
        const data = await response.json();
        questionsArray = data;
    return questionsArray;
}


export function prepareData(array, enemiesDefeated) {
    if (enemiesDefeated < array.length) {

        const questionText = array[enemiesDefeated].question;
        const answers = array[enemiesDefeated].options.map(option => decodeHtml(option.text));
        const correctOption = array[enemiesDefeated].options.find(option => option.value === parseInt(array[enemiesDefeated].answer));
        const correct = correctOption ? decodeHtml(correctOption.text) : null;

        return { question: questionText, answers, correct };
    }
    return false;
}

export function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export function updateLives() {
    livesDiv.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement("div");
        heart.classList.add("life");
        livesDiv.appendChild(heart);
    }
}

export function resetGame() {
    gameOverDiv.style.visibility = 'hidden';
    window.location.reload();
}

export function generateAnswers(questionData, aDiv, qDiv, endQuestionCallback) {
    qDiv.innerHTML = questionData.question;
    if (questionData.answers && questionData.answers.length > 0) {
        questionData.answers.forEach(answer => {
            let div = document.createElement("div");
            div.classList.add("answer");
            div.innerText = answer;
            div.addEventListener("click", () => {
                endQuestionCallback(questionData);
                if (div.innerText === questionData.correct) {
                    points++;
                }
                else {
                    lives--;
                    updateLives();
                    if (lives <= 0) {
                        gameOverDiv.style.visibility = 'visible';
                        MusicManager.playGameOverMusic();
                        restartButton.addEventListener("click", resetGame);
                    }
                }
            });
            aDiv.append(div);
        });
    } else {
        console.error("No answers available for this question");
    }
}
