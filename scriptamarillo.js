(function() {
    const capaNegra = document.getElementById('capa-negra');
    const rejilla = document.getElementById('tablero-rejilla');
    const botonRegresar = document.getElementById('boton-regresar-tablero');

    let contadorClics = 0;
    const MAX_INTENTOS = 6;

    function inicializarTableroAmarillo() {
        if (!rejilla) return;
        rejilla.innerHTML = '';
        const tamanoCuadro = 50; 
        const columnasCalculadas = Math.floor(window.innerWidth / tamanoCuadro);
        const filasCalculadas = Math.floor(window.innerHeight / tamanoCuadro);
        const totalCasillasDinamicas = columnasCalculadas * filasCalculadas;

        for (let i = 0; i < totalCasillasDinamicas; i++) {
            const casilla = document.createElement('div');
            casilla.classList.add('casilla-secreta');
            rejilla.appendChild(casilla);
        }
    }

    function moverObjetivoAmarillo() {
        if (!rejilla) return;
        const objetivoActual = document.querySelector('.cuadrado-amarillo');
        if (objetivoActual) {
            objetivoActual.classList.remove('cuadrado-amarillo');
            objetivoActual.removeEventListener('click', gestionarClicAmarillo);
        }

        const casillasDisponibles = rejilla.querySelectorAll('.casilla-secreta');
        if (casillasDisponibles.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
            const nuevoObjetivo = casillasDisponibles[indiceAleatorio];
            nuevoObjetivo.classList.add('cuadrado-amarillo');
            nuevoObjetivo.addEventListener('click', gestionarClicAmarillo);
        }
    }

    function gestionarClicAmarillo(e) {
        e.preventDefault();
        e.stopPropagation();
        contadorClics++;
        
        if (contadorClics < MAX_INTENTOS) {
            moverObjetivoAmarillo();
        } else {
            // 🟡 FINAL: DESVANECIMIENTO ALEATORIO EN BLOQUE
            this.removeEventListener('click', gestionarClicAmarillo);
            
            // Convertimos las casillas a un array y las desordenamos al azar
            const todasLasCasillas = Array.from(document.querySelectorAll('.casilla-secreta'));
            todasLasCasillas.sort(() => Math.random() - 0.5);
            
            // Hacemos que se desvanezcan una por una con un pequeño retraso
            todasLasCasillas.forEach((casilla, index) => {
                setTimeout(() => {
                    casilla.style.transition = "opacity 0.8s ease";
                    casilla.style.opacity = "0";
                }, index * 15); // Disolución rápida pero elegante
            });

            // Ocultamos la linterna después de un breve momento
            if (capaNegra) {
                setTimeout(() => {
                    capaNegra.style.transition = "opacity 1s ease";
                    capaNegra.style.opacity = "0";
                }, 500);
            }

            // Hacemos aparecer el botón al final del proceso
            if (botonRegresar) {
                botonRegresar.style.display = 'block';
                setTimeout(() => {
                    botonRegresar.classList.add('mostrar');
                }, 1000);
            }
        }
    }

    if (botonRegresar) {
        botonRegresar.addEventListener('click', () => {
            window.location.href = 'tablero.html';
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (capaNegra) {
            capaNegra.style.setProperty('--x', `${e.clientX}px`);
            capaNegra.style.setProperty('--y', `${e.clientY}px`);
        }
    });

    inicializarTableroAmarillo();
    moverObjetivoAmarillo();
})();