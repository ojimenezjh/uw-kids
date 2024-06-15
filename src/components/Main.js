import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Renderer from './Renderer';
import Config from './Config';
import { prepareData, generateAnswers, points, updateLives, lives } from './Questions';
import LevelManager from './levels/LevelManager';
import MusicManager from './MusicManager';

const progressBar = document.getElementById("progress-bar");
const quiz = document.getElementById("game");
const pointsDiv = document.getElementById("points");
const levelDiv = document.getElementById("levels");
const questionDiv = document.getElementById("question");
const answersDiv = document.getElementById("answers-div");
const continueButton = document.getElementById("continue");
const restartButton = document.getElementById("restart");

const numLevels = Config.numLevels;
const numEnemies = Config.numEnemies;
let move = false;
let enemiesDefeated = 0;
let endGame = false;
export default class Main {
    constructor(container, gameMode, gameLevel) {
        this.gui = new dat.GUI({ width: 300 });
        this.gui.domElement.style.zIndex = '100';
        this.gui.domElement.style.pointerEvents = 'auto';
        this.gui.hide();
        this.container = container;
        this.scene = new THREE.Scene();
        this.renderer = new Renderer(this.scene, container);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false;

        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.manager = new THREE.LoadingManager();

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        this.levelManager = new LevelManager(this.scene, this.manager, this.gui, gameMode, gameLevel, numLevels, numEnemies);
        this.levelManager.loadLevel(1);

        this.canMove = true;
        this.displayQuestion = true;
        this.vec = new THREE.Vector3();
        this.setupMusic();
        updateLives();
        this.render();
        
    }

    setupMusic() {
        const playMusicOnInteraction = () => {
            if (!MusicManager.isPlaying) {
                MusicManager.playBackgroundMusic();
            }
            document.removeEventListener('keydown', playMusicOnInteraction);
            document.removeEventListener('mousedown', playMusicOnInteraction);

        };
    
        document.addEventListener('keydown', playMusicOnInteraction, { once: true });
        document.addEventListener('mousedown', playMusicOnInteraction, { once: true });
    }    

