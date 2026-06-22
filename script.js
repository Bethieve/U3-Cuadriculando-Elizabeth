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
// 4. LÓGICA DEL TABLERO Y CONSTRUCCIÓN DE MATRICES INTERNAS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const esquinas = document.querySelectorAll('.esquina');

    const patrones = {
        'esquina-amarilla': [1,1,0,0, 1,0,0,0, 0,0,0,1, 0,0,1,1],
        'esquina-roja':     [0,0,0,0, 0,1,1,0, 0,0,1,0, 1,0,0,1],
        'esquina-azul':     [0,1,1,0, 1,0,0,1, 1,0,0,1, 0,1,1,0],
        'esquina-verde':    [1,0,0,1, 0,1,0,0, 0,1,1,0, 1,0,0,1]
    };

    esquinas.forEach(esquina => {
        let tipoEsquina = '';
        let claseColor = '';
        let contenedorCentroSelector = '';

        if (esquina.classList.contains('esquina-amarilla')) { 
            tipoEsquina = 'esquina-amarilla'; claseColor = 'activo-amarillo'; contenedorCentroSelector = '.centro-amarillo'; 
        } else if (esquina.classList.contains('esquina-roja')) { 
            tipoEsquina = 'esquina-roja'; claseColor = 'activo-rojo'; contenedorCentroSelector = '.centro-roja'; 
        } else if (esquina.classList.contains('esquina-verde')) { 
            tipoEsquina = 'esquina-verde'; claseColor = 'activo-verde'; contenedorCentroSelector = '.centro-verde'; 
        } else if (esquina.classList.contains('esquina-azul')) { 
            tipoEsquina = 'esquina-azul'; claseColor = 'activo-azul'; contenedorCentroSelector = '.centro-azul'; 
        }

        // Asignación de orígenes de transformación cardinales
        if (tipoEsquina === 'esquina-amarilla') esquina.style.transformOrigin = "top left";
        else if (tipoEsquina === 'esquina-roja') esquina.style.transformOrigin = "top right";
        else if (tipoEsquina === 'esquina-verde') esquina.style.transformOrigin = "bottom left";
        else if (tipoEsquina === 'esquina-azul') esquina.style.transformOrigin = "bottom right";

        const contenedorCentro = document.querySelector(contenedorCentroSelector);

        if (contenedorCentro) {
            const matriz = document.createElement('div');
            matriz.classList.add('matriz-interna');

            const mapaDefinido = patrones[tipoEsquina];
            for (let i = 0; i < 16; i++) {
                const miniCasilla = document.createElement('div');
                miniCasilla.classList.add('mini-casilla');
                if (mapaDefinido && mapaDefinido[i] === 1) {
                    miniCasilla.classList.add(claseColor);
                }
                matriz.appendChild(miniCasilla);
            }
            contenedorCentro.appendChild(matriz);

            // Controladores de expansión Hover & Render de matrices
            esquina.addEventListener('mouseenter', () => {
                esquina.style.scale = "1.15"; 
                esquina.style.zIndex = "10";
                matriz.classList.add('mostrar-matriz');
            });

            esquina.addEventListener('mouseleave', () => {
                esquina.style.scale = "1";    
                esquina.style.zIndex = "2";
                matriz.classList.remove('mostrar-matriz');
            });
        }

        esquina.addEventListener('click', (e) => {
            const colorCasilla = e.currentTarget.classList[1]; 
            console.log(`Se ha hecho clic en la esquina de color: ${colorCasilla}`);
        });
    });
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
// 8. LÓGICA DEL MINIJUEGO - LINTERNA GEOMÉTRICA (CON RETROCESO Y REINICIO)
// ==========================================================================
const capaNegra = document.getElementById('capa-negra');
const rejilla = document.getElementById('tablero-rejilla');
const mensajeFinal = document.getElementById('mensaje-oculto-final');
const botonRegresar = document.getElementById('boton-regresar-tablero');

let contadorClics = 0;
const MAX_INTENTOS = 4;
let juegoTerminado = false; 

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

function moverObjetivo() {
    if (!rejilla) return;
    const objetivoActual = document.querySelector('.cuadrado-rojo');
    if (objetivoActual) {
        objetivoActual.classList.remove('cuadrado-rojo');
        objetivoActual.removeEventListener('click', gestionarClicObjetivo);
    }

    const casillasDisponibles = rejilla.querySelectorAll('.casilla-secreta:not(.cuadrado-rojo)');
    if (casillasDisponibles.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * casillasDisponibles.length);
        const nuevoObjetivo = casillasDisponibles[indiceAleatorio];
        nuevoObjetivo.classList.add('cuadrado-rojo');
        nuevoObjetivo.addEventListener('click', gestionarClicObjetivo);
    }
}

function gestionarClicObjetivo(e) {
    e.preventDefault();
    e.stopPropagation();
    
    contadorClics++;
    
    if (contadorClics < MAX_INTENTOS) {
        moverObjetivo();
    } else {
        juegoTerminado = true; 
        this.classList.remove('cuadrado-rojo');
        this.removeEventListener('click', gestionarClicObjetivo);
        
        document.body.classList.add('modo-invertido');
        if (rejilla) rejilla.classList.add('cuadricula-invertida');

        if (capaNegra) {
            capaNegra.style.display = 'none'; 
        }

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

        if (mensajeFinal) {
            mensajeFinal.style.display = 'block';
            setTimeout(() => { mensajeFinal.classList.add('mostrar'); }, 50);
        }

        if (botonRegresar) {
            botonRegresar.style.display = 'block';
            setTimeout(() => { botonRegresar.classList.add('mostrar'); }, 50);
        }
    }
}

if (botonRegresar) {
    botonRegresar.addEventListener('click', () => {
        window.location.href = 'tablero.html';
    });
}

window.addEventListener('mousemove', (e) => {
    if (capaNegra && !juegoTerminado) {
        capaNegra.style.setProperty('--x', `${e.clientX}px`);
        capaNegra.style.setProperty('--y', `${e.clientY}px`);
    }
});

inicializarTableroEstructural();
moverObjetivo();

window.addEventListener('resize', () => {
    if (contadorClics < MAX_INTENTOS) {
        inicializarTableroEstructural();
        moverObjetivo();
    }
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