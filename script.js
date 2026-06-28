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

window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const limiteFreno = 1800; 

    imagenes.forEach(img => {
        if (!img.elemento) return;

        let moverY = scroll * img.velocidad;
        const moverX = scroll * img.direccionX;

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

    ficha.addEventListener("mousedown", iniciarAgitacion);
    ficha.addEventListener("mouseup", detenerAgitacion);
    ficha.addEventListener("mouseleave", detenerAgitacion);
    ficha.addEventListener("touchstart", iniciarAgitacion);
    ficha.addEventListener("touchend", detenerAgitacion);
});

// ==========================================================================
// 3. EVENTOS DE PÁRRAFOS INTERACTIVOS
// ==========================================================================
const todosLosParrafos = document.querySelectorAll("p");

const opcionesObserver = {
    root: null,        
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.10    
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("parrafo-visible");
        } else {
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

    document.querySelectorAll('.cuadroscuadricula img').forEach((img, index) => {
        img.draggable = true;
        img.id = `img-${index}`; 
        
        img.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', img.id);
            e.dataTransfer.effectAllowed = 'move'; 
        });
    });

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
// 7. COMPORTAMIENTO DE LETRAS INTERACTIVAS Y BOTÓN DESCUBRIR (OPCIÓN 1 RESTAURADA)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    let audioSonidoInicial = null;
    try {
        audioSonidoInicial = new Audio("sounds/Sonidoinicial.mp3");
        audioSonidoInicial.volume = 0.6; 
    } catch(e) {
        console.error("Error cargando el archivo Sonidoinicial: ", e);
    }

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
    
    const titulo = document.getElementById("titulo-interactivo");
    const boton = document.getElementById("btn-descubrir");
    const cortina = document.getElementById("cortina-negra");

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

    if (boton && titulo) {
        boton.addEventListener("click", function(evento) {
            evento.preventDefault(); 
            const destino = this.getAttribute("href"); 

            if (audioSonidoInicial) {
                audioSonidoInicial.currentTime = 0;
                audioSonidoInicial.play().catch(err => console.log("Audio play blocked: ", err));
            }

            this.classList.add("boton-parpadeo-activo");

            const letras = titulo.querySelectorAll("span");
            
            letras.forEach((span) => {
                const tiempoAleatorio = Math.random() * 1400; 
                
                setTimeout(() => {
                    span.classList.add("letra-esfumada");
                }, tiempoAleatorio);
            });

            setTimeout(() => {
                if (cortina) cortina.classList.add("activa");
            }, 900);

            setTimeout(() => {
                window.location.href = destino;
            }, 3500); 
        });
    }
});

