import game from '../assets/music/game.mp3';
import combat from '../assets/music/combat.mp3';
import menu from '../assets/music/menu.mp3';
import victory from '../assets/music/victory.mp3';
import gameOver from '../assets/music/gameOver.mp3';

import musicOnIcon from '../assets/soundOnBlack.png';
import musicOffIcon from '../assets/soundOffBlack.png';

class MusicManager {
    constructor() {
        this.backgroundMusic = new Audio(game);
        this.combatMusic = new Audio(combat);
        this.menuMusic = new Audio(menu);
        this.victoryMusic = new Audio(victory);
        this.gameOverMusic = new Audio(gameOver);
        this.isPlaying = false;

        this.currentMusic = this.menuMusic;
        this.currentMusic.loop = true;

        this.toggleMusicBtn = document.getElementById('toggle-music');
        this.toggleMusicBtn.addEventListener('click', () => {
            this.toggleMusic();
        });
    }

    async playMusic(music) {
        if (this.isPlaying) {
            await this.currentMusic.pause();
        }
    
        this.currentMusic = music;
        this.currentMusic.currentTime = 0;
        this.isPlaying = true;
        this.currentMusic.loop = true;
        try {
            await this.currentMusic.play();
        } catch (error) {
            console.error('Error playing music:', error);
        }
        this.updateToggleButton();
    }
    

    playMenuMusic() {
        this.playMusic(this.menuMusic);
    }

    playBackgroundMusic() {
        this.playMusic(this.backgroundMusic);
    }

    playCombatMusic() {
        this.playMusic(this.combatMusic);
    }

    playVictoryMusic() {
        this.playMusic(this.victoryMusic);
    }

    playGameOverMusic() {
        this.playMusic(this.gameOverMusic);
    }

    updateToggleButton() {
        if (this.toggleMusicBtn) {
            if (this.isPlaying) {
                this.toggleMusicBtn.src = musicOnIcon;
            } else {
                this.toggleMusicBtn.src = musicOffIcon;
            }
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.currentMusic.pause();
            this.isPlaying = false;
        } else {
            this.currentMusic.play();
            this.isPlaying = true;
        }
        this.updateToggleButton();
    }
}

const instance = new MusicManager();
export default instance;
