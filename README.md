# UW Kids Game

## Descripción

UW Kids Game es un juego educativo con generación por inteligencia artifical que combina preguntas temáticas con una experiencia de juego interactiva. Los jugadores seleccionan una temática y un nivel de dificultad, y progresan a través de niveles enfrentándose a preguntas cada vez más desafiantes.

Este proyecto está dividido en dos partes principales:
- **Backend**: Proporciona las preguntas mediante la API de gpt4o y lo expone mediante un controlador en Flask.
- **Frontend**: Implementa la interfaz de usuario y la lógica del juego.

## Tabla de Contenidos

- [UW Kids Game](#uw-kids-game)
  - [Descripción](#descripción)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Demo](#demo)
  - [Cómo Jugar](#cómo-jugar)
  - [Características](#características)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Instalación](#instalación)
    - [Prerrequisitos](#prerrequisitos)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [Uso](#uso)
    - [Backend](#backend-2)
    - [Frontend](#frontend-2)
  - [Configuración](#configuración)
    - [Variables de Entorno](#variables-de-entorno)
      - [Frontend](#frontend-3)
      - [Backend](#backend-3)
    - [Configuración del juego](#configuración-del-juego)
      - [Descripción de los Parámetros](#descripción-de-los-parámetros)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Demo

Puedes ver una demo del juego [aquí](https://uw-kids.vercel.app).

## Cómo Jugar

1. **Inicio del Juego:** Al iniciar el juego, se presentará una pantalla de configuración donde puedes seleccionar la temática del juego y el nivel de dificultad (1-10).

2. **Objetivo del Juego:** Responde correctamente a las preguntas para derrotar a los enemigos y avanzar a través de los niveles. Si respondes incorrectamente, perderás vidas.

3. **Niveles y Dificultad:** La dificultad de las preguntas aumentará con cada nivel. El objetivo es llegar al nivel final con la mayor cantidad de vidas posibles.

4. **Controles:**
   - **Movimiento del Personaje:** Utiliza las teclas **W**, **A**, **S** y **D** para mover al personaje:
     - **W:** Mover hacia adelante
     - **A:** Mover hacia la izquierda
     - **S:** Mover hacia atrás
     - **D:** Mover hacia la derecha
   - **Selección de Respuestas:** Utiliza el mouse para seleccionar las respuestas correctas.
   - **Música:** La música de fondo y los sonidos del juego se pueden controlar con el botón del altavoz, situado abajo a la derecha.

5. **Game Over:** Si pierdes todas tus vidas, aparecerá una pantalla de "Game Over" con la opción de volver a intentar el juego.



## Características

- Selección de temática y nivel de dificultad.
- Preguntas generadas dinámicamente con incremento de dificultad mediante openai.
- Música de fondo y efectos de sonido.
- Sistema de vidas y progreso.
- Interfaz amigable.

## Tecnologías Utilizadas

### Backend

- Python
- Flask
- flask_cors
- gunicorn
- openai
- python-dotenv
- langchain

### Frontend

- JavaScript
- Three.js
- Webpack
- GSAP (GreenSock Animation Platform)
- dotenv
- dat.gui

## Instalación

### Prerrequisitos

- Node.js y npm > 16 (https://nodejs.org/)
- Python 3.x (https://www.python.org/)

### Backend

1. Clona el repositorio y ves a la rama backend:
   ```sh
   git clone https://github.com/ojimenezjh/uw-kids.git
   git checkout backend
   ```
2. Crea un entorno virtual e instala las dependencias:
   ```sh
    python -m venv venv
    source venv/bin/activate  
    # En Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
3. Ejecuta el servidor:
   ```sh
   python api.py
   ```

### Frontend

1. Ves a la rama main:
    ```sh
   git checkout main
   ```
2. Instala las dependencias y ejecuta el servidor de desarrollo:
   ```sh
   npm install
   npm run dev
   ```

## Uso
### Backend
El backend se ejecutará en http://127.0.0.1:5000/. Asegúrate de tener el servidor en ejecución antes de iniciar el frontend.

### Frontend
El frontend se ejecutará en http://localhost:8080/. Abre esta URL en tu navegador para iniciar el juego.

## Configuración
### Variables de Entorno
#### Frontend
Crea un archivo .env en el directorio del frontend para configurar la url del backend: 
- **API_URL**=http://127.0.0.1:5000
#### Backend
Crea un archivo .env en el directorio del backend para configurar la api key de OpenAI: 
- **OPENAI_API_KEY**=apikey 
- Y el modelo de gpt que quieras utilizar ej: **OPENAI_MODEL**=gpt4o

### Configuración del juego
La configuración se maneja en el archivo config.js. Aquí puedes ajustar diferentes parámetros del juego.
#### Descripción de los Parámetros

- initialLives: Número inicial de vidas del jugador.
- numLevels: Número total de niveles en el juego.
- numEnemies: Número total de enemigos por nivel.
- maxDifficulty: Nivel máximo de dificultad.
- enemyOrder: Orden y tipo de enemigos en cada nivel.
  
# Contribuir
Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos para contribuir:

- Haz un fork del repositorio.
- Crea una nueva rama para frontend (git checkout -b feature/frontend/nueva-característica) o para backend (git checkout -b feature/backend/nueva-característica).
- Realiza los cambios necesarios y haz commit (git commit -am 'Agrega nueva característica').
- Sube los cambios a tu repositorio (git push origin feature/nueva-característica).
- Abre un Pull Request.

# Licencia
Este proyecto está bajo la Licencia MIT. Mira el archivo LICENSE para más detalles.