// ==========================================================================
// 1. CONFIGURACIÓN Y DECLARACIÓN DE OBJETOS PARALLAX
// ==========================================================================
const imagenes = [
    { elemento: document.querySelector(".img-004-1"), rotacion: 45, velocidad: 0.7, direccionX: -0.25 },
    { elemento: document.querySelector(".img-003-2"), rotacion: 45, velocidad: 0.7, direccionX: -0.25 },
    { elemento: document.querySelector(".cuadri"), rotacion: 0, velocidad: -1, direccionX: 0 },
    { elemento: document.querySelector(".img-01"), rotacion: 45, velocidad: 0.7, direccionX: -0.25 },
    { elemento: document.querySelector(".img-02"), rotacion: -45, velocidad: 1, direccionX: 0.4 },
    { elemento: document.querySelector(".img-03"), rotacion: 80, velocidad: 1.2, direccionX: 0.25 },
    { elemento: document.querySelector(".img-04"), rotacion: -65, velocidad: 0.6, direccionX: -0.35 },
    { elemento: document.querySelector(".img-001"), rotacion: 150, velocidad: 0.9, direccionX: -0.5 },
    { elemento: document.querySelector(".img-002"), rotacion: 60, velocidad: 1.1, direccionX: 0.45 },
    { elemento: document.querySelector(".img-003"), rotacion: 80, velocidad: 0.8, direccionX: -0.3 },
    { elemento: document.querySelector(".img-004"), rotacion: 45, velocidad: 1.3, direccionX: 0.55 },
    { elemento: document.querySelector(".img-002-1"), rotacion: 80, velocidad: 0.9, direccionX: 0.3 },
    { elemento: document.querySelector(".img-003-1"), rotacion: 80, velocidad: 1.2, direccionX: -0.4 },
    { elemento: document.querySelector(".img-001-1"), rotacion: 80, velocidad: 0.7, direccionX: 0.5 }
];

// Mapeo dinámico del scroll (Movimiento original y freno del título)
window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const limiteFreno = 1800; 

    imagenes.forEach(img => {
        if (!img.elemento) return;

        let moverY = scroll * img.velocidad;
        const moverX = scroll * img.direccionX;

        // Lógica de congelamiento exclusiva para el título (.cuadri)
        if (img.elemento.classList.contains("cuadri")) {
            const posicionActualY = 200 - moverY; 
            if (posicionActualY >= limiteFreno) {
                moverY = -(limiteFreno - 200);
            }
        }

        img.elemento.style.transform = `translate(${moverX}px, ${-moverY}px) rotate(${img.rotacion}deg)`;
    });
});

// ==========================================================================
// 2. COMPORTAMIENTO MOUSE INTERACTIVO (AGITAR Y DESAPARECER)
// ==========================================================================
const fichas = document.querySelectorAll(".img-01, .img-02, .img-03, .img-04");

fichas.forEach(ficha => {
    let intervalo;
    let intensidad = 10;
    let presionado = false;

    function iniciarAgitacion() {
        presionado = true;
        intensidad = 9;

        intervalo = setInterval(() => {
            intensidad += 2;
            const rotacion = (Math.random() * intensidad * 2) - intensidad;
            ficha.style.transform = `rotate(${rotacion}deg)`;
        }, 30);

        setTimeout(() => {
            if (presionado) {
                clearInterval(intervalo);
                ficha.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                ficha.style.opacity = "0";
                ficha.style.transform = "scale(0)";

                setTimeout(() => {
                    ficha.style.display = "none";
                }, 500);
            }
        }, 1500);
    }

    function detenerAgitacion() {
        presionado = false;
        clearInterval(intervalo);
        ficha.style.transition = "transform 0.2s ease";
        ficha.style.transform = "rotate(0deg)";
    }

    // Eventos Mouse y Touch integrados
    ficha.addEventListener("mousedown", iniciarAgitacion);
    ficha.addEventListener("mouseup", detenerAgitacion);
    ficha.addEventListener("mouseleave", detenerAgitacion);
    ficha.addEventListener("touchstart", iniciarAgitacion);
    ficha.addEventListener("touchend", detenerAgitacion);
});

