// ==========================================================================
// scriptverde.js - MINIJUEGO LINTERNA GEOMÉTRICA (REVELACIÓN MATRICIAL)
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

// 2. Mueve el cuadrado verde a una posición aleatoria y le asigna el evento de clic
function moverObjetivo() {
    if (!rejilla || juegoTerminado) return;
    
    // Buscamos y limpiamos por completo el cuadrado verde anterior
    const objetivoActual = document.querySelector('.cuadrado-verde');
    if (objetivoActual) {
        objetivoActual.classList.remove('cuadrado-verde');
        objetivoActual.removeEventListener('click', gestionarClicObjetivo);
    }

    // Filtramos las casillas de la cuadrícula para elegir una nueva
    const casillasDisponibles = rejilla.querySelectorAll('.casilla-secreta');
    if (casillasDisponibles.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
        const nuevoObjetivo = casillasDisponibles[indiceAleatorio];
        
        // Activamos el cuadrado verde en su nueva posición
        nuevoObjetivo.classList.add('cuadrado-verde');
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
        // Al llegar exactamente al sexto clic, se detona el final místico
        ejecutarSecuenciaFinal(this);
    }
}
// ==========================================================================
// 4. NUEVA SECUENCIA FINAL: DESMANTELAMIENTO RÁPIDO EN CASCADA
// ==========================================================================
function ejecutarSecuenciaFinal(elementoObjetivo) {
    juegoTerminado = true; 
    
    // Removemos el objetivo y su evento para congelar el juego
    elementoObjetivo.classList.remove('cuadrado-verde');
    elementoObjetivo.removeEventListener('click', gestionarClicObjetivo);
    
    // Cambios visuales de atmósfera para la revelación de la grilla
    document.body.classList.add('modo-revelacion-final');
    if (rejilla) rejilla.classList.add('rejilla-revelada');

    // Desaparece por completo la máscara de la linterna para que se vea toda la cuadrícula
    if (capaNegra) {
        capaNegra.style.display = 'none'; 
    }

    // Desvanecimiento secuencial ACELERADO (Efecto disolución rápida)
    const todasLasCasillas = rejilla.querySelectorAll('.casilla-secreta');
    todasLasCasillas.forEach((casilla, index) => {
        setTimeout(() => {
            // ⚡ Reducido a 0.3s para que se desvanezcan el doble de rápido
            casilla.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
            casilla.style.opacity = "0";
            casilla.style.transform = "scale(0.85) rotate(5deg)"; 
        }, index * 4); // ⚡ Bajado de 15ms a 4ms para un barrido ráfaga
    });

    // Muestra el mensaje de éxito y el botón justo cuando termina la ráfaga
    setTimeout(() => {
        if (mensajeFinal) {
            mensajeFinal.style.display = 'block';
            setTimeout(() => { mensajeFinal.classList.add('mostrar'); }, 50);
        }

        if (botonRegresar) {
            document.getElementById('boton-regresar-tablero').style.display = 'block';
            setTimeout(() => { botonRegresar.classList.add('mostrar'); }, 50);
        }
    }, (todasLasCasillas.length * 4) + 150); // Ajustado al nuevo tiempo total
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
    moverObjetivo(); // Genera el primer cuadrado verde
});

// Reajuste adaptativo del tablero por si cambia la resolución
window.addEventListener('resize', () => {
    if (!juegoTerminado && contadorClics < MAX_INTENTOS) {
        inicializarTableroEstructural();
        moverObjetivo();
    }
});