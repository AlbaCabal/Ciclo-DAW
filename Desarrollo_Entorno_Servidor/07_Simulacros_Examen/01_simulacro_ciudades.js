// ======================================================
// SIMULACRO 1: EJERCICIO CIUDADES (Corregido + Tarjetas con data-id)
// ======================================================

const CLAVE_LS = "ciudades_dwec";

class Ciudad {
    constructor(ciudad, cp, habitantes, id = Date.now() + Math.random()) {
        this.id = String(id);
        this.ciudad = ciudad;
        this.cp = cp;
        this.habitantes = Number(habitantes);
    }

    mostrarInformacion() {
        return `${this.ciudad} (${this.cp}) - ${this.habitantes} habitantes`;
    }
}

// Revivir objetos desde localStorage para recuperar los métodos de la clase
function revivirObjetoCiudad(arrayObj) {
    return arrayObj.map(elemento => new Ciudad(
        String(elemento.ciudad),
        String(elemento.cp),
        Number(elemento.habitantes),
        elemento.id
    ));
}

function cargarDeLocalStorage() {
    try {
        const ciudadesCadena = localStorage.getItem(CLAVE_LS);
        if (!ciudadesCadena) return [];
        const parsed = JSON.parse(ciudadesCadena);
        if (!Array.isArray(parsed)) return [];
        return revivirObjetoCiudad(parsed);
    } catch {
        return [];
    }
}

function guardarCiudadesLocal() {
    localStorage.setItem(CLAVE_LS, JSON.stringify(ciudades));
}

// Referencias al DOM
const form = document.getElementById("formCiudades");
const contenedorCiudades = document.getElementById("listaCiudades");
const divEstadisticas = document.getElementById("estadisticas");
const btnCalculaEstadisticas = document.getElementById("calcula_estadisticas");
const mensajeErrores = document.getElementById("mensaje-errores");

// // Crear controles de filtro y eliminación por nombre si no vienen en el HTML
// function crearControlesSiFaltan() {
//     if (document.getElementById("filtro-habitantes")) return;
//     const bloque = document.createElement("section");
//     bloque.innerHTML = `
//         <h2>Filtrar y eliminar</h2>
//         <label for="filtro-habitantes">Habitantes mínimos:</label>
//         <input type="text" id="filtro-habitantes" placeholder="Ej: 50000">
//         <button type="button" id="btn-filtrar">Filtrar</button>
//         <button type="button" id="btn-quitar-filtro">Quitar filtro</button>
//         <span id="err-filtro" class="error"></span>
//         <br><br>
//         <label for="ciudad-eliminar">Eliminar ciudad por nombre:</label>
//         <input type="text" id="ciudad-eliminar" placeholder="Nombre de la ciudad">
//         <button type="button" id="btn-eliminar">Eliminar</button>
//         <span id="err-eliminar" class="error"></span>
//     `;
//     contenedorCiudades.previousElementSibling.before(bloque);
// }
//
// crearControlesSiFaltan();

const inputFiltro = document.getElementById("filtro-habitantes");
const btnFiltrar = document.getElementById("btn-filtrar");
const btnQuitarFiltro = document.getElementById("btn-quitar-filtro");
const errFiltro = document.getElementById("err-filtro");
const inputEliminar = document.getElementById("ciudad-eliminar");
const btnEliminar = document.getElementById("btn-eliminar");
const errEliminar = document.getElementById("err-eliminar");

// Estado
let ciudades = cargarDeLocalStorage();
let filtroMinimo = null;
let estadisticasVisibles = false;

// Validación
function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    const ids = ["ciudad", "cp", "habitantes"];
    ids.forEach(id => {
        document.getElementById("err-" + id).textContent = "";
    });
    mensajeErrores.textContent = "";
}

function validar(data) {
    limpiarErrores();
    let hayErrores = false;

    const ciudad = data.get("ciudad").trim();
    const cp = data.get("cp").trim();
    const habitantes = data.get("habitantes").trim();

    if (!ciudad) {
        mostrarError("err-ciudad", "El nombre de la ciudad es obligatorio");
        hayErrores = true;
    } else if (ciudades.some(c => c.ciudad.toUpperCase() === ciudad.toUpperCase())) {
        mostrarError("err-ciudad", "Esa ciudad ya está en la lista");
        hayErrores = true;
    }

    if (!cp) {
        mostrarError("err-cp", "El código postal es obligatorio");
        hayErrores = true;
    } else if (!/^\d{5}$/.test(cp)) {
        mostrarError("err-cp", "El código postal debe tener 5 dígitos");
        hayErrores = true;
    }

    if (!habitantes) {
        mostrarError("err-habitantes", "El número de habitantes es obligatorio");
        hayErrores = true;
    } else if (!/^[1-9]\d*$/.test(habitantes)) {
        mostrarError("err-habitantes", "Los habitantes deben ser un número entero mayor que 0");
        hayErrores = true;
    }

    if (hayErrores) {
        mensajeErrores.textContent = "Por favor, corrige los errores del formulario.";
    }
    return !hayErrores;
}

function crearObjetoCiudad(data) {
    return new Ciudad(
        data.get("ciudad").trim(),
        data.get("cp").trim(),
        Number(data.get("habitantes").trim())
    );
}

function resetForm() {
    form.reset();
    limpiarErrores();
}