// ==========================================================================
// 3. EVENTOS DE PÁRRAFOS INTERACTIVOS (ANIMACIÓN CONTINUA AL SUBIR Y BAJAR)
// ==========================================================================
const todosLosParrafos = document.querySelectorAll("p");

const opcionesObserver = {
    root: null,        
    rootMargin: "0px 0px -50px 0px", // Se calibra para que actúe justo antes de entrar por abajo
    threshold: 0.10    
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Activa la animación al entrar en pantalla
            entry.target.classList.add("parrafo-visible");
        } else {
            // 🟢 Quita la clase al salir de pantalla para que funcione siempre en bucle al subir/bajar
            entry.target.classList.remove("parrafo-visible");
        }
    });
}, opcionesObserver);

todosLosParrafos.forEach(parrafo => {
    scrollObserver.observe(parrafo);
});


// ==========================================================================
// 5. LÓGICA DE CONTROL DEL CARRUSEL
// ==========================================================================
const slides = document.querySelectorAll('.slide');
const botonAnterior = document.getElementById('anterior');
const botonSiguiente = document.getElementById('siguiente');
let indexActual = 0;

function cambiarSlide(nuevoIndex) {
    if (slides.length === 0) return; 
    slides[indexActual].classList.remove('active');

    if (nuevoIndex >= slides.length) {
        indexActual = 0;
    } else if (nuevoIndex < 0) {
        indexActual = slides.length - 1;
    } else {
        indexActual = nuevoIndex;
    }

    slides[indexActual].classList.add('active');
}

if (botonAnterior) {
    botonAnterior.addEventListener('click', () => {
        cambiarSlide(indexActual - 1);
    });
}

if (botonSiguiente) {
    botonSiguiente.addEventListener('click', () => {
        cambiarSlide(indexActual + 1);
    });
}

// ==========================================================================
// 6. LÓGICA DE ARRASTRAR Y SOLTAR (DRAG AND DROP)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const contenedorOriginal = document.querySelector('.cuadroscuadricula');
    const cuadricula = document.querySelector('.cuadricula-4x4');

    // Configurar las imágenes
    document.querySelectorAll('.cuadroscuadricula img').forEach((img, index) => {
        img.draggable = true;
        img.id = `img-${index}`; 
        
        img.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', img.id);
            e.dataTransfer.effectAllowed = 'move'; 
        });
    });

    // Configurar los casilleros de la cuadrícula
    document.querySelectorAll('.cuadro').forEach(cuadro => {
        cuadro.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move'; 
        });

        cuadro.addEventListener('dragenter', e => {
            e.preventDefault();
        });
        
        cuadro.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const img = document.getElementById(id);
            
            if (img && !cuadro.querySelector('img')) {
                cuadro.appendChild(img);

                // Comprobación de última imagen colocada
                const imagenesRestantes = contenedorOriginal.querySelectorAll('img').length;
                if (imagenesRestantes === 0) {
                    setTimeout(() => {
                        if (cuadricula) cuadricula.classList.add('fading');
                        if (contenedorOriginal) contenedorOriginal.classList.add('fading');

                        setTimeout(() => {
                            if (cuadricula) cuadricula.style.display = 'none';
                            if (contenedorOriginal) contenedorOriginal.style.display = 'none';
                        }, 1000); 
                    }, 200);
                }
            }
        });
    });

    if (contenedorOriginal) {
        contenedorOriginal.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        contenedorOriginal.addEventListener('drop', e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const img = document.getElementById(id);
            if (img) contenedorOriginal.appendChild(img);
        });
    }
});

// ==========================================================================
// 7. COMPORTAMIENTO DE LETRAS INTERACTIVAS (TÍTULOS)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    function aplicarEfectoLetras(idElemento) {
        const titulo = document.getElementById(idElemento);

        if (titulo) {
            const textoOriginal = titulo.textContent;
            titulo.innerHTML = ""; 

            [...textoOriginal].forEach(letra => {
                const span = document.createElement("span");
                span.textContent = letra === " " ? "\u00A0" : letra;
                titulo.appendChild(span);

                span.addEventListener("mouseenter", () => {
                    span.classList.add("letra-activa");
                });

                span.addEventListener("mouseleave", () => {
                    setTimeout(() => {
                        span.classList.remove("letra-activa");
                    }, 300); 
                });
            });
        }
    }

    aplicarEfectoLetras("titulo-inicial-interactivo");
    aplicarEfectoLetras("titulo-interactivo");
});




