
const imagenes = [
{
        elemento: document.querySelector(".img-004-1"),
        rotacion: 45,
        velocidad: 0.7,
        direccionX: -0.25
    },
    {
        elemento: document.querySelector(".img-003-2"),
        rotacion: 45,
        velocidad: 0.7,
        direccionX: -0.25
    },
{
         elemento: document.querySelector(".cuadri"),
    rotacion: 0,
    velocidad: -1,
    direccionX: 0
    },
    {
        elemento: document.querySelector(".img-01"),
        rotacion: 45,
        velocidad: 0.7,
        direccionX: -0.25
    },


    {
        elemento: document.querySelector(".img-02"),
        rotacion: -45,
        velocidad: 1,
        direccionX: 0.4
    },

    {
        elemento: document.querySelector(".img-03"),
        rotacion: 80,
        velocidad: 1.2,
        direccionX: 0.25
    },

    {
        elemento: document.querySelector(".img-04"),
        rotacion: -65,
        velocidad: 0.6,
        direccionX: -0.35
    },

    
    {
        elemento: document.querySelector(".img-001"),
        rotacion: 150,
        velocidad: 0.9,
        direccionX: -0.5
    },

    {
        elemento: document.querySelector(".img-002"),
        rotacion: 60,
        velocidad: 1.1,
        direccionX: 0.45
    },

    {
        elemento: document.querySelector(".img-003"),
        rotacion: 80,
        velocidad: 0.8,
        direccionX: -0.3
    },

    {
        elemento: document.querySelector(".img-004"),
        rotacion: 45,
        velocidad: 1.3,
        direccionX: 0.55
    },

    {
        elemento: document.querySelector(".img-002-1"),
        rotacion: 80,
        velocidad: 0.9,
        direccionX: 0.3
    },

    {
        elemento: document.querySelector(".img-003-1"),
        rotacion: 80,
        velocidad: 1.2,
        direccionX: -0.4
    },

    {
        elemento: document.querySelector(".img-001-1"),
        rotacion: 80,
        velocidad: 0.7,
        direccionX: 0.5
    }

];

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;
    
    // Buscamos el contenedor de los botones para saber dónde frenar
    const botones = document.querySelector(".buttons-group");
    let limiteFreno = Infinity;

    if (botones) {
        // Obtenemos la posición de los botones respecto al tope de la página
        const posicionBotones = botones.getBoundingClientRect().top + window.scrollY;
        // El freno se activa 250px antes de tocar el tope de los botones (ajustable)
        limiteFreno = posicionBotones - 250;
    }

    imagenes.forEach(img => {

        if (!img.elemento) return;

        let moverY = scroll * img.velocidad;
        const moverX = scroll * img.direccionX;

        // LÓGICA EXCLUSIVA PARA LA IMAGEN CUADRICULANDO
        if (img.elemento.classList.contains("cuadri")) {
            // Calculamos la posición actual donde va la imagen en el eje Y
            // (La imagen inicia en top: 200px según tu CSS)
            const posicionActualY = 200 - moverY; 

            // Si la imagen intenta pasarse del límite, congelamos su movimiento vertical
            if (posicionActualY >= limiteFreno) {
                moverY = -(limiteFreno - 200);
            }
        }

        img.elemento.style.transform =
            `translate(${moverX}px, ${-moverY}px)
             rotate(${img.rotacion}deg)`;

    });
});
    


/*agitar y desaparecer*/

const fichas = document.querySelectorAll(
    ".img-01, .img-02, .img-03, .img-04"
);

