// ======================================================
// SIMULACRO 3: GESTOR DE TAREAS (Corregido + Tarjetas con data-id)
// ======================================================

const CLAVE_LS = "tareas_dwec";

// Referencias al DOM
const formulario = document.getElementById("form-tarea");
const mensajeErrores = document.getElementById("mensaje");
const inputTituloEliminar = document.getElementById("titulo-eliminar");
const divErrorEliminar = document.getElementById("err-eliminar");
const btnEliminar = document.getElementById("btn-eliminar");
const btnFiltrarTodas = document.getElementById("btn-todas");
const btnFiltrarPrioritarias = document.getElementById("btn-prioritarias");
const pContadorTareas = document.getElementById("contador-tareas");
const divListaTareas = document.getElementById("lista-tareas");

class Tarea {
    constructor(titulo, descripcion, persona, fecha, prioritaria, id = Date.now()) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.persona = persona;
        this.fecha = fecha; // formato "yyyy-mm-dd"
        this.prioritaria = prioritaria; // boolean
    }

    fechaFormateada() {
        return this.fecha.split("-").reverse().join("/");
    }

    mostrarInformacion() {
        const estrella = this.prioritaria ? "★ " : "";
        return `${estrella}${this.titulo} - Descripción: ${this.descripcion}. Asignado a: ${this.persona}. Fecha límite: ${this.fechaFormateada()}.`;
    }
}

// Persistencia
function revivirObjetoTarea(arrayObj) {
    return arrayObj.map(elemento => new Tarea(
        String(elemento.titulo),
        String(elemento.descripcion),
        String(elemento.persona),
        String(elemento.fecha),
        Boolean(elemento.prioritaria),
        elemento.id
    ));
}

function cargarDeLocalStorage() {
    try {
        const tareasCadena = localStorage.getItem(CLAVE_LS);
        if (!tareasCadena) return [];
        const parsed = JSON.parse(tareasCadena);
        if (!Array.isArray(parsed)) return [];
        return revivirObjetoTarea(parsed);
    } catch {
        return [];
    }
}

function guardarTareasLocal() {
    localStorage.setItem(CLAVE_LS, JSON.stringify(tareas));
}

// Estado
let tareas = cargarDeLocalStorage();
let filtroActual = "todas"; // "todas" | "prioritarias"

// Errores y validación
function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    const ids = ["titulo", "descripcion", "fecha", "persona"];
    ids.forEach(id => {
        document.getElementById("err-" + id).textContent = "";
    });
    mensajeErrores.textContent = "";
    mensajeErrores.classList.remove("ok", "error");
}

function hoyISO() {
    const h = new Date();
    const mes = String(h.getMonth() + 1).padStart(2, "0");
    const dia = String(h.getDate()).padStart(2, "0");
    return `${h.getFullYear()}-${mes}-${dia}`;
}

function validar(data) {
    limpiarErrores();
    let hayErrores = false;

    const titulo = data.get("titulo").trim();
    const descripcion = data.get("descripcion").trim();
    const fecha = data.get("fecha").trim();
    const persona = data.get("persona");

    if (!titulo) {
        mostrarError("err-titulo", "El título de la tarea es obligatorio");
        hayErrores = true;
    } else if (tareas.some(t => t.titulo.toUpperCase() === titulo.toUpperCase())) {
        mostrarError("err-titulo", "Ya existe una tarea con ese título");
        hayErrores = true;
    }

    if (!descripcion) {
        mostrarError("err-descripcion", "La descripción es obligatoria");
        hayErrores = true;
    }

    if (!fecha) {
        mostrarError("err-fecha", "La fecha límite es obligatoria");
        hayErrores = true;
    } else if (fecha < hoyISO()) {
        mostrarError("err-fecha", "La fecha límite no puede ser anterior a hoy");
        hayErrores = true;
    }

    if (!persona) {
        mostrarError("err-persona", "Debes asignar la tarea a una persona");
        hayErrores = true;
    }

    if (hayErrores) {
        mensajeErrores.textContent = "Por favor, corrige los errores del formulario.";
        mensajeErrores.classList.add("error");
    }
    return !hayErrores;
}