// ==========================================================================
// 7. COMPORTAMIENTO DE LETRAS INTERACTIVAS Y DESAPARICIÓN ALEATORIA
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    const titulo = document.getElementById("titulo-interactivo");
    const boton = document.getElementById("btn-descubrir");
    const cortina = document.getElementById("cortina-negra");

    // 1. Creamos las letras y les asignamos el efecto hover original
    if (titulo) {
        const textoOriginal = titulo.textContent;
        titulo.innerHTML = ""; 

        [...textoOriginal].forEach(letra => {
            const span = document.createElement("span");
            span.textContent = letra === " " ? "\u00A0" : letra;
            titulo.appendChild(span);

            // Tu efecto hover original (No se toca)
            span.addEventListener("mouseenter", () => {
                span.classList.add("letra-activa");
            });

            span.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    span.classList.remove("letra-activa");
                }, 300); 
            });
        });
    }

    // 2. 🟢 CONTROL DEL CLICK: Desaparición al azar y parpadeo del botón
    if (boton && titulo) {
        boton.addEventListener("click", function(evento) {
            evento.preventDefault(); // Frena el viaje directo
            const destino = this.getAttribute("href");

            // Activamos el parpadeo tenso en el botón
            this.classList.add("boton-parpadeo-activo");

            // Capturamos las letras que acabamos de crear
            const letras = titulo.querySelectorAll("span");
            
            // A cada letra le asignamos un tiempo de desaparición completamente al azar
            letras.forEach((span) => {
                // Genera un tiempo aleatorio entre 0 y 800 milisegundos
                const tiempoAleatorio = Math.random() * 1400; 
                
                setTimeout(() => {
                    span.classList.add("letra-esfumada");
                }, tiempoAleatorio);
            });

            // 3. Cuando ya todas las letras se hayan esfumado (después de los 800ms)
            setTimeout(() => {
                if (cortina) cortina.classList.add("activa");
            }, 900);

            // 4. Salto final al siguiente HTML una vez que la cortina negra cubra todo
            setTimeout(() => {
                window.location.href = destino;
            }, 2100); // 900ms de espera + 1200ms de lo que tarda la cortina en CSS
        });
    }
});









