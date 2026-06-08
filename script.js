
const imagenes = [

    {
        elemento: document.querySelector(".img-01"),
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
        elemento: document.querySelector(".img-003-2"),
        rotacion: 45,
        velocidad: 0.7,
        direccionX: -0.25
    },
{
        elemento: document.querySelector(".img-004-1"),
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

    imagenes.forEach(img => {

        if (!img.elemento) return;

        const moverY = scroll * img.velocidad;
        const moverX = scroll * img.direccionX;

        img.elemento.style.transform =
            `translate(${moverX}px, ${-moverY}px)
             rotate(${img.rotacion}deg)`;

    });

    
}


)

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
        
        // Ejemplo opcional: Detectar cuando el mouse entra a la casilla
        esquina.addEventListener('mouseenter', () => {
            // Aquí puedes ejecutar lógica extra cuando el cursor pasa por encima
            console.log("El cursor está sobre una casilla de esquina activa");
        });

        // Ejemplo opcional: Detectar cuando el mouse sale de la casilla
        esquina.addEventListener('mouseleave', () => {
            // Aquí puedes revertir lógicas si es necesario
        });

        // Ejemplo útil: Detectar clics en las esquinas para futuras mecánicas
        esquina.addEventListener('click', (e) => {
            const colorCasilla = e.target.classList[1]; // Obtiene la clase de color (amarillo, rojo, etc.)
            console.log(`Se ha hecho clic en la esquina de color: ${colorCasilla}`);
        });
    });
});