import './style.css';
import './button.css';
import Main from './components/Main';

function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(param => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
    });
    console.log(params, "params");
    return params;
}

function init() {
    const params = getQueryParams();
    const gameMode = params.mode;
    const gameLevel = params.level;

    if (!gameMode || !gameLevel) {
        alert("No se ha seleccionado el modo de juego o el nivel.");
        window.location.href = 'setup.html';
        return;
    }

    const container = document.getElementById('root');
    const main = new Main(container, gameMode, gameLevel);
}

init();