// ==========================================================================
// SCRIPT GENERAL UNIFICADO - CON SELECTOR DE 2, 3 O 4 CONSTELACIONES
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {

    const capaNegra = document.getElementById('capa-negra') || document.querySelector('.linterna-oscuridad');
    const rejilla = document.getElementById('tablero-rejilla') || document.querySelector('.cuadricula-oculta');
    const contenedorFinal = document.getElementById('contenedor-linea-final');
    const escenarioJuego = document.querySelector('.escenario-juego') || document.body;

    let contadorClics = 0;
    const MAX_INTENTOS = 4;
    let juegoTerminado = true;

    const secuenciaColores = ['cuadrado-rojo', 'cuadrado-verde', 'cuadrado-amarillo', 'cuadrado-azul'];

    const coloresMalos = [
        'cuadrado-malo-morado',
        'cuadrado-malo-naranja',
        'cuadrado-malo-gris',
        'cuadrado-malo-rosa',
        'cuadrado-malo-cian'
    ];

    let historialPosiciones = [];
    let constelacionesGuardadas = [];
    let constelacionActual = 1;
    let TOTAL_CONSTELACIONES = 4;

    function mostrarSelectorConstelaciones() {
        const textoAyuda = document.getElementById('instruccion-juego');
        if (textoAyuda) textoAyuda.style.display = 'none';

        if (rejilla) {
            rejilla.innerHTML = '';
            rejilla.style.setProperty('opacity', '0', 'important');
            rejilla.style.setProperty('visibility', 'hidden', 'important');
            rejilla.style.setProperty('pointer-events', 'none', 'important');
        }

        if (capaNegra) {
            capaNegra.style.setProperty('opacity', '0', 'important');
            capaNegra.style.setProperty('visibility', 'hidden', 'important');
        }

        const selector = document.createElement('div');
        selector.id = 'selector-constelaciones';

        selector.style.position = 'absolute';
        selector.style.top = '50%';
        selector.style.left = '50%';
        selector.style.transform = 'translate(-50%, -50%)';
        selector.style.zIndex = '9999';
        selector.style.background = '#1e1e1e';
        selector.style.border = '1px solid rgba(255,255,255,0.35)';
        selector.style.borderRadius = '24px';
        selector.style.padding = '36px 46px';
        selector.style.textAlign = 'center';
        selector.style.fontFamily = "'Louis George Cafe', sans-serif";
        selector.style.color = 'white';
        selector.style.boxShadow = '0 0 40px rgba(0,0,0,0.5)';

        selector.innerHTML = `
            <h2 style="margin:0 0 24px 0; font-size:22px; letter-spacing:1px; font-weight:400;">
                ¿Cuántas formas quieres encontrar?
            </h2>

            <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <button class="boton-cantidad-formas" data-total="2">2 formas</button>
                <button class="boton-cantidad-formas" data-total="3">3 formas</button>
                <button class="boton-cantidad-formas" data-total="4">4 formas</button>
            </div>
        `;

        document.body.appendChild(selector);

        selector.querySelectorAll('.boton-cantidad-formas').forEach(boton => {
            boton.style.padding = '14px 22px';
            boton.style.borderRadius = '18px';
            boton.style.border = '1px solid white';
            boton.style.background = 'transparent';
            boton.style.color = 'white';
            boton.style.cursor = 'pointer';
            boton.style.fontFamily = "'Louis George Cafe', sans-serif";
            boton.style.fontSize = '15px';
            boton.style.letterSpacing = '1px';
            boton.style.transition = '0.3s ease';

            boton.addEventListener('mouseenter', () => {
                boton.style.background = 'white';
                boton.style.color = '#1e1e1e';
            });

            boton.addEventListener('mouseleave', () => {
                boton.style.background = 'transparent';
                boton.style.color = 'white';
            });

            boton.addEventListener('click', () => {
                TOTAL_CONSTELACIONES = parseInt(boton.dataset.total);

                selector.remove();
                iniciarJuegoElegido();
            });
        });
    }

    function iniciarJuegoElegido() {
        contadorClics = 0;
        juegoTerminado = false;
        historialPosiciones = [];
        constelacionesGuardadas = [];
        constelacionActual = 1;

        const textoAyuda = document.getElementById('instruccion-juego');
        if (textoAyuda) textoAyuda.style.display = 'block';

        if (contenedorFinal) contenedorFinal.innerHTML = '';

        if (escenarioJuego) {
            escenarioJuego.classList.remove('modo-invertido');
            escenarioJuego.style.backgroundColor = "#1e1e1e";
            escenarioJuego.style.opacity = '1';
        }

        if (rejilla) {
            rejilla.classList.remove('cuadricula-invertida');
            rejilla.style.setProperty('display', 'grid', 'important');
            rejilla.style.setProperty('opacity', '1', 'important');
            rejilla.style.setProperty('visibility', 'visible', 'important');
            rejilla.style.setProperty('pointer-events', 'auto', 'important');
        }

        if (capaNegra) {
            capaNegra.classList.remove('linterna-invertida');
            capaNegra.style.setProperty('opacity', '1', 'important');
            capaNegra.style.setProperty('visibility', 'visible', 'important');
            capaNegra.style.display = 'block';
        }

        inicializarTableroEstructural();
        moverObjetivo();
    }

    function inicializarTableroEstructural() {
        if (!rejilla) return;

        rejilla.innerHTML = '';
        rejilla.style.setProperty('display', 'grid', 'important');
        rejilla.style.setProperty('opacity', '1', 'important');
        rejilla.style.setProperty('visibility', 'visible', 'important');
        rejilla.style.setProperty('pointer-events', 'auto', 'important');

        const anchoRejilla = rejilla.clientWidth;
        const altoRejilla = rejilla.clientHeight;
        const tamanoCuadro = 50;

        const columnasCalculadas = Math.floor(anchoRejilla / tamanoCuadro);
        const filasCalculadas = Math.floor(altoRejilla / tamanoCuadro);
        const totalCasillasDinamicas = columnasCalculadas * filasCalculadas;

        for (let i = 0; i < totalCasillasDinamicas; i++) {
            const casilla = document.createElement('div');
            casilla.classList.add('casilla-secreta');
            casilla.dataset.indice = i;
            rejilla.appendChild(casilla);
        }
    }

    function moverObjetivo() {
        if (!rejilla || juegoTerminado) return;

        secuenciaColores.forEach(claseColor => {
            const objetivoActual = document.querySelector(`.${claseColor}`);
            if (objetivoActual) {
                objetivoActual.classList.remove(claseColor);
                objetivoActual.removeEventListener('click', gestionarClicObjetivo);
            }
        });

        const colorActual = secuenciaColores[contadorClics];

        const todasLasClases = [...secuenciaColores, ...coloresMalos];
        const selectoresExclusion = todasLasClases.map(c => `:not(.${c})`).join('');

        let casillasDisponibles = rejilla.querySelectorAll(`.casilla-secreta${selectoresExclusion}`);

        if (casillasDisponibles.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
            const nuevoObjetivo = casillasDisponibles[indiceAleatorio];

            historialPosiciones.push({
                indice: nuevoObjetivo.dataset.indice,
                color: colorActual
            });

            nuevoObjetivo.classList.add(colorActual);
            nuevoObjetivo.addEventListener('click', gestionarClicObjetivo);
        }

        let copiaColoresMalos = [...coloresMalos];

        for (let i = copiaColoresMalos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copiaColoresMalos[i], copiaColoresMalos[j]] = [copiaColoresMalos[j], copiaColoresMalos[i]];
        }

        for (let m = 0; m < 3; m++) {
            const casillasLibresParaObstaculos = rejilla.querySelectorAll(`.casilla-secreta${selectoresExclusion}`);

            if (casillasLibresParaObstaculos.length > 0 && copiaColoresMalos.length > 0) {
                const randIdx = Math.floor(Math.random() * casillasLibresParaObstaculos.length);
                const casillaMala = casillasLibresParaObstaculos[randIdx];

                const colorMaloUnico = copiaColoresMalos.pop();
                casillaMala.classList.add(colorMaloUnico);

                casillaMala.addEventListener('click', gestionarClicColorMalo);
            }
        }
    }

    function gestionarClicColorMalo(e) {
        e.preventDefault();
        e.stopPropagation();

        if (juegoTerminado) return;

        juegoTerminado = true;

        if (capaNegra) capaNegra.style.display = 'none';

        if (escenarioJuego) {
            escenarioJuego.style.transition = 'opacity 0.5s ease, background-color 0.5s ease';
            escenarioJuego.classList.add('efecto-temblor');
        }

        const todosLosMalos = rejilla.querySelectorAll(coloresMalos.map(c => `.${c}`).join(', '));
        todosLosMalos.forEach(malo => malo.removeEventListener('click', gestionarClicColorMalo));

        secuenciaColores.forEach(claseColor => {
            const buenoActivo = document.querySelector(`.${claseColor}`);
            if (buenoActivo) buenoActivo.removeEventListener('click', gestionarClicObjetivo);
        });

        const todasLasCasillas = rejilla.querySelectorAll('.casilla-secreta');

        todasLasCasillas.forEach(casilla => {
            const ramdX = (Math.random() * 160 - 80) + "px";
            const ramdY = (Math.random() * 160 - 80) + "px";
            const ramdRot = (Math.random() * 180 - 90) + "deg";

            casilla.style.setProperty('--rx', ramdX);
            casilla.style.setProperty('--ry', ramdY);
            casilla.style.setProperty('--rot', ramdRot);
            casilla.classList.add('casilla-colapsada');
        });

        setTimeout(() => {
            if (escenarioJuego) escenarioJuego.style.opacity = '0';
        }, 1100);

        setTimeout(() => {
            if (escenarioJuego) {
                escenarioJuego.classList.remove('efecto-temblor');
            }

            if (capaNegra) {
                capaNegra.style.setProperty('opacity', '1', 'important');
                capaNegra.style.setProperty('visibility', 'visible', 'important');
                capaNegra.style.display = 'block';
            }

            contadorClics = 0;
            juegoTerminado = false;
            historialPosiciones = [];

            if (contenedorFinal) contenedorFinal.innerHTML = '';

            inicializarTableroEstructural();
            moverObjetivo();

            setTimeout(() => {
                if (escenarioJuego) escenarioJuego.style.opacity = '1';
            }, 50);

        }, 1800);
    }

    function gestionarClicObjetivo(e) {
        e.preventDefault();
        e.stopPropagation();

        contadorClics++;

        if (contadorClics < MAX_INTENTOS) {
            moverObjetivo();
        } else {
            juegoTerminado = true;

            secuenciaColores.forEach(claseColor => {
                this.classList.remove(claseColor);
            });

            this.removeEventListener('click', gestionarClicObjetivo);

            const textoAyuda = document.getElementById('instruccion-juego');
            if (textoAyuda) textoAyuda.style.display = 'none';

            const contenedorJuego = document.querySelector('.escenario-juego') || document.body;
            if (contenedorJuego) contenedorJuego.classList.add('modo-invertido');

            if (rejilla) rejilla.classList.add('cuadricula-invertida');

            if (capaNegra) {
                capaNegra.classList.add('linterna-invertida');
                capaNegra.style.display = 'none';
            }

            historialPosiciones.forEach(nodoHistorico => {
                if (rejilla) {
                    const casillaHistorica = rejilla.querySelector(`[data-indice="${nodoHistorico.indice}"]`);

                    if (casillaHistorica) {
                        coloresMalos.forEach(cm => casillaHistorica.classList.remove(cm));
                        casillaHistorica.classList.add(nodoHistorico.color);
                    }
                }
            });

            guardarConstelacionActual();
            dibujarLineaTrayectoria();

            if (rejilla) {
                const selectoresExclusion = secuenciaColores.map(c => `:not(.${c})`).join('');
                const casillasParaColapsar = rejilla.querySelectorAll(`.casilla-secreta${selectoresExclusion}`);

                casillasParaColapsar.forEach(casilla => {
                    const ramdX = (Math.random() * 160 - 80) + "px";
                    const ramdY = (Math.random() * 160 - 80) + "px";
                    const ramdRot = (Math.random() * 180 - 90) + "deg";

                    casilla.style.setProperty('--rx', ramdX);
                    casilla.style.setProperty('--ry', ramdY);
                    casilla.style.setProperty('--rot', ramdRot);
                    casilla.classList.add('casilla-colapsada');
                });
            }
        }
    }

    function guardarConstelacionActual() {
        if (!rejilla) return;

        const datosConstelacion = [];

        historialPosiciones.forEach(item => {
            const casilla = rejilla.querySelector(`[data-indice="${item.indice}"]`);

            if (casilla) {
                const box = casilla.getBoundingClientRect();

                datosConstelacion.push({
                    x: box.left + box.width / 2,
                    y: box.top + box.height / 2,
                    color: item.color
                });
            }
        });

        constelacionesGuardadas.push(datosConstelacion);
    }

    function dibujarLineaTrayectoria() {
        if (!contenedorFinal || !rejilla) return;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.pointerEvents = "none";

        let puntos = [];

        historialPosiciones.forEach(item => {
            const n = rejilla.querySelector(`[data-indice="${item.indice}"]`);

            if (n) {
                const box = n.getBoundingClientRect();
                puntos.push(`${box.left + box.width / 2},${box.top + box.height / 2}`);
            }
        });

        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

        polyline.setAttribute("points", puntos.join(" "));
        polyline.setAttribute("fill", "none");
        polyline.classList.add("linea-trayectoria");

        polyline.addEventListener('transitionend', mostrarMensajeExitoFinal);

        svg.appendChild(polyline);
        contenedorFinal.appendChild(svg);

        setTimeout(() => {
            polyline.classList.add('mostrar-linea');
        }, 50);
    }

    function mostrarMensajeExitoFinal() {
        if (document.getElementById('mensaje-forma-final')) return;

        const mensaje = document.createElement('div');

        mensaje.id = 'mensaje-forma-final';
        mensaje.className = 'mensaje-exito-pantalla';
        mensaje.innerText = `Has encontrado la forma ${constelacionActual}.`;

        if (contenedorFinal) {
            contenedorFinal.appendChild(mensaje);

            setTimeout(() => {
                mensaje.classList.add('visible');
            }, 10);
        }

        setTimeout(() => {
            if (constelacionActual < TOTAL_CONSTELACIONES) {
                prepararSiguienteConstelacion();
            } else {
                mostrarFinalConstelaciones();
            }
        }, 1800);
    }

    function prepararSiguienteConstelacion() {
        constelacionActual++;

        contadorClics = 0;
        juegoTerminado = false;
        historialPosiciones = [];

        if (contenedorFinal) contenedorFinal.innerHTML = '';

        const textoAyuda = document.getElementById('instruccion-juego');
        if (textoAyuda) textoAyuda.style.display = 'block';

        const contenedorJuego = document.querySelector('.escenario-juego') || document.body;
        if (contenedorJuego) {
            contenedorJuego.classList.remove('modo-invertido');
            contenedorJuego.style.backgroundColor = "#1e1e1e";
        }

        if (rejilla) {
            rejilla.classList.remove('cuadricula-invertida');
            rejilla.style.setProperty('display', 'grid', 'important');
            rejilla.style.setProperty('opacity', '1', 'important');
            rejilla.style.setProperty('visibility', 'visible', 'important');
            rejilla.style.setProperty('pointer-events', 'auto', 'important');
        }

        if (capaNegra) {
            capaNegra.classList.remove('linterna-invertida');
            capaNegra.style.setProperty('opacity', '1', 'important');
            capaNegra.style.setProperty('visibility', 'visible', 'important');
            capaNegra.style.display = 'block';
        }

        inicializarTableroEstructural();
        moverObjetivo();
    }

    function mostrarFinalConstelaciones() {
        if (!contenedorFinal) return;

        contenedorFinal.innerHTML = '';

        if (rejilla) {
            rejilla.innerHTML = '';
            rejilla.style.setProperty('opacity', '0', 'important');
            rejilla.style.setProperty('visibility', 'hidden', 'important');
            rejilla.style.setProperty('pointer-events', 'none', 'important');
        }

        if (capaNegra) {
            capaNegra.style.setProperty('opacity', '0', 'important');
            capaNegra.style.setProperty('visibility', 'hidden', 'important');
        }

        const svgFinal = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgFinal.setAttribute("width", "100%");
        svgFinal.setAttribute("height", "100%");
        svgFinal.style.position = "absolute";
        svgFinal.style.top = "0";
        svgFinal.style.left = "0";
        svgFinal.style.zIndex = "999";
        svgFinal.style.pointerEvents = "none";

        const cantidad = constelacionesGuardadas.length;
        const anchoCaja = 260;
        const altoCaja = 220;
        const espacio = 80;

        const totalAncho = (anchoCaja * cantidad) + (espacio * (cantidad - 1));
        const inicioX = (window.innerWidth - totalAncho) / 2;
        const centroY = window.innerHeight / 2 - 60;

        constelacionesGuardadas.forEach((constelacion, index) => {
            if (!constelacion || constelacion.length === 0) return;

            const xs = constelacion.map(p => p.x);
            const ys = constelacion.map(p => p.y);

            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const anchoOriginal = maxX - minX || 1;
            const altoOriginal = maxY - minY || 1;

            const escala = Math.min(
                (anchoCaja - 70) / anchoOriginal,
                (altoCaja - 70) / altoOriginal
            );

            const offsetX = inicioX + index * (anchoCaja + espacio) + anchoCaja / 2;
            const offsetY = centroY;

            const puntosFinales = constelacion.map(p => ({
                x: offsetX + (p.x - minX - anchoOriginal / 2) * escala,
                y: offsetY + (p.y - minY - altoOriginal / 2) * escala,
                color: p.color
            }));

            const linea = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

            linea.setAttribute(
                "points",
                puntosFinales.map(p => `${p.x},${p.y}`).join(" ")
            );

            linea.setAttribute("fill", "none");
            linea.setAttribute("stroke", "white");
            linea.setAttribute("stroke-width", "2.5");
            linea.setAttribute("stroke-dasharray", "10 10");
            linea.setAttribute("opacity", "0.9");

            svgFinal.appendChild(linea);

            puntosFinales.forEach(punto => {
                const cuadrado = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                cuadrado.setAttribute("x", punto.x - 12);
                cuadrado.setAttribute("y", punto.y - 12);
                cuadrado.setAttribute("width", "24");
                cuadrado.setAttribute("height", "24");
                cuadrado.setAttribute("rx", "3");

                if (punto.color === 'cuadrado-rojo') cuadrado.setAttribute("fill", "#aa4d3c");
                if (punto.color === 'cuadrado-verde') cuadrado.setAttribute("fill", "#2e7d32");
                if (punto.color === 'cuadrado-amarillo') cuadrado.setAttribute("fill", "#fbc02d");
                if (punto.color === 'cuadrado-azul') cuadrado.setAttribute("fill", "#1565c0");

                cuadrado.setAttribute("stroke", "white");
                cuadrado.setAttribute("stroke-width", "1.5");

                svgFinal.appendChild(cuadrado);
            });
        });

        contenedorFinal.appendChild(svgFinal);

        const mensajeFinal = document.createElement('div');
        mensajeFinal.className = 'mensaje-exito-pantalla';

        if (TOTAL_CONSTELACIONES === 2) {
            mensajeFinal.innerText = 'Has encontrado las dos formas.';
        } else if (TOTAL_CONSTELACIONES === 3) {
            mensajeFinal.innerText = 'Has encontrado las tres formas.';
        } else {
            mensajeFinal.innerText = 'Has encontrado las cuatro formas.';
        }

        contenedorFinal.appendChild(mensajeFinal);

        setTimeout(() => {
            mensajeFinal.classList.add('visible');
        }, 10);
    }

    function procesarAccionMovimientoGlobal(clientX, clientY) {
        if (capaNegra && !juegoTerminado && capaNegra.style.display !== 'none') {
            capaNegra.style.setProperty('--x', `${clientX}px`);
            capaNegra.style.setProperty('--y', `${clientY}px`);
        }
    }

    window.addEventListener('mousemove', (e) => {
        procesarAccionMovimientoGlobal(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            procesarAccionMovimientoGlobal(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    mostrarSelectorConstelaciones();

    window.addEventListener('resize', () => {
        if (contadorClics < MAX_INTENTOS && !juegoTerminado) {
            inicializarTableroEstructural();
            moverObjetivo();
        }
    });
});















// ==========================================================================
// 9. LÓGICA DEL BOTÓN INTERACTIVO DESPLEGABLE (IFRAME DEL PIX)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    const boton = document.getElementById("btn-desplegar-iframe");
    const contenedor = document.getElementById("mi-iframe-desplegable");

    if (boton && contenedor) {
        boton.addEventListener("click", function() {
            if (contenedor.classList.contains("iframe-oculto")) {
                contenedor.classList.remove("iframe-oculto");
                contenedor.classList.add("iframe-visible");
                boton.textContent = "OCULTAR EL PIX";

                // Desplazamiento centrado y suave automático
                setTimeout(() => {
                    contenedor.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 50);

            } else {
                contenedor.classList.remove("iframe-visible");
                contenedor.classList.add("iframe-oculto");
                boton.textContent = "VER EL PIX";
            }
        });
    }
});












document.addEventListener("DOMContentLoaded", () => {
    const cuadro = document.getElementById("cuadro-movil");

    if (cuadro) {
        cuadro.addEventListener("click", () => {
            /* Genera un número entero aleatorio entre 1 y 4 
               Matemática: Math.random() genera de 0 a 0.99 -> * 4 = 0 a 3.96 -> Math.floor baja a 0-3 -> + 1 = 1-4 */
            const nuevaColumna = Math.floor(Math.random() * 4) + 1;
            const nuevaFila = Math.floor(Math.random() * 4) + 1;

            /* Aplicamos las coordenadas directamente a las propiedades de Grid del CSS */
            cuadro.style.gridColumn = nuevaColumna;
            cuadro.style.gridRow = nuevaFila;
        });
    }
});