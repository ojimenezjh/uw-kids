import * as THREE from 'three';
import Map from "../Map";
import Enemy from "../enemies/Enemies";
import Block from "../Block";
import { getQuestions } from '../Questions';
import BackgroundCube from "../BackgroundCube";
import MainCharacter from "../MainCharacter";
import Wall from "../Wall";
import Light from "../Light";
import Animation from "../Animation";
import Keyboard from "../Keyboard";
import Camera from "../Camera";
import Config from '../Config';

class LevelManager {
    constructor(scene, manager, gui, gameMode, gameLevel, numLevels, numEnemies) {
        this.scene = scene;
        this.manager = manager;
        this.gui = gui;
        this.currentLevel = 1;
        this.gameMode = gameMode;
        this.gameLevel = gameLevel;
        this.numLevels = numLevels;
        this.numEnemies = Array(numEnemies).fill(false);
        this.questionsArray = [];
        this.blocks = [];
        this.enemies = [];
        this.heroModel = null;
        this.heroAnimation = null;
        this.keyboard = null;
        this.enemyModels = [];
        this.walls = [];
        this.light = null;
        this.cameraParameters = {
            playerCam: true
        };
        this.camera = null;
        this.playerCamera = null;

        this.enemyTypes = Config.enemyOrder;
    }

    async loadLevel(level) {
        if (level > this.numLevels) {
            console.log("Game completed!");
            return;
        }

        document.getElementById("loading-screen").style.visibility = "visible";

        this.clearScene();
        this.createCameras();

        // Load walls
        this.wallRight = new Wall();
        this.wallRight.setWall(-1.8);
        this.scene.add(this.wallRight);

        this.wallLeft = new Wall();
        this.wallLeft.setWall(1.8);
        this.scene.add(this.wallLeft);

        this.wallBack = new Wall();
        this.wallBack.backWall(-1.5);
        this.scene.add(this.wallBack);

        this.walls = [this.wallLeft, this.wallRight, this.wallBack];

        // Load light
        this.light = new Light(this.scene);

        // Load map
        this.map = new Map(this.scene, this.manager, this.gui);
        this.map.load();

        // Load background
        this.bg = new BackgroundCube(this.scene, this.manager);
        this.scene.add(this.bg);

        // Load hero
        this.mainCharacter = new MainCharacter(this.scene, this.manager, 0, 0.75, 0);
        this.mainCharacter.load();

        // Load blocks and enemies
        const enemyType = this.enemyTypes[level] || 'pirate';
        this.blocks = [];
        this.enemies = [];
        this.numEnemies = this.numEnemies;
        for (let i = 1; i <= this.numEnemies.length; i++) {
            const block = new Block(0, i * 15);
            this.scene.add(block);
            this.blocks.push(block);

            const enemy = new Enemy(this.scene, this.manager, enemyType, 0, 1, i * 15);
            enemy.load();
            this.enemies.push(enemy);
        }

        // Setup loading manager
        this.manager.onLoad =  async() => {
            this.heroModel = this.mainCharacter.animationData();
            this.heroAnimation = new Animation(this.heroModel);
            this.keyboard = new Keyboard(window, this.heroAnimation, this.heroModel);

            this.enemies.forEach(enemy => {
                const enemyModel = enemy.animationData();
                this.enemyModels.push(enemyModel);
                new Animation(enemyModel);
            });

            console.log("Level loaded.");
            this.questionsArray = await getQuestions(level, this.gameMode, this.gameLevel, this.numLevels);
            document.getElementById("loading-screen").style.visibility = "hidden";
        };
    }

    createCameras() {
        this.camera = new Camera(30, window.innerWidth / 2, window.innerHeight / 2);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.playerCamera = new Camera(30, window.innerWidth / 2, window.innerHeight / 2);
    }

    async clearScene() {

        if (this.mainCharacter) {
            this.mainCharacter.unload();
        }
        this.enemies.forEach(enemy => enemy.unload());

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.blocks = [];
        this.enemies = [];
        this.enemyModels = [];
    }

    async nextLevel() {
        this.currentLevel++;
        if (this.currentLevel <= this.numLevels) {
            this.loadLevel(this.currentLevel);
        } else {
            console.log("Game completed!");
        }
    }
}

export default LevelManager;
