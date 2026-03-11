document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Animaciones al hacer scroll (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // El elemento debe asomar un 15% para animarse
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-card');
                observer.unobserve(entry.target); // Solo lo animamos la primera vez que se ve
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Añadimos un pequeño retraso (delay) en cascada según su posición en la fila
        card.style.transitionDelay = `${(index % 4) * 0.1}s`; 
        card.classList.add('hidden-card'); // Estado inicial (oculto)
        observer.observe(card); // Empezamos a vigilar la carta
    });

    // --- 2. Resaltado dinámico del menú superior (Scrollspy) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach(section => {
            // Calculamos la posición considerando la altura del navbar sticky
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

    // Comprobamos que el visor 3D existe en esta página para evitar errores
    if (modelViewer && weaponButtons.length > 0) {
        weaponButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // 1. Quitar el estado 'activo' (rojo) a todos los botones y ponerlos grises
                weaponButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-danger', 'border-danger');
                    btn.classList.add('bg-dark', 'border-secondary');
                });
                
                // 2. Poner el estado 'activo' al botón que hemos clicado
                const clickedBtn = e.target;
                clickedBtn.classList.remove('bg-dark', 'border-secondary');
                clickedBtn.classList.add('active', 'bg-danger', 'border-danger');

                // 3. Obtener el nombre del arma del atributo "data-model"
                const modelName = clickedBtn.getAttribute('data-model');
                
                // 4. Cambiar el modelo 3D en la pantalla con una transición suave
                modelViewer.style.opacity = 0; // Lo ocultamos rápido
                setTimeout(() => {
                    // Cambiamos la ruta para que cargue el nuevo archivo .glb
                    modelViewer.src = `models/${modelName}.glb`; 
                    modelViewer.style.opacity = 1; // Lo volvemos a mostrar
                }, 300);
            });
        });
    }
});