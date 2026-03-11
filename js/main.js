document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Animaciones al hacer scroll (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-card');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        card.classList.add('hidden-card');
        observer.observe(card);
    });

    // --- 2. Resaltado dinámico del menú superior (Scrollspy) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active', 'text-danger', 'fw-bold');
            if (link.getAttribute('href').includes(currentSection) && currentSection !== '') {
                link.classList.add('active', 'text-danger', 'fw-bold');
            }
        });
    });

    // --- 3. VISOR DE ARMAS 3D ---
    const weaponButtons = document.querySelectorAll('.weapon-selector button');
    const modelViewer = document.getElementById('visor-arma');

    if (modelViewer && weaponButtons.length > 0) {
        weaponButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                weaponButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-danger', 'border-danger');
                    btn.classList.add('bg-dark', 'border-secondary');
                });

                const clickedBtn = e.target;
                clickedBtn.classList.remove('bg-dark', 'border-secondary');
                clickedBtn.classList.add('active', 'bg-danger', 'border-danger');

                const modelName = clickedBtn.getAttribute('data-model');
                modelViewer.style.opacity = 0; 
                setTimeout(() => {
                    modelViewer.src = `models/${modelName}.glb`;
                    modelViewer.style.opacity = 1;
                }, 300);
            });
        });
    }

    // --- 4. BOTÓN VOLVER ARRIBA ---
    const backToTopBtn = document.getElementById("btn-back-to-top");
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 5. SISTEMA DE AUDIO (Soundtrack y Efectos) ---
    const ost = document.getElementById('main-soundtrack');
    const btnPlay = document.getElementById('btn-play-pause');
    const sliderVolumen = document.getElementById('volumen-slider');
    const iconoVolumen = document.getElementById('volume-icon');

    // Lista de efectos de click (Volumen bajo 0.15)
    const sonidosValorant = [
        new Audio('mp3/kill.mp3'),
        new Audio('mp3/kill2.mp3'),
        new Audio('mp3/kill3.mp3'),
        new Audio('mp3/kill4.mp3'),
        new Audio('mp3/kill5.mp3')
    ];
    sonidosValorant.forEach(s => s.volume = 0.15); // Bajamos volumen de efectos

    let indiceActual = 0;

    // Función para la música que arranca al primer click del usuario
    function iniciarWebAudio() {
        if (ost.paused) {
            ost.volume = 0.3; // Volumen inicial de la música
            ost.play().then(() => {
                btnPlay.innerHTML = '⏸';
                // Quitamos el listener para que no se reinicie la música cada vez que clicas
                document.removeEventListener('click', iniciarWebAudio);
            }).catch(e => console.log("Esperando interacción..."));
        }
    }

    // Escuchamos el primer click en cualquier parte para activar la música
    document.addEventListener('click', iniciarWebAudio);

    // Función para los efectos de sonido de los botones
    function reproducirCicloSonido() {
        const sonido = sonidosValorant[indiceActual];
        sonido.currentTime = 0;
        sonido.play();
        indiceActual = (indiceActual + 1) % sonidosValorant.length;
    }

    // Asignar sonidos a todos los botones e interacciones
    const botonesInteractivos = document.querySelectorAll('button, .nav-link, .mapa-link, .list-group-item, .accordion-button');
    botonesInteractivos.forEach(boton => {
        boton.addEventListener('click', reproducirCicloSonido);
    });

    // Controles del Panel de Música (Play/Pause)
    btnPlay.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que este click active la función 'iniciarWebAudio' dos veces
        if (ost.paused) {
            ost.play();
            btnPlay.innerHTML = '⏸';
        } else {
            ost.pause();
            btnPlay.innerHTML = '▶';
        }
    });

    // Control del Slider de Volumen
    sliderVolumen.addEventListener('input', (e) => {
        const vol = e.target.value;
        ost.volume = vol;
        if (vol == 0) iconoVolumen.innerHTML = '🔇';
        else if (vol < 0.5) iconoVolumen.innerHTML = '🔈';
        else iconoVolumen.innerHTML = '🔊';
    });
});