// ======================================================
// RENDER EN TARJETAS CON BOTÓN ELIMINAR (data-id)
// ======================================================
function renderizarCiudades(arrayCiudades) {
    contenedorCiudades.replaceChildren();

    if (arrayCiudades.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No hay ciudades que mostrar.";
        contenedorCiudades.appendChild(p);
        return;
    }

    arrayCiudades.forEach(ciudad => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-ciudad";

        // data-id en HTML para transportar el identificador del objeto
        tarjeta.innerHTML = `
            <h3>${ciudad.ciudad} (CP: ${ciudad.cp})</h3>
            <p>Habitantes: ${ciudad.habitantes}</p>
            <button type="button" class="btn-eliminar-tarjeta" data-id="${ciudad.id}">Eliminar</button>
        `;
        contenedorCiudades.appendChild(tarjeta);
    });

    /* ------------------------------------------------------
       ALTERNATIVA 1: Pintar como <ul><li> simple sin tarjetas
       ------------------------------------------------------
       arrayCiudades.forEach(ciudad => {
           const li = document.createElement("li");
           li.textContent = ciudad.mostrarInformacion();
           contenedorCiudades.appendChild(li);
       });
    */
}

// Delegación de eventos para el botón eliminar dentro de cada tarjeta
contenedorCiudades.addEventListener("click", (e) => {
    const boton = e.target.closest(".btn-eliminar-tarjeta");
    if (!boton) return;

    const idCiudad = boton.dataset.id;
    ciudades = ciudades.filter(c => c.id !== idCiudad);
    guardarCiudadesLocal();
    pintar();
});

// Estadísticas
function calculoEstadisticas(arrayCiudades) {
    if (arrayCiudades.length === 0) {
        return {
            totalCiudades: 0,
            totalHabitantes: 0,
            ciudadMasGrande: "N/A",
            ciudadMenosHabitantes: "N/A",
            promedioHabitantes: 0
        };
    }

    const totalCiudades = arrayCiudades.length;
    const totalHabitantes = arrayCiudades.reduce((acc, ciudad) => acc + ciudad.habitantes, 0);
    const promedioHabitantes = (totalHabitantes / totalCiudades).toFixed(2);

    const objMasGrande = arrayCiudades.reduce((acu, ciudad) =>
        (ciudad.habitantes > acu.habitantes ? ciudad : acu), arrayCiudades[0]
    );
    const objMenosHabitantes = arrayCiudades.reduce((acu, ciudad) =>
        (ciudad.habitantes < acu.habitantes ? ciudad : acu), arrayCiudades[0]
    );

    return {
        totalCiudades,
        totalHabitantes,
        ciudadMasGrande: objMasGrande.ciudad,
        ciudadMenosHabitantes: objMenosHabitantes.ciudad,
        promedioHabitantes
    };
}

function renderizarEstadisticas(objetoEstadisticas) {
    divEstadisticas.replaceChildren();
    const datos = [
        `Total ciudades: ${objetoEstadisticas.totalCiudades}`,
        `Total habitantes: ${objetoEstadisticas.totalHabitantes}`,
        `Ciudad más grande: ${objetoEstadisticas.ciudadMasGrande}`,
        `Ciudad con menos habitantes: ${objetoEstadisticas.ciudadMenosHabitantes}`,
        `Promedio habitantes: ${objetoEstadisticas.promedioHabitantes}`
    ];

    datos.forEach(texto => {
        const p = document.createElement("p");
        p.textContent = texto;
        divEstadisticas.appendChild(p);
    });
}

// Filtrar y eliminar por nombre
function filtrarCiudadesPorHabitantes(arrayCiudades, numHabitantes) {
    return arrayCiudades.filter(ciudad => ciudad.habitantes >= numHabitantes);
}

function eliminarCiudad(arrayCiudades, nombreCiudad) {
    return arrayCiudades.filter(
        ciudad => ciudad.ciudad.toUpperCase() !== nombreCiudad.toUpperCase()
    );
}

function pintar() {
    const lista = filtroMinimo === null
        ? ciudades
        : filtrarCiudadesPorHabitantes(ciudades, filtroMinimo);

    renderizarCiudades(lista);

    if (estadisticasVisibles) {
        renderizarEstadisticas(calculoEstadisticas(lista));
    }
}

// Eventos
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!validar(data)) return;

    const nuevo = crearObjetoCiudad(data);
    ciudades.push(nuevo);
    guardarCiudadesLocal();
    pintar();
    resetForm();
});

btnCalculaEstadisticas.addEventListener("click", () => {
    estadisticasVisibles = true;
    pintar();
});

btnFiltrar.addEventListener("click", () => {
    errFiltro.textContent = "";
    const valor = inputFiltro.value.trim();
    if (!/^\d+$/.test(valor)) {
        errFiltro.textContent = "Introduce un número entero (0 o más)";
        return;
    }
    filtroMinimo = Number(valor);
    pintar();
});

btnQuitarFiltro.addEventListener("click", () => {
    filtroMinimo = null;
    inputFiltro.value = "";
    errFiltro.textContent = "";
    pintar();
});

btnEliminar.addEventListener("click", () => {
    errEliminar.textContent = "";
    const nombre = inputEliminar.value.trim();
    if (!nombre) {
        errEliminar.textContent = "Escribe el nombre de la ciudad a eliminar";
        return;
    }
    const totalAntes = ciudades.length;
    ciudades = eliminarCiudad(ciudades, nombre);
    if (ciudades.length === totalAntes) {
        errEliminar.textContent = "No existe ninguna ciudad con ese nombre";
        return;
    }
    guardarCiudadesLocal();
    inputEliminar.value = "";
    pintar();
});

// Arranque inicial
pintar();
