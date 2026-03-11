document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. ANIMACIONES DE CARGA (INTERSECTION OBSERVER)
       ========================================================================== */
    
    // Configuración del observador: detecta cuando el elemento entra en pantalla
    const observerOptions = {
        root: null, // Usa el viewport del navegador
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    // Lógica para añadir la clase de animación 'show-card'
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-card'); // Muestra la tarjeta
                observer.unobserve(entry.target); // Deja de vigilarla tras animar
            }
        });
    }, observerOptions);

    // Seleccionamos todas las tarjetas y les aplicamos un retraso en cascada
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 4) * 0.1}s`; // Efecto de carga secuencial
        card.classList.add('hidden-card'); // Estado invisible inicial
        observer.observe(card); // Iniciamos vigilancia
    });


    /* ==========================================================================
       2. RESALTADO DINÁMICO DEL MENÚ (SCROLLSPY)
       ========================================================================== */

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Escuchamos el scroll para saber en qué sección está el usuario
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Ajuste por la altura del Navbar
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        // Aplicamos estilos de 'activo' al enlace correspondiente del menú
        navLinks.forEach(link => {
            link.classList.remove('active', 'text-danger', 'fw-bold');
            if (link.getAttribute('href').includes(currentSection) && currentSection !== '') {
                link.classList.add('active', 'text-danger', 'fw-bold');
            }
        });
    });


    /* ==========================================================================
       3. VISOR DE ARMAS 3D (MODEL VIEWER)
       ========================================================================== */

    const weaponButtons = document.querySelectorAll('.weapon-selector button');
    const modelViewer = document.getElementById('visor-arma');

    // Lógica para cambiar el modelo .glb al pulsar los botones
    if (modelViewer && weaponButtons.length > 0) {
        weaponButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Reiniciamos estilos de todos los botones
                weaponButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-danger', 'border-danger');
                    btn.classList.add('bg-dark', 'border-secondary');
                });

                // Activamos el botón pulsado
                const clickedBtn = e.target;
                clickedBtn.classList.remove('bg-dark', 'border-secondary');
                clickedBtn.classList.add('active', 'bg-danger', 'border-danger');

                // Cambiamos el archivo 3D con una transición de opacidad
                const modelName = clickedBtn.getAttribute('data-model');
                modelViewer.style.opacity = 0; 
                setTimeout(() => {
                    modelViewer.src = `models/${modelName}.glb`; // Carga el nuevo modelo
                    modelViewer.style.opacity = 1;
                }, 300);
            });
        });
    }


    /* ==========================================================================
       4. BOTÓN VOLVER ARRIBA (BACK TO TOP)
       ========================================================================== */

    const backToTopBtn = document.getElementById("btn-back-to-top");
    
    // Mostrar u ocultar el botón según la posición del scroll
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    // Acción de subir suavemente al inicio
    backToTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    /* ==========================================================================
       5. SISTEMA DE AUDIO (SOUNDTRACK Y EFECTOS)
       ========================================================================== */

    const ost = document.getElementById('main-soundtrack');
    const btnPlay = document.getElementById('btn-play-pause');
    const sliderVolumen = document.getElementById('volumen-slider');
    const iconoVolumen = document.getElementById('volume-icon');

    // Galería de sonidos para los clicks (Carga de archivos mp3)
    const sonidosValorant = [
        new Audio('mp3/kill.mp3'),
        new Audio('mp3/kill2.mp3'),
        new Audio('mp3/kill3.mp3'),
        new Audio('mp3/kill4.mp3'),
        new Audio('mp3/kill5.mp3')
    ];
    // Ajustamos volumen de efectos para que no saturen
    sonidosValorant.forEach(s => s.volume = 0.15); 

    let indiceActual = 0;

    // Función de inicio: La música arranca tras el primer click del usuario (Requisito navegador)
    function iniciarWebAudio() {
        if (ost.paused) {
            ost.volume = 0.3; // Volumen inicial moderado
            ost.play().then(() => {
                btnPlay.innerHTML = '⏸'; // Cambia icono a pausa
                document.removeEventListener('click', iniciarWebAudio); // Se desactiva tras el inicio
            }).catch(e => console.log("Interacción necesaria para audio..."));
        }
    }

    document.addEventListener('click', iniciarWebAudio);

    // Función para reproducir el ciclo de 5 sonidos de forma secuencial
    function reproducirCicloSonido() {
        const sonido = sonidosValorant[indiceActual];
        sonido.currentTime = 0; // Reinicia el audio si se clica rápido
        sonido.play();
        indiceActual = (indiceActual + 1) % sonidosValorant.length; // Ciclo 0-4
    }

    // Aplicamos los sonidos a todos los elementos interactivos de la web
    const botonesInteractivos = document.querySelectorAll('button, .nav-link, .mapa-link, .list-group-item, .accordion-button');
    botonesInteractivos.forEach(boton => {
        boton.addEventListener('click', reproducirCicloSonido);
    });

    // Control manual de reproducción (Play/Pause)
    btnPlay.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que este click active la función de inicio general
        if (ost.paused) {
            ost.play();
            btnPlay.innerHTML = '⏸';
        } else {
            ost.pause();
            btnPlay.innerHTML = '▶';
        }
    });

    // Slider de control de volumen dinámico
    sliderVolumen.addEventListener('input', (e) => {
        const vol = e.target.value;
        ost.volume = vol;
        // Cambio de icono visual según el nivel de volumen
        if (vol == 0) iconoVolumen.innerHTML = '🔇';
        else if (vol < 0.5) iconoVolumen.innerHTML = '🔈';
        else iconoVolumen.innerHTML = '🔊';
    });
});