function crearObjetoTarea(data) {
    return new Tarea(
        data.get("titulo").trim(),
        data.get("descripcion").trim(),
        data.get("persona"),
        data.get("fecha").trim(),
        data.has("prioritaria")
    );
}

function resetForm() {
    formulario.reset();
    limpiarErrores();
}

// ======================================================
// RENDER EN TARJETAS CON BOTÓN ELIMINAR (data-id)
// ======================================================
function obtenerTareasFiltradas() {
    if (filtroActual === "prioritarias") {
        return tareas.filter(t => t.prioritaria);
    }
    return tareas;
}

function renderizarTareas(arrayTareas) {
    divListaTareas.replaceChildren();

    if (arrayTareas.length === 0) {
        const p = document.createElement("p");
        p.id = "sin-tareas";
        p.textContent = "No hay tareas disponibles.";
        divListaTareas.appendChild(p);
        pContadorTareas.textContent = "Tareas: 0";
        return;
    }

    arrayTareas.forEach(tarea => {
        const div = document.createElement("div");
        div.className = tarea.prioritaria ? "tarea prioritaria" : "tarea";

        // data-id transporta el id numérico de la tarea (convertido a String en dataset)
        div.innerHTML = `
            <p>${tarea.mostrarInformacion()}</p>
            <button type="button" class="btn-eliminar-tarjeta" data-id="${tarea.id}">Eliminar</button>
        `;
        divListaTareas.appendChild(div);
    });

    pContadorTareas.textContent = `Tareas: ${arrayTareas.length}`;

    /* ------------------------------------------------------
       ALTERNATIVA 1: Renderizar solo texto sin botón dentro de la tarjeta
       ------------------------------------------------------
       arrayTareas.forEach(tarea => {
           const div = document.createElement("div");
           div.className = tarea.prioritaria ? "tarea prioritaria" : "tarea";
           div.textContent = tarea.mostrarInformacion();
           divListaTareas.appendChild(div);
       });
    */
}

// Delegación de eventos para eliminar tarea desde su tarjeta usando data-id
divListaTareas.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-eliminar-tarjeta");
    if (!boton) return;

    // dataset.id siempre devuelve un string, por eso lo pasamos a Number() para comparar con tarea.id
    const idTarea = Number(boton.dataset.id);
    tareas = tareas.filter(t => t.id !== idTarea);
    guardarTareasLocal();
    pintar();
});

function pintar() {
    renderizarTareas(obtenerTareasFiltradas());
}

function activarFiltro(nombre) {
    filtroActual = nombre;
    btnFiltrarTodas.classList.toggle("activo", nombre === "todas");
    btnFiltrarPrioritarias.classList.toggle("activo", nombre === "prioritarias");
    pintar();
}

// Eliminar por título (Corregido: antes ponía Culo.toUpperCase())
function eliminarTarea(arrayTareas, titulo) {
    return arrayTareas.filter(
        t => t.titulo.toUpperCase() !== titulo.toUpperCase()
    );
}

// Eventos
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(formulario);
    if (!validar(data)) return;

    const nueva = crearObjetoTarea(data);
    tareas.push(nueva);
    guardarTareasLocal();
    pintar();
    resetForm();

    mensajeErrores.textContent = "Tarea añadida correctamente.";
    mensajeErrores.classList.add("ok");
});

btnEliminar.addEventListener("click", (e) => {
    e.preventDefault();
    divErrorEliminar.textContent = "";
    const titulo = inputTituloEliminar.value.trim();

    if (!titulo) {
        divErrorEliminar.textContent = "Escribe el título de la tarea a eliminar";
        return;
    }

    const totalAntes = tareas.length;
    tareas = eliminarTarea(tareas, titulo);

    if (tareas.length === totalAntes) {
        divErrorEliminar.textContent = "No existe ninguna tarea con ese título";
        return;
    }

    guardarTareasLocal();
    inputTituloEliminar.value = "";
    pintar();
});

btnFiltrarTodas.addEventListener("click", () => activarFiltro("todas"));
btnFiltrarPrioritarias.addEventListener("click", () => activarFiltro("prioritarias"));

// Arranque
pintar();
