//==============================DOM==============================
const header = document.querySelector(".header");
const nav = document.querySelector('.nav');
const overlay = document.querySelector('.overlay');
const topButton = document.querySelector('.top-button');
const menuToggle = document.querySelector('.menu-toggle');
const burgerNav = document.querySelector('.burger-nav');

// Toggler para el menú
const toggleMenu = () => {
  burgerNav.classList.toggle('show');
  menuToggle.classList.toggle('active');
  overlay.classList.toggle('active');
};

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

window.addEventListener('resize', () => {
  if (window.innerWidth < 768) {
    nav.classList.add('disable');
    menuToggle.classList.add('show');
  } else {
    nav.classList.remove('disable');
    menuToggle.classList.remove('show', 'active');
    overlay.classList.remove('active');
    burgerNav.classList.remove('show');
  }
});

// Scroll para activar la animación del encabezado y el botón superior
window.addEventListener("scroll", () => {
  header.classList.toggle("down", window.scrollY > 0);
  topButton.classList.toggle("show", window.scrollY > 0);
});

//==============================Modal==============================
const myModal = document.getElementById("myModal");
const closeModalBtn = document.getElementById("closeModalBtn");

closeModalBtn.addEventListener("click", () => {
  myModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === myModal) {
    myModal.style.display = "none";
  }
});

//============================== Cargar habilidades ==============================
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("skills-grid");

  try {
    // Cargar el JSON con Fetch
    const response = await fetch("./json/skills.json");

    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }

    const data = await response.json();

    // Agregar las habilidades al grid
    data.forEach(skill => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.title = skill.name;

      card.innerHTML = `
        <div class="skill-img">
          <img src="${skill.image}" alt="${skill.name}" height="60px" width="60px">
        </div>
        <div class="skill-title">
          <h4>${skill.name}</h4>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al procesar los datos del JSON:", error);
  }
});

//============================== Cargar proyectos ==============================
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("projects-grid");
  const modal = document.getElementById("myModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalTechnologies = document.getElementById("modalTechnologies");
  const modalLinks = document.getElementById("modalLinks");
  const particlesJs = document.getElementById("particles-js");

  try {
    // Cargar el JSON con Fetch
    const response = await fetch("./json/projects.json");

    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }

    const data = await response.json();

    // Generar las tarjetas dinámicamente
    data.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "card";

      const firstTwoTechnologies = project.technologies.slice(0, 3).map(tech => `<span class="tag">${tech}</span>`).join(" ");

      card.innerHTML = `
    <a href="${project.image}" data-fancybox="gallery-${index + 1}">
      <img src="${project.image}" class="card-img-top" alt="Sin Imagen">
    </a>
    <div class="card-body">
      <h5 class="card-title">${project.title}</h5>
      <p class="card-text">${project.description}</p>
      <div class="card-footer">
        <p class="content-technologies">
          <strong>Tecnologías:</strong>
          ${firstTwoTechnologies}
        </p>
        <div class="content-buttons">
          <button class="btn btn-more" data-project='${JSON.stringify(project)}'>Leer más</button>
        </div>
      </div>
    </div>
  `;

      grid.appendChild(card);
    });

    // Event listener para el botón "Leer más"
    const readMoreButtons = document.querySelectorAll(".btn-more");
    readMoreButtons.forEach(button => {
      button.addEventListener("click", function () {
        const project = JSON.parse(this.getAttribute("data-project"));
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.full_description;

        // Mostrar todas las tecnologías en el modal
        modalTechnologies.innerHTML = project.technologies.map(tech => `<span class="tag">${tech}</span>`).join(" ");

        // Verificar y mostrar los enlaces solo si no son "#"
        modalLinks.innerHTML = '';

        if (project.demoLink !== "#") {
          modalLinks.innerHTML += `<a href="${project.demoLink}" class="btn btn-demo" target="_blank">Ver Demo</a>`;
        }

        if (project.codeLink !== "#") {
          modalLinks.innerHTML += `<a href="${project.codeLink}" class="btn btn-outline-secondary" target="_blank">Ver Código</a>`;
        }

        modal.style.display = "block";

        // Desactivar el scroll del body
        document.body.classList.add("no-scroll");
      });
    });

    // Cerrar el modal cuando se hace clic en el botón de cerrar
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";

      // Volver a activar el scroll del body
      document.body.classList.remove("no-scroll");
    });

    // Cerrar el modal si se hace clic fuera de la ventana modal
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";

        // Volver a activar el scroll del body
        document.body.classList.remove("no-scroll");
      }
    });
  } catch (error) {
    console.error("Error al procesar los datos del JSON:", error);
  }
});

//==============================Email==============================
function copyToClipboard() {
  const email = "nicohv96@gmail.com";
  navigator.clipboard.writeText(email)
    .then(() => {
      showToast('success', 'Email copiado al portapapeles.');
    })
    .catch(err => {
      console.error("Error al copiar el texto: ", err);
    });
}

const getToastPosition = () => window.innerWidth <= 798 ? 'top' : 'top-end';

const showToast = (icon, title, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: getToastPosition(),
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: true
  });
};

document.getElementById('form-contact').addEventListener('submit', (e) => {
  e.preventDefault();

  const { name, email, message } = e.target.elements;
  if (!validateForm(name.value, email.value, message.value)) return;

  Swal.fire({
    toast: true,
    position: getToastPosition(),
    title: 'Procesando la solicitud...',
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch("https://formsubmit.co/ajax/nicohv96@gmail.com", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Nombre: name.value, Email: email.value, Mensaje: message.value })
  })
    .then(response => response.json())
    .then(data => {
      Swal.close();
      showToast(data.success === "false" ? 'error' : 'success',
        data.success === "false" ? 'Hubo un error al enviar el formulario. Intentalo de nuevo.' : 'Formulario enviado con éxito.');
      if (data.success !== "false") e.target.reset();
    })
    .catch(() => {
      Swal.close();
      showToast('error', 'Hubo un error al enviar el formulario. Intentalo de nuevo.');
    });
});

const validateForm = (name, email, message) => {
  let isValid = true;
  removeErrorStyles();

  if (!name) { addErrorStyle('name'); isValid = false; }
  if (!email || !validateEmail(email)) { addErrorStyle('email'); isValid = false; }
  if (!message) { addErrorStyle('message'); isValid = false; }

  if (!isValid) showToast('error', 'Por favor, corrige los errores en los campos resaltados.');
  return isValid;
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const addErrorStyle = (id) => document.getElementById(id).classList.add('input-error');
const removeErrorStyles = () => document.querySelectorAll('.input-error').forEach(field => field.classList.remove('input-error'));

//==============================Footer==============================
// Función para insertar el año actual en el footer
function setFooterYear() {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual
  document.getElementById('footer-year').textContent = currentYear;
}

// Ejecuta la función cuando la página se carga
window.onload = setFooterYear;

//==============================Cometas==============================
function createComet() {
  const container = document.getElementById('particles-js');
  const comet = document.createElement('div');
  comet.classList.add('comet');

  const randomX = Math.random() * window.innerWidth;
  const randomY = 0;

  comet.style.left = `${randomX}px`;
  comet.style.top = `${randomY}px`;

  container.appendChild(comet);

  setTimeout(() => {
    comet.remove();
  }, 1000);
}

setInterval(createComet, 5000);

//==============================Particulas==============================
particlesJS(
  {
    "particles": {
      "number": {
        "value": 200,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 0.2,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "bubble"
        },
        "onclick": {
          "enable": false,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": false
  }
);