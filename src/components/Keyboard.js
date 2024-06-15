import Animation from "./Animation";
import Config from "./Config";

const KEYS = {
    "left": 65,
    "up": 87,
    "right": 68,
    "down": 83,
};

export default class Keyboard {
    constructor(domElement, animation, model) {
        this.domElement = domElement;
        this.animation = animation;
        this.model = model;

        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);

        // Mobile mode
        this.setupTouchControls();
    }

    setupTouchControls() {
        const buttonActions = {
            'up': 'moveForward',
            'down': 'moveBackward',
            'left': 'rotateLeft',
            'right': 'rotateRight',
        };

        for (let [direction, action] of Object.entries(buttonActions)) {
            const btn = document.querySelector(`.control-btn.${direction}`);
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                Config[action] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                Config[action] = false;
            });
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = false;
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
                Config.rotateRight = false;
                break;
            case KEYS.down:
                Config.moveBackward = false;
                break;
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = true;
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                Config.rotateRight = true;
                break;
            case KEYS.down:
                Config.moveBackward = true;
                break;
        }
    }
}
