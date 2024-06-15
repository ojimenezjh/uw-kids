import './setup.css';
import './button.css';
import MusicManager from './components/MusicManager';

function setupMusic() {
    const playMusicOnInteraction = () => {
        if (!MusicManager.isPlaying) {
            MusicManager.playMenuMusic();
        }
        document.removeEventListener('keydown', playMusicOnInteraction);
        document.removeEventListener('mousedown', playMusicOnInteraction);

    };

    document.addEventListener('keydown', playMusicOnInteraction, { once: true });
    document.addEventListener('mousedown', playMusicOnInteraction, { once: true });
}   

setupMusic();

document.getElementById('setup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const gameMode = document.getElementById('game-mode').value;
    const gameLevel = document.getElementById('game-level').value;
    MusicManager.playBackgroundMusic();

    window.location.href = `index.html?mode=${gameMode}&level=${gameLevel}`;
});
