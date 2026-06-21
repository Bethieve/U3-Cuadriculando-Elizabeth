// ==========================================================================
// scriptazul.js - MINIJUEGO LINTERNA GEOMÉTRICA (CUADRADO AZUL DINÁMICO)
// ==========================================================================
const capaNegra = document.getElementById('capa-negra');
const rejilla = document.getElementById('tablero-rejilla');
const mensajeFinal = document.getElementById('mensaje-oculto-final');
const botonRegresar = document.getElementById('boton-regresar-tablero');

let contadorClics = 0;
const MAX_INTENTOS = 6;
let juegoTerminado = false; 

// 1. Inicializa la estructura física de la cuadrícula oculta
function inicializarTableroEstructural() {
    if (!rejilla) return;
    rejilla.innerHTML = '';

    const anchoRejilla = rejilla.clientWidth;
    const altoRejilla = rejilla.clientHeight;
    const tamanoCuadro = 50; 

    const columnasCalculadas = Math.floor(anchoRejilla / tamanoCuadro);
    const filasCalculadas = Math.floor(altoRejilla / tamanoCuadro);
    const totalCasillasDinamicas = columnasCalculadas * filasCalculadas;

    for (let i = 0; i < totalCasillasDinamicas; i++) {
        const casilla = document.createElement('div');
        casilla.classList.add('casilla-secreta');
        rejilla.appendChild(casilla);
    }
}

// 2. Mueve el cuadrado azul a una posición aleatoria y le asigna el evento de clic
function moverObjetivo() {
    if (!rejilla || juegoTerminado) return;
    
    // Buscamos y limpiamos por completo el cuadrado azul anterior
    const objetivoActual = document.querySelector('.cuadrado-azul');
    if (objetivoActual) {
        objetivoActual.classList.remove('cuadrado-azul');
        objetivoActual.removeEventListener('click', gestionarClicObjetivo);
    }

    // Filtramos las casillas de la cuadrícula para elegir una nueva
    const casillasDisponibles = rejilla.querySelectorAll('.casilla-secreta');
    if (casillasDisponibles.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
        const nuevoObjetivo = casillasDisponibles[indiceAleatorio];
        
        // Activamos el cuadrado azul en su nueva posición
        nuevoObjetivo.classList.add('cuadrado-azul');
        nuevoObjetivo.addEventListener('click', gestionarClicObjetivo);
    }
}

// 3. Maneja el contador de clics consecutivos y el cambio de lugar
function gestionarClicObjetivo(e) {
    e.preventDefault();
    e.stopPropagation();
    
    contadorClics++; // Suma el clic actual
    
    if (contadorClics < MAX_INTENTOS) {
        // Si no ha llegado a 6, se mueve a otro lugar consecutivamente
        moverObjetivo();
    } else {
        // Al llegar exactamente al sexto clic, se detona el final rápido
        ejecutarSecuenciaFinal(this);
    }
}

// ==========================================================================
// 4. NUEVA SECUENCIA FINAL: IMPLOSIÓN EN VÓRTICE REVELANDO LO OCULTO
// ==========================================================================
function ejecutarSecuenciaFinal(elementoObjetivo) {
    juegoTerminado = true; 
    
    // Obtenemos las coordenadas del último clic para que la implosión ocurra justo ahí
    const rectObjetivo = elementoObjetivo.getBoundingClientRect();
    const rectRejilla = rejilla.getBoundingClientRect();
    
    // Centro del objetivo relativo a la rejilla
    const centroX = (rectObjetivo.left + rectObjetivo.width / 2) - rectRejilla.left;
    const centroY = (rectObjetivo.top + rectObjetivo.height / 2) - rectRejilla.top;

    // Removemos el objetivo y su evento para congelar el juego
    elementoObjetivo.classList.remove('cuadrado-azul');
    elementoObjetivo.removeEventListener('click', gestionarClicObjetivo);
    
    // Cambios visuales de atmósfera en el contenedor
    document.body.classList.add('modo-implosion-final');
    if (rejilla) rejilla.classList.add('rejilla-vortice');

    // Desaparece por completo la máscara de la linterna para que se vea toda la escena
    if (capaNegra) {
        capaNegra.style.display = 'none'; 
    }

    // IMPLOSIÓN HACIA EL PUNTO DE ORIGEN (Efecto "Succión de lo Oculto")
    const todasLasCasillas = rejilla.querySelectorAll('.casilla-secreta');
    todasLasCasillas.forEach((casilla) => {
        const rectCasilla = casilla.getBoundingClientRect();
        const casillaCentroX = (rectCasilla.left + rectCasilla.width / 2) - rectRejilla.left;
        const casillaCentroY = (rectCasilla.top + rectCasilla.height / 2) - rectRejilla.top;

        // Calculamos la distancia y dirección hacia el epicentro del último clic
        const distanciaX = centroX - casillaCentroX;
        const distanciaY = centroY - casillaCentroY;

        // Le damos un retraso aleatorio muy corto a cada cuadro para que la succión sea orgánica
        const retrasoAleatorio = Math.random() * 500; 

        setTimeout(() => {
            casilla.style.transition = "all    1.5s cubic-bezier(0.25, 1, 0.5, 1)";
            casilla.style.opacity = "0";
            // Viajan hacia el centro del clic, rotan sobre su eje y se encogen a 0
            casilla.style.transform = `translate(${distanciaX}px, ${distanciaY}px) scale(0) rotate(180deg)`;
        }, retrasoAleatorio);
    });

    // Muestra el mensaje de éxito y el botón cuando el "agujero negro" se cierre
    setTimeout(() => {
        if (mensajeFinal) {
            mensajeFinal.style.display = 'block';
            setTimeout(() => { mensajeFinal.classList.add('mostrar'); }, 50);
        }

        if (botonRegresar) {
            document.getElementById('boton-regresar-tablero').style.display = 'block';
            setTimeout(() => { botonRegresar.classList.add('mostrar'); }, 50);
        }
    }, 2000); // Tiempo justo para que termine la succión de los elementos
}
// 5. Retornar al mapa principal al presionar la flecha
if (botonRegresar) {
    botonRegresar.addEventListener('click', () => {
        window.location.href = 'tablero.html';
    });
}

// 6. Rastreo del movimiento del mouse para la linterna
window.addEventListener('mousemove', (e) => {
    if (capaNegra && !juegoTerminado) {
        capaNegra.style.setProperty('--x', `${e.clientX}px`);
        capaNegra.style.setProperty('--y', `${e.clientY}px`);
    }
});

// 7. Disparador inicial al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    inicializarTableroEstructural();
    moverObjetivo(); // Genera el primer cuadrado azul
});

// Reajuste adaptativo del tablero por si cambia la resolución
window.addEventListener('resize', () => {
    if (!juegoTerminado && contadorClics < MAX_INTENTOS) {
        inicializarTableroEstructural();
        moverObjetivo();
    }
});