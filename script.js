let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const form = document.getElementById("taskForm");
const container = document.getElementById("tasksContainer");
const taskId = document.getElementById("taskId");
const fecha = document.getElementById("fecha");
const materia = document.getElementById("materia");
const prioridad = document.getElementById("prioridad");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const filterPrioridad = document.getElementById("filterPrioridad");
const filterMateria = document.getElementById("filterMateria");
const orderFecha = document.getElementById("orderFecha");

function guardarLocal() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function renderTareas(lista = tareas) {
    container.innerHTML = "";

    lista.forEach((t, index) => {
        const card = document.createElement("div");
        card.className = "task-card";

        card.innerHTML = `
            <div class="actions">
                <button onclick="editarTarea(${index})">✏️</button>
                <button onclick="eliminarTarea(${index})">🗑️</button>
            </div>
            <span class="badge ${t.prioridad.toLowerCase()}">${t.prioridad}</span>
            <h3>${t.titulo}</h3>
            <p><strong>${t.materia}</strong></p>
            <p><em>${t.fecha}</em></p>
            <p>${t.descripcion.substring(0, 60)}...</p>
            <button onclick="verMas('${t.titulo}','${t.descripcion}')">Ver más</button>
        `;

        container.appendChild(card);
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const tarea = {
        fecha: fecha.value,
        materia: materia.value,
        prioridad: prioridad.value,
        titulo: titulo.value,
        descripcion: descripcion.value
    };

    const id = taskId.value;
    if (id === "") tareas.push(tarea);
    else tareas[id] = tarea;

    guardarLocal();
    aplicarFiltros(); 
    form.reset();
    taskId.value = "";
});

function editarTarea(i) {
    const t = tareas[i];
    fecha.value = t.fecha;
    materia.value = t.materia;
    prioridad.value = t.prioridad;
    titulo.value = t.titulo;
    descripcion.value = t.descripcion;
    taskId.value = i;
}

function eliminarTarea(i) {
    if (confirm("¿Eliminar esta tarea?")) {
        tareas.splice(i, 1);
        guardarLocal();
        aplicarFiltros(); 
    }
}

function verMas(titulo, descripcion) {
    modal.classList.remove("hidden");
    modalTitle.textContent = titulo;
    modalBody.textContent = descripcion;
}

closeModal.onclick = () => modal.classList.add("hidden");


function aplicarFiltros() {
    let listaFiltrada = [...tareas];

    
    if (filterPrioridad.value) {
        listaFiltrada = listaFiltrada.filter(t => t.prioridad === filterPrioridad.value);
    }

    
    if (filterMateria.value) {
        listaFiltrada = listaFiltrada.filter(t => t.materia === filterMateria.value);
    }

    
    if (orderFecha.value) {
        listaFiltrada.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return orderFecha.value === "asc" ? fechaA - fechaB : fechaB - fechaA;
        });
    }

    renderTareas(listaFiltrada);
}


filterPrioridad.addEventListener("change", aplicarFiltros);
filterMateria.addEventListener("change", aplicarFiltros);
orderFecha.addEventListener("change", aplicarFiltros);


renderTareas();