// ==========================================================================
// 8. SCRIPT GENERAL UNIFICADO - JUEGO DE CONSTELACIONES
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

    // DECLARACIÓN DE EFECTOS DE SONIDO
    let audioClickBueno = null;
    let audioSonidoMalo = null;
    let audioSonidoRoto = null; 
    let audioSonidounion = null; 

    try {
        audioClickBueno = new Audio("sounds/Clickbueno.mp3");
        audioClickBueno.volume = 0.5;

        audioSonidoMalo = new Audio("sounds/sonidomalo.mp3");
        audioSonidoMalo.volume = 0.55; 

        audioSonidoRoto = new Audio("sounds/Sonidoroto.mp3");
        audioSonidoRoto.volume = 0.65;

        audioSonidounion = new Audio("sounds/Sonidounion.mp3");
        audioSonidounion.volume = 0.6;
    } catch(e) {
        console.error("Error pre-cargando los efectos de sonido del tablero: ", e);
    }

    function mostrarSelectorConstelaciones() {
        const selector = document.getElementById('selector-constelaciones');
        if (!selector) return;

        const textoAyuda = document.getElementById('instruccion-juego');
        if (textoAyuda) textoAyuda.style.display = 'none';

        if (rejilla) {
            rejilla.innerHTML = '';
            rejilla.style.setProperty('opacity', '0', 'important');
            rejilla.style.setProperty('visibility', 'hidden', 'important');
            rejilla.style.setProperty('pointer-events', 'none', 'important');
            rejilla.style.setProperty('display', 'none', 'important');
        }

        if (capaNegra) {
            capaNegra.style.setProperty('opacity', '0', 'important');
            capaNegra.style.setProperty('visibility', 'hidden', 'important');
            capaNegra.style.display = 'none';
        }

        selector.style.display = 'flex';

        selector.querySelectorAll('.boton-cantidad-formas').forEach(boton => {
            boton.replaceWith(boton.cloneNode(true));
        });

        selector.querySelectorAll('.boton-cantidad-formas').forEach(boton => {
            boton.addEventListener('click', () => {

                if (audioClickBueno) {
                    audioClickBueno.currentTime = 0;
                    audioClickBueno.play().catch(err => console.log("Audio play blocked: ", err));
                }

                TOTAL_CONSTELACIONES = parseInt(boton.dataset.total);
                selector.style.display = 'none';
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
            escenarioJuego.style.setProperty('background-color', '#1e1e1e', 'important');
            escenarioJuego.style.setProperty('background', '#1e1e1e', 'important');
            escenarioJuego.style.opacity = '1';
        }

        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');

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

        if (audioSonidoMalo) {
            audioSonidoMalo.currentTime = 0; 
            audioSonidoMalo.play().catch(err => console.log("Audio play blocked: ", err));
        }

        if (audioSonidoRoto) {
            audioSonidoRoto.currentTime = 0;
            audioSonidoRoto.play().catch(err => console.log("Audio play blocked: ", err));
        }

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
            if (escenarioJuego) escenarioJuego.classList.remove('efecto-temblor');

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

        if (audioClickBueno) {
            audioClickBueno.currentTime = 0; 
            audioClickBueno.play().catch(err => console.log("Audio play blocked: ", err));
        }

        contadorClics++;

        if (contadorClics < MAX_INTENTOS) {
            moverObjetivo();
        } else {
            juegoTerminado = true;

            secuenciaColores.forEach(claseColor => {
                this.classList.remove(claseColor);
            });

            this.removeEventListener('click', gestionarClicObjetivo);

            const textAyuda = document.getElementById('instruccion-juego');
            if (textAyuda) textAyuda.style.display = 'none';

            document.documentElement.style.setProperty('background-color', '#e1e1e1', 'important');
            document.body.style.setProperty('background-color', '#e1e1e1', 'important');

            const contenedorJuego = document.querySelector('.escenario-juego') || document.body;
            if (contenedorJuego) {
                contenedorJuego.classList.add('modo-invertido');
            }

            if (rejilla) {
                rejilla.classList.add('cuadricula-invertida');
            }

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

        if (audioSonidounion) {
            audioSonidounion.currentTime = 0;
            audioSonidounion.play().catch(err => console.log("Audio play blocked: ", err));
        }

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

        svg.appendChild(polyline);
        contenedorFinal.appendChild(svg);

        setTimeout(() => {
            polyline.classList.add('mostrar-linea');
        }, 50);

        // ✨ AJUSTADO A 2000ms: Da el tiempo exacto para que la línea recorra y complete su animación antes de gatillar el botón
        setTimeout(() => {
            mostrarMensajeExitoFinal();
        }, 4500);
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

        const botonContinuar = document.createElement('button');
        botonContinuar.className = 'boton-continuar-interactivo';
        botonContinuar.innerText = 'Continuar';
        
        if (contenedorFinal) {
            contenedorFinal.appendChild(botonContinuar);
            setTimeout(() => {
                botonContinuar.classList.add('mostrar');
            }, 200);
        }

        botonContinuar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (audioClickBueno) {
                audioClickBueno.currentTime = 0;
                audioClickBueno.play().catch(err => console.log("Audio play blocked: ", err));
            } 

            botonContinuar.remove(); 
            if (constelacionActual < TOTAL_CONSTELACIONES) {
                prepararSiguienteConstelacion();
            } else {
                mostrarFinalConstelaciones();
            }
        });
    }

    function prepararSiguienteConstelacion() {
        constelacionActual++;
        contadorClics = 0;
        juegoTerminado = false;
        historialPosiciones = [];

        if (contenedorFinal) contenedorFinal.innerHTML = '';

        const textoAyuda = document.getElementById('instruccion-juego');
        if (textoAyuda) textoAyuda.style.display = 'block';

        document.documentElement.style.setProperty('background-color', '#e1e1e1', 'important');
        document.body.style.setProperty('background-color', '#e1e1e1', 'important');

        const contenedorJuego = document.querySelector('.escenario-juego') || document.body;
        if (contenedorJuego) {
            contenedorJuego.classList.remove('modo-invertido');
            contenedorJuego.style.removeProperty('background-color');
            contenedorJuego.style.removeProperty('background');
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

        let sonidoFinal = null;
        try {
            sonidoFinal = new Audio("sounds/formafinal.mp3");
            sonidoFinal.volume = 0.6;
        } catch(e) {
            console.error("Error pre-cargando el objeto de audio: ", e);
        }

        contenedorFinal.innerHTML = '';

        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');

        if (rejilla) {
            rejilla.innerHTML = '';
            rejilla.style.setProperty('opacity', '0', 'important');
            rejilla.style.setProperty('visibility', 'hidden', 'important');
            rejilla.style.setProperty('pointer-events', 'none', 'important');
            rejilla.style.setProperty('display', 'none', 'important');
        }

        if (capaNegra) {
            capaNegra.style.setProperty('opacity', '0', 'important');
            capaNegra.style.setProperty('visibility', 'hidden', 'important');
            capaNegra.style.display = 'none';
        }

        const escenarioJuegoFinal = document.querySelector('.escenario-juego') || document.body;
        if (escenarioJuegoFinal) {
            escenarioJuegoFinal.style.transition = 'background-color 1.5s ease, background 1.5s ease';
            escenarioJuegoFinal.style.setProperty('background-color', '#ffffff', 'important');
            escenarioJuegoFinal.style.setProperty('background', '#ffffff', 'important');
        }

        contenedorFinal.style.position = "relative";
        contenedorFinal.style.width = "100vw";
        contenedorFinal.style.height = "100vh";
        contenedorFinal.style.overflow = "hidden";
        contenedorFinal.style.display = "block"; 

        const cantidad = constelacionesGuardadas.length;
        const espacio = 40; 
        const anchoDisponibleSeguro = window.innerWidth * 0.90;

        const anchoCajaCalculado = Math.min(340, (anchoDisponibleSeguro - (espacio * (cantidad - 1))) / cantidad);
        const altoCajaCalculado = anchoCajaCalculado * 0.88;  

        const totalAnchoFila = (anchoCajaCalculado * cantidad) + (espacio * (cantidad - 1));
        const inicioX = (window.innerWidth - totalAnchoFila) / 2;
        const centroY = (window.innerHeight / 2) - 60; 

        const svgFinal = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgFinal.setAttribute("width", "100%");
        svgFinal.setAttribute("height", "100%");
        svgFinal.style.position = "absolute";
        svgFinal.style.top = "0";
        svgFinal.style.left = "0";
        svgFinal.style.zIndex = "999";
        svgFinal.style.pointerEvents = "none";
        svgFinal.style.overflow = "visible"; 

        let todosLosPuntosGlobales = [];

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
                (anchoCajaCalculado - 40) / anchoOriginal,
                (altoCajaCalculado - 40) / altoOriginal
            );

            const offsetX = inicioX + index * (anchoCajaCalculado + espacio) + anchoCajaCalculado / 2;
            const offsetY = centroY;

            const puntosFinales = constelacion.map(p => ({
                x: offsetX + (p.x - minX - anchoOriginal / 2) * escala,
                y: offsetY + (p.y - minY - altoOriginal / 2) * escala,
                color: p.color
            }));

            todosLosPuntosGlobales = todosLosPuntosGlobales.concat(puntosFinales);
        });

        todosLosPuntosGlobales.sort((a, b) => a.x - b.x);

        if (todosLosPuntosGlobales.length > 0) {
            const lineaUnificada = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            lineaUnificada.setAttribute("points", todosLosPuntosGlobales.map(p => `${p.x},${p.y}`).join(" "));
            lineaUnificada.setAttribute("fill", "none");
            lineaUnificada.setAttribute("stroke", "#bbbbbb");
            lineaUnificada.setAttribute("stroke-width", "2.5");
            lineaUnificada.setAttribute("stroke-dasharray", "10 10");
            lineaUnificada.setAttribute("opacity", "0.9");
            svgFinal.appendChild(lineaUnificada);
        }

        todosLosPuntosGlobales.forEach(punto => {
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

            cuadrado.setAttribute("stroke", "none");
            svgFinal.appendChild(cuadrado);
        });

        contenedorFinal.appendChild(svgFinal);

        const mensajeFinal = document.createElement('div');
        mensajeFinal.className = 'mensaje-exito-pantalla';
        mensajeFinal.style.color = '#1e1e1e';
        mensajeFinal.style.textShadow = 'none';

        if (TOTAL_CONSTELACIONES === 2) {
            mensajeFinal.innerText = 'Has encontrado las dos formas.';
        } else if (TOTAL_CONSTELACIONES === 3) {
            mensajeFinal.innerText = 'Has encontrado las tres formas.';
        } else {
            mensajeFinal.innerText = 'Has encontrado las cuatro formas.';
        }

        contenedorFinal.appendChild(mensajeFinal);

        setTimeout(() => {
            mensajeFinal.innerText = 'Haz clic secuencialmente en los nodos para revelar lo oculto...';
            
            const nodosFinales = svgFinal.querySelectorAll('rect');
            if (nodosFinales.length === 0) return;

            svgFinal.style.pointerEvents = "auto";

            const palabra = "CUADRICULANDO";
            let clicsEfectuados = 0;

            const contenedorPalabra = document.createElement('div');
            contenedorPalabra.id = 'revelacion-palabra-oculta';
            contenedorPalabra.style.position = 'absolute';
            contenedorPalabra.style.bottom = '12%'; 
            contenedorPalabra.style.left = '50%';
            contenedorPalabra.style.transform = 'translateX(-50%)';
            contenedorPalabra.style.fontSize = '3rem';
            contenedorPalabra.style.fontWeight = 'bold';
            contenedorPalabra.style.letterSpacing = '8px';
            contenedorPalabra.style.color = '#1e1e1e'; 
            contenedorPalabra.style.fontFamily = "'Inlanders', sans-serif"; 
            contenedorPalabra.style.textAlign = 'center';
            contenedorPalabra.style.zIndex = '1000';
            contenedorFinal.appendChild(contenedorPalabra);

            nodosFinales.forEach(nodo => {
                nodo.style.cursor = 'pointer';
                nodo.style.transition = 'transform 0.2s ease, filter 0.2s ease, stroke 0.2s ease, fill 0.2s ease';
                nodo.style.transformOrigin = 'center';
                nodo.style.transformBox = 'fill-box';
            });

            nodosFinales.forEach((nodo) => {
                nodo.addEventListener('click', function gestionarClicRevelacion(e) {
                    e.stopPropagation();

                    if (audioClickBueno) {
                        audioClickBueno.currentTime = 0;
                        audioClickBueno.play().catch(err => console.log("Audio play blocked: ", err));
                    }
                    
                    if (nodo.dataset.clickeado === "true") return;
                    nodo.dataset.clickeado = "true";

                    clicsEfectuados++;

                    nodo.setAttribute("fill", "#ffffff"); 
                    nodo.setAttribute("stroke", "#1e1e1e"); 
                    nodo.setAttribute("stroke-width", "2");
                    nodo.style.transform = "scale(1.3)";
                    nodo.style.filter = "drop-shadow(0px 4px 6px rgba(0,0,0,0.15))";

                    const letrasPorClic = Math.ceil(palabra.length / nodosFinales.length);
                    const limiteLetras = Math.min(clicsEfectuados * letrasPorClic, palabra.length);
                    
                    contenedorPalabra.innerText = palabra.substring(0, limiteLetras);

                    if (clicsEfectuados >= nodosFinales.length) {
                        contenedorPalabra.innerText = palabra;
                        mensajeFinal.innerText = 'Has desvelado el concepto oculto.';

                        escenarioJuegoFinal.style.setProperty('background-color', '#000000', 'important');
                        escenarioJuegoFinal.style.setProperty('background', '#000000', 'important');

                        if (sonidoFinal) {
                            sonidoFinal.play().catch(err => console.log("Audio play blocked: ", err));
                        }

                        mensajeFinal.style.color = '#ffffff';
                        mensajeFinal.style.textShadow = '0 0 12px rgba(255,255,255,.8)';
                        contenedorPalabra.style.color = '#ffffff';

                        nodosFinales.forEach(n => {
                            n.setAttribute("stroke", "#ffffff");
                            n.style.filter = "drop-shadow(0px 0px 10px #ffffff)";
                        });

                        const lineasConectoras = svgFinal.querySelectorAll('polyline');
                        lineasConectoras.forEach(linea => linea.remove());

                        let todasLasCoordenadas = [];

                        nodosFinales.forEach(rect => {
                            todasLasCoordenadas.push({
                                x: parseFloat(rect.getAttribute("x")) + 12,
                                y: parseFloat(rect.getAttribute("y")) + 12
                            });
                        });

                        todasLasCoordenadas.sort((a, b) => a.x - b.x);

                        const granFormaFinal = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                        granFormaFinal.setAttribute("points", todasLasCoordenadas.map(p => `${p.x},${p.y}`).join(" "));
                        granFormaFinal.setAttribute("fill", "none");
                        granFormaFinal.setAttribute("stroke", "#ffffff");
                        granFormaFinal.setAttribute("stroke-width", "3");
                        granFormaFinal.style.filter = "drop-shadow(0 0 8px white)";

                        svgFinal.insertBefore(granFormaFinal, svgFinal.firstChild);

                        const botonVolver = document.createElement("button");
                        botonVolver.id = "boton-volver-experiencia";
                        botonVolver.className = "boton-continuar-interactivo"; 
                        botonVolver.innerText = "Volver a la experiencia";

                        if (contenedorFinal) {
                            contenedorFinal.appendChild(botonVolver);
                        } else {
                            document.body.appendChild(botonVolver);
                        }

                        setTimeout(() => {
                            botonVolver.classList.add("mostrar-suave");
                        }, 1000);

                        botonVolver.addEventListener("click", () => {

                            if (audioClickBueno) {
                                audioClickBueno.currentTime = 0;
                                audioClickBueno.play().catch(err => console.log("Audio play blocked: ", err));
                            }

                            botonVolver.remove();

                            contadorClics = 0;
                            historialPosiciones = [];
                            constelacionesGuardadas = [];
                            constelacionActual = 1;
                            juegoTerminado = true;

                            contenedorFinal.innerHTML = "";

                            escenarioJuegoFinal.classList.remove("modo-invertido");
                            escenarioJuegoFinal.style.setProperty("background", "#1e1e1e", "important");
                            escenarioJuegoFinal.style.setProperty("background-color", "#1e1e1e", "important");

                            mostrarSelectorConstelaciones();
                        });
                    }
                });
            });
        }, 2000); 
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
// 9. LÓGICA DEL BOTÓN INTERACTIVO DESPLEGABLE (IFRAME)
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

                setTimeout(() => {
                    contenedor.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    const cuadro = document.querySelector(".cuadro-amarillo");
    if (!cuadro) return;

    const colores = ["color-amarillo", "color-rojo", "color-verde", "color-azul"];
    let indiceColorActual = 0;

    function moverYCambiarColor() {
        const nuevaColumna = Math.floor(Math.random() * 4) + 1;
        const nuevaFila = Math.floor(Math.random() * 4) + 1;

        cuadro.style.gridColumn = nuevaColumna;
        cuadro.style.gridRow = nuevaFila;

        colores.forEach(color => cuadro.classList.remove(color));

        indiceColorActual = (indiceColorActual + 1) % colores.length;
        const siguienteColor = colores[indiceColorActual];
        cuadro.classList.add(siguienteColor);
        
        cuadro.style.transform = "scale(0.70)";
        setTimeout(() => {
            cuadro.style.transform = "scale(0.80)";
        }, 80);
    }

    cuadro.addEventListener("click", (e) => {
        e.stopPropagation(); 
        moverYCambiarColor();
    });
});