    updateProgress() {
        const progress = (enemiesDefeated / this.levelManager.numEnemies.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    async fetchQuestions() {
        const question = await prepareData(this.levelManager.questionsArray, enemiesDefeated);
        quiz.style.visibility = "visible";
        generateAnswers(question, answersDiv, questionDiv, this.endQuestion.bind(this));
    }

    endQuestion(questionData) {
        if (enemiesDefeated < this.levelManager.numEnemies.length) {
            this.levelManager.numEnemies[enemiesDefeated] = true;
            enemiesDefeated++;
            this.updateProgress();
        }

        if (enemiesDefeated === this.levelManager.numEnemies.length) {
            move = true;
        }

        document.querySelectorAll(".answer").forEach(answerDiv => {
            const correctAnswer = answerDiv.innerText === questionData.correct;
            answerDiv.style.color = correctAnswer ? "green" : "red";
            answerDiv.style.pointerEvents = 'none';
        });

        window.setTimeout(() => {
            if (endGame == false && lives != 0) {
                MusicManager.playBackgroundMusic();
            }
            document.querySelectorAll(".answer").forEach(answerDiv => answerDiv.remove());
            quiz.style.visibility = "hidden";
            if (move) {
                this.canMove = true;
            }
        }, 1000);
    }

    async render() {
        this.stats.begin();
        pointsDiv.innerText = points;
        levelDiv.innerText = this.levelManager.currentLevel;
        const camVect = new THREE.Vector3(0, 5, -25);
        this.renderer.setViewport(0, 0, innerWidth, innerHeight);
        if (!this.levelManager.cameraParameters.playerCam) {
            this.renderer.render(this.scene, this.levelManager.camera);
        } else {
            this.renderer.render(this.scene, this.levelManager.playerCamera);
        }

        const elapsedTime = this.clock.getElapsedTime();

        if (this.levelManager.heroModel) {
            const camPos = camVect.applyMatrix4(this.levelManager.heroModel.scene.matrixWorld);
            this.levelManager.playerCamera.position.x = camPos.x;
            this.levelManager.playerCamera.position.y = 1.5;
            this.levelManager.playerCamera.position.z = camPos.z;
            this.camLook = this.levelManager.heroModel.scene.position;
            this.levelManager.playerCamera.lookAt(this.camLook.x, 1, this.camLook.z);

            this.levelManager.heroModel.scene.position.y = Math.sin(elapsedTime * 2) / 8 + 0.75;

            let ray = new THREE.Ray(this.levelManager.heroModel.scene.position, this.levelManager.heroModel.scene.getWorldDirection(this.vec));
            this.raycaster.ray = ray;

            this.levelManager.enemyModels.forEach(model => {
                model.scene.position.x = Math.sin(elapsedTime * 2) / 4;
            });

            this.intersects = this.raycaster.intersectObjects(this.levelManager.walls);
            if (this.intersects[0]) {
                let blocked = true;
                this.intersects.forEach(intersect => {
                    if (intersect.distance < 0.5) {
                        blocked = false;
                    }
                });
                if (blocked) {
                    this.canMove = true;
                } else {
                    this.canMove = false;
                }
            }

            this.monkeIntersects = this.raycaster.intersectObjects(this.levelManager.blocks);

            if (this.monkeIntersects[0]) {
                let blocked = true;
                this.monkeIntersects.forEach(intersect => {
                    if (intersect.distance < 1) {
                        if (this.displayQuestion) {
                            MusicManager.playCombatMusic();
                            this.displayQuestion = false;
                            quiz.style.visibility = "visible";
                            document.getElementById("loading-screen").style.visibility = "hidden";
                            this.fetchQuestions();
                        }
                        blocked = false;
                    }
                    if (blocked) {
                        this.canMove = true;
                    } else {
                        this.canMove = false;
                    }
                });
            }

            for (let i = 0; i < this.levelManager.numEnemies.length; i++) {
                if (enemiesDefeated === i + 1) {
                    if (this.returnMonke(i, this.levelManager.numEnemies[i], this.levelManager.enemyModels, this.levelManager.blocks)) {
                        this.displayQuestion = true;
                    }
                }
            }

            if (move) {
                this.canMove = true;
            }

            if (Config.rotateLeft) {
                this.levelManager.heroModel.scene.rotation.y += 0.01;
            }
            if (Config.rotateRight) {
                this.levelManager.heroModel.scene.rotation.y -= 0.01;
            }
            if (Config.moveForward && this.canMove) {
                this.levelManager.heroModel.scene.translateZ(0.075);
            }
            if (Config.moveBackward) {
                this.levelManager.heroModel.scene.translateZ(-0.05);
            }

            this.margin = this.levelManager.heroModel.scene.position.z / 160;

            if (this.levelManager.heroModel.scene.position.z < -1.5) {
                this.levelManager.heroModel.scene.position.z = 0;
            } else if (this.levelManager.numEnemies.length <= enemiesDefeated) {
                if (this.levelManager.currentLevel == this.levelManager.numLevels) {
                    endGame = true;
                    MusicManager.playVictoryMusic();
                    await this.endGame();
                } else {
                    document.getElementById("finish-screen").style.visibility = "visible";
                    await this.levelEnd();    
                }               
            }
        }
        this.stats.end();
        requestAnimationFrame(this.render.bind(this));
    }

    async endGame() {
        const endScreen = document.getElementById("end-screen");
        endScreen.style.visibility = "visible";

        const endStats = document.getElementById("end-stats");
        endStats.innerHTML = `¡Tú puntuación ha sido de ${points} puntos!`;

        await this.levelManager.clearScene();
        enemiesDefeated = 0;
        move = false;
        progressBar.style.width = "0%";
        restartButton.addEventListener("click", () => {
            setTimeout(() => {
                window.location.search = "";
            } , 1000);
        });
    }
    
    async levelEnd() {
        await this.levelManager.clearScene();
        await this.levelManager.nextLevel();
        enemiesDefeated = 0;
        move = false;
        progressBar.style.width = "0%";
        continueButton.addEventListener("click", () => {
            setTimeout(() => {
                document.getElementById("finish-screen").style.visibility = "hidden";
                this.displayQuestion = true;
            } , 1000);
        });
    }
        

    returnMonke(int, monkeDown, monkeModels, blocks) {
        if (monkeModels[int].scene.scale.y > 0 && monkeDown === true) {
            monkeModels[int].scene.position.y += 0.005;
            monkeModels[int].scene.scale.x -= 0.001;
            monkeModels[int].scene.scale.y -= 0.001;
            monkeModels[int].scene.scale.z -= 0.001;
            monkeModels[int].scene.rotation.y += 0.07;
            blocks[int].position.x -= 0.5;
            if (monkeModels[int].scene.scale.y <= 0) {
                return true;
            }
        }
        return false;
    }
}