fichas.forEach(ficha => {

    let intervalo;
    let intensidad = 10;
    let presionado = false;

    function iniciarAgitacion() {

        presionado = true;
        intensidad = 9;

        intervalo = setInterval(() => {

            intensidad += 2;

            const rotacion =
                (Math.random() * intensidad * 2) - intensidad;

            ficha.style.transform = `rotate(${rotacion}deg)`;

        }, 30);

        setTimeout(() => {

            if (presionado) {

                clearInterval(intervalo);

                ficha.style.transition =
                    "opacity 0.5s ease, transform 0.5s ease";

                    /*Desvanecer al desaparecer*/
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

    // Soporte para pantallas táctiles
    ficha.addEventListener("touchstart", iniciarAgitacion);
    ficha.addEventListener("touchend", detenerAgitacion);
});

/*tablero*/

// Esperar a que el documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleccionar todos los elementos que tengan la clase 'esquina'
    const esquinas = document.querySelectorAll('.esquina');

    esquinas.forEach(esquina => {
        
        // 1. ASIGNAR EL ORIGEN DE AGRANDAMIENTO SEGÚN EL COLOR (Para que no se muevan)
        if (esquina.classList.contains('esquina-amarilla')) {
            esquina.style.transformOrigin = "top left"; // Se agranda hacia abajo y la derecha
        } else if (esquina.classList.contains('esquina-roja')) {
            esquina.style.transformOrigin = "top right"; // Se agranda hacia abajo y la izquierda
        } else if (esquina.classList.contains('esquina-verde')) {
            esquina.style.transformOrigin = "bottom left"; // Se agranda hacia arriba y la derecha
        } else if (esquina.classList.contains('esquina-azul')) {
            esquina.style.transformOrigin = "bottom right"; // Se agranda hacia arriba y la izquierda
        }

        // 2. DETECTAR CUANDO EL CURSOR ENTRA A LA CASILLA
        esquina.addEventListener('mouseenter', () => {
            esquina.style.scale = "1.15"; // Se agranda un 15% levemente
            esquina.style.zIndex = "10";   // Se posiciona por encima de las casillas vecinas
            console.log("El cursor está sobre una casilla de esquina activa");
        });

        // 3. DETECTAR CUANDO EL CURSOR SALE DE LA CASILLA
        esquina.addEventListener('mouseleave', () => {
            esquina.style.scale = "1";    // Vuelve a su tamaño original
            esquina.style.zIndex = "1";    // Vuelve a su capa normal
        });

        // 4. DETECTAR CLICS EN LAS ESQUINAS
        esquina.addEventListener('click', (e) => {
            const colorCasilla = e.target.classList[1]; // Obtiene la clase de color
            console.log(`Se ha hecho clic en la esquina de color: ${colorCasilla}`);
        });
    });
});
// 1. Seleccionamos TODOS los párrafos de la página que tienen la animación
const todosLosParrafos = document.querySelectorAll("p");

// 2. Recorremos cada párrafo uno por uno
todosLosParrafos.forEach(parrafo => {
    // 3. Le asignamos el detector de clics a cada uno de forma independiente
    parrafo.addEventListener("click", () => {
        // Al hacer clic, le pega la clase solo al párrafo seleccionado
        parrafo.classList.add("detener-palpito");
    });
});



/*tablero*/

document.addEventListener("DOMContentLoaded", () => {
    const esquinas = document.querySelectorAll('.esquina');

    // Patrones visuales extraídos exactamente de tu video muestra
    const patrones = {
        'esquina-amarilla': [
            1,1,0,0,
            1,0,0,0,
            0,0,0,1,
            0,0,1,1
        ],
        'esquina-roja': [
            0,0,0,0,
            0,1,1,0,
            0,0,1,0,
            1,0,0,1
        ],
        'esquina-azul': [
            0,1,1,0,
            1,0,0,1,
            1,0,0,1,
            0,1,1,0
        ],
        'esquina-verde': [
            1,0,0,1,
            0,1,0,0,
            0,1,1,0,
            1,0,0,1
        ]
    };

    esquinas.forEach(esquina => {
        let tipoEsquina = '';
        let claseColor = '';
        let contenedorCentroSelector = '';

        // Identificamos la esquina y asociamos su zona central correspondiente
        if (esquina.classList.contains('esquina-amarilla')) { 
            tipoEsquina = 'esquina-amarilla'; claseColor = 'activo-amarillo'; contenedorCentroSelector = '.centro-amarillo'; 
        } else if (esquina.classList.contains('esquina-roja')) { 
            tipoEsquina = 'esquina-roja'; claseColor = 'activo-rojo'; contenedorCentroSelector = '.centro-roja'; 
        } else if (esquina.classList.contains('esquina-verde')) { 
            tipoEsquina = 'esquina-verde'; claseColor = 'activo-verde'; contenedorCentroSelector = '.centro-verde'; 
        } else if (esquina.classList.contains('esquina-azul')) { 
            tipoEsquina = 'esquina-azul'; claseColor = 'activo-azul'; contenedorCentroSelector = '.centro-azul'; 
        }

        // Buscamos el contenedor del centro del tablero HTML
        const contenedorCentro = document.querySelector(contenedorCentroSelector);

        if (contenedorCentro) {
            // Creamos la matriz de forma aislada en el centro vacío
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

            // 2. DETECTAR CUANDO EL CURSOR ENTRA A LA ESQUINA
            esquina.addEventListener('mouseenter', () => {
                esquina.style.scale = "1.15"; 
                esquina.style.zIndex = "10";
                
                // Muestra la matriz en el espacio vacío del medio
                matriz.classList.add('mostrar-matriz');
            });

            // 3. DETECTAR CUANDO EL CURSOR SALE DE LA ESQUINA
            esquina.addEventListener('mouseleave', () => {
                esquina.style.scale = "1";    
                esquina.style.zIndex = "2";
                
                // Oculta la matriz del espacio vacío
                matriz.classList.remove('mostrar-matriz');
            });
        }

        // Configuración de los orígenes de tus esquinas originales para el hover
        if (tipoEsquina === 'esquina-amarilla') esquina.style.transformOrigin = "top left";
        else if (tipoEsquina === 'esquina-roja') esquina.style.transformOrigin = "top right";
        else if (tipoEsquina === 'esquina-verde') esquina.style.transformOrigin = "bottom left";
        else if (tipoEsquina === 'esquina-azul') esquina.style.transformOrigin = "bottom right";

        esquina.addEventListener('click', (e) => {
            const colorCasilla = e.currentTarget.classList[1]; 
            console.log(`Se ha hecho clic en la esquina de color: ${colorCasilla}`);
        });
    });
});