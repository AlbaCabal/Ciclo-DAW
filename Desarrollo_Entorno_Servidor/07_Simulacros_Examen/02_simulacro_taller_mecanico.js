// ======================================================
// SIMULACRO 2: TALLER MECÁNICO PRO (Corregido + Tarjetas con data-matricula)
// ======================================================

const CONFIG = {
    IVA: 21,
    MANO_OBRA_HORA: 45,
    TARIFAS: {
        "Motor":      { pieza: 120, tiempo: 3 },
        "Frenos":     { pieza: 60,  tiempo: 1.5 },
        "Ruedas":     { pieza: 200, tiempo: 1 },
        "Carrocería": { pieza: 150, tiempo: 4 },
        "General":    { pieza: 0,   tiempo: 2 },
        "Otros":      { pieza: 50,  tiempo: 1 }
    }
};

const CLAVE_LS = "cochesTaller";

// Elementos del DOM
const form = document.getElementById("form");
const marca = document.getElementById("marca");
const especificarMarca = document.getElementById("especificarMarca");
const detalleOtros = document.getElementById("detalleOtros");
const incidenciasOtros = document.getElementById("incidenciasOtros");
const ocultoOtrosMarca = document.getElementById("ocultoOtrosMarca");
const ocultoOtrosIncidencia = document.getElementById("ocultoOtrosIncidencia");
const mensajeResultado = document.getElementById("mensaje-resultado");
const contenedorCoches = document.querySelector(".contenedores-coches");
const totalCoches = document.getElementById("total-coches");
const balanceTotal = document.getElementById("balance-total");
const modalDuplicado = document.getElementById("modal-duplicado");

class Coche {
    constructor(propietario, matricula, marca, incidencias, fechaEntrada) {
        this.propietario = propietario;
        this.matricula = matricula;
        this.marca = marca;
        this.incidencias = incidencias; // array de { tipo, detalle }
        this.fechaEntrada = fechaEntrada || new Date().toLocaleString("es-ES");
    }
}

// Persistencia
function revivirCoches(arrayObj) {
    return arrayObj.map(c => new Coche(
        String(c.propietario),
        String(c.matricula),
        String(c.marca),
        Array.isArray(c.incidencias)
            ? c.incidencias.map(i => ({ tipo: String(i.tipo), detalle: String(i.detalle || "") }))
            : [],
        c.fechaEntrada
    ));
}

function cargarDeLocalStorage() {
    try {
        const cadena = localStorage.getItem(CLAVE_LS);
        if (!cadena) return [];
        const parsed = JSON.parse(cadena);
        return Array.isArray(parsed) ? revivirCoches(parsed) : [];
    } catch {
        return [];
    }
}

function guardarCochesLocal() {
    localStorage.setItem(CLAVE_LS, JSON.stringify(coches));
}

let coches = cargarDeLocalStorage();
let cochePendiente = null;

// Utilidades
function escapeHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatoEuros(numero) {
    return numero.toFixed(2).replace(".", ",") + " €";
}

function mostrarMensaje(texto, tipo) {
    mensajeResultado.textContent = texto;
    mensajeResultado.className = tipo;
}

// Campos dinámicos "Otros"
ocultoOtrosMarca.style.display = "none";
ocultoOtrosIncidencia.style.display = "none";

marca.addEventListener("change", () => {
    if (marca.value === "Otros") {
        ocultoOtrosMarca.style.display = "block";
    } else {
        ocultoOtrosMarca.style.display = "none";
        especificarMarca.value = "";
        document.getElementById("err-especificarMarca").textContent = "";
    }
});

incidenciasOtros.addEventListener("change", () => {
    if (incidenciasOtros.checked) {
        ocultoOtrosIncidencia.style.display = "block";
    } else {
        ocultoOtrosIncidencia.style.display = "none";
        detalleOtros.value = "";
        document.getElementById("err-detalleOtros").textContent = "";
    }
});

// Validación
function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
}

function limpiarErrores() {
    const ids = ["propietario", "matricula", "marca", "especificarMarca", "incidencias", "detalleOtros"];
    ids.forEach(id => {
        document.getElementById("err-" + id).textContent = "";
    });
    mensajeResultado.textContent = "";
    mensajeResultado.className = "";
}

function validar(data) {
    limpiarErrores();
    let hayErrores = false;

    if (!data.get("propietario").trim()) {
        mostrarError("err-propietario", "El propietario es obligatorio");
        hayErrores = true;
    }

    const matricula = data.get("matricula").trim().toUpperCase();
    if (!matricula) {
        mostrarError("err-matricula", "La matrícula es obligatoria");
        hayErrores = true;
    } else if (!/^\d{4}[A-Z]{3}$/.test(matricula)) {
        mostrarError("err-matricula", "Formato de matrícula: 4 números y 3 letras (1234ABC)");
        hayErrores = true;
    }

    if (!data.get("marca")) {
        mostrarError("err-marca", "Selecciona una marca");
        hayErrores = true;
    }

    if (data.get("marca") === "Otros" && !data.get("especificarMarca").trim()) {
        mostrarError("err-especificarMarca", "Especifica la marca");
        hayErrores = true;
    }

    const incidencias = data.getAll("incidencias");
    if (incidencias.length === 0) {
        mostrarError("err-incidencias", "Selecciona una incidencia");
        hayErrores = true;
    }

    if (incidencias.includes("Otros") && !data.get("detalleOtros").trim()) {
        mostrarError("err-detalleOtros", "Describe la incidencia");
        hayErrores = true;
    }

    if (hayErrores) {
        mostrarMensaje("Revisa los errores del formulario", "error");
    }
    return !hayErrores;
}

function crearObjetoCoche(data) {
    let marcaFinal = data.get("marca");
    if (marcaFinal === "Otros") {
        marcaFinal = data.get("especificarMarca").trim();
    }

    const incidencias = data.getAll("incidencias").map(tipo => ({
        tipo: tipo,
        detalle: tipo === "Otros" ? data.get("detalleOtros").trim() : ""
    }));

    return new Coche(
        data.get("propietario").trim(),
        data.get("matricula").trim().toUpperCase(),
        marcaFinal,
        incidencias
    );
}

function resetForm() {
    form.reset();
    ocultoOtrosMarca.style.display = "none";
    ocultoOtrosIncidencia.style.display = "none";
    limpiarErrores();
}

// Cálculos
function calcularPresupuesto(coche) {
    let subtotal = 0;
    const lineas = coche.incidencias.map(inc => {
        const tarifa = CONFIG.TARIFAS[inc.tipo] || CONFIG.TARIFAS["Otros"];
        const manoObra = tarifa.tiempo * CONFIG.MANO_OBRA_HORA;
        const total = tarifa.pieza + manoObra;
        subtotal += total;
        return { inc: inc, pieza: tarifa.pieza, manoObra: manoObra, total: total };
    });

    const iva = subtotal * CONFIG.IVA / 100;
    return { lineas: lineas, subtotal: subtotal, iva: iva, total: subtotal + iva };

    /* ------------------------------------------------------
       ALTERNATIVA 1: Calcular el subtotal usando .reduce()
       ------------------------------------------------------
       const subtotal = coche.incidencias.reduce((acc, inc) => {
           const tarifa = CONFIG.TARIFAS[inc.tipo] || CONFIG.TARIFAS["Otros"];
           return acc + tarifa.pieza + (tarifa.tiempo * CONFIG.MANO_OBRA_HORA);
       }, 0);
    */
}

// Filtro dinámico por marca
function crearFiltro() {
    let select = document.getElementById("filtro-marca");
    if (select) return select;

    const destino = document.querySelector(".titulo-bandeja") || contenedorCoches.parentElement;
    const label = document.createElement("label");
    label.htmlFor = "filtro-marca";
    label.textContent = "Filtrar por marca: ";

    select = document.createElement("select");
    select.id = "filtro-marca";

    destino.appendChild(label);
    destino.appendChild(select);
    return select;
}

const filtroMarca = crearFiltro();

function actualizarOpcionesFiltro() {
    const seleccionada = filtroMarca.value || "todos";
    const marcas = [...new Set(coches.map(c => c.marca))].sort();
    filtroMarca.replaceChildren();
    filtroMarca.add(new Option("Todas las marcas", "todos"));
    marcas.forEach(m => filtroMarca.add(new Option(m, m)));
    filtroMarca.value = marcas.includes(seleccionada) ? seleccionada : "todos";
}

filtroMarca.addEventListener("change", () => {
    mostrarCoches();
});

// ======================================================
// MOSTRAR TARJETAS + PANEL DE CONTROL (CORREGIDO)
// ======================================================
function mostrarCoches() {
    actualizarOpcionesFiltro();
    contenedorCoches.replaceChildren();

    let balance = 0;
    coches.forEach(c => {
        balance += calcularPresupuesto(c).total;
    });

    const visibles = filtroMarca.value === "todos"
        ? coches
        : coches.filter(c => c.marca === filtroMarca.value);

    visibles.forEach(coche => {
        const p = calcularPresupuesto(coche);
        let html = `
            <h3>${escapeHTML(coche.marca)} - ${escapeHTML(coche.matricula)}</h3>
            <p>Propietario: ${escapeHTML(coche.propietario)}</p>
            <p>Entrada: ${escapeHTML(coche.fechaEntrada)}</p>
            <ul>`;

        p.lineas.forEach(l => {
            const nombre = l.inc.tipo === "Otros"
                ? "Otros (" + escapeHTML(l.inc.detalle) + ")"
                : escapeHTML(l.inc.tipo);
            html += `<li>${nombre}: pieza ${formatoEuros(l.pieza)} + mano de obra ${formatoEuros(l.manoObra)} = ${formatoEuros(l.total)}</li>`;
        });

        html += `
            </ul>
            <p>Subtotal: ${formatoEuros(p.subtotal)}</p>
            <p>IVA (${CONFIG.IVA}%): ${formatoEuros(p.iva)}</p>
            <p><strong>Total: ${formatoEuros(p.total)}</strong></p>
            <button type="button" class="eliminar" data-matricula="${escapeHTML(coche.matricula)}">Eliminar</button>
        `;

        // CORREGIDO: Crear e insertar la tarjeta DENTRO del forEach
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-coche";
        tarjeta.innerHTML = html;
        contenedorCoches.appendChild(tarjeta);
    });

    totalCoches.textContent = coches.length;
    balanceTotal.textContent = formatoEuros(balance);
}

// Envío del formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!validar(data)) return;

    const nuevo = crearObjetoCoche(data);

    // ¿Ya existe esa matrícula?
    const existe = coches.some(c => c.matricula === nuevo.matricula);
    if (existe) {
        cochePendiente = nuevo;
        modalDuplicado.showModal();
        return;
    }

    coches.push(nuevo);
    finalizarRegistro(nuevo, "Entrada registrada");
});

function finalizarRegistro(coche, titulo) {
    guardarCochesLocal();
    mostrarCoches();
    resetForm();
    mostrarMensaje(
        `${titulo}: ${coche.marca} ${coche.matricula} (${coche.propietario}) - ${coche.incidencias.length} incidencia(s)`,
        "ok"
    );
}

// ======================================================
// ELIMINAR TARJETA CON data-matricula (Delegación de eventos)
// ======================================================
contenedorCoches.addEventListener("click", (e) => {
    const boton = e.target.closest(".eliminar");
    if (!boton) return;

    const matricula = boton.dataset.matricula;
    coches = coches.filter(c => c.matricula !== matricula);
    guardarCochesLocal();
    mostrarCoches();
});

/* ------------------------------------------------------
   ALTERNATIVA 2: Asignar onclick directamente a cada botón al crear la tarjeta
   ------------------------------------------------------
   const btnEliminar = tarjeta.querySelector(".eliminar");
   btnEliminar.addEventListener("click", () => {
       coches = coches.filter(c => c.matricula !== coche.matricula);
       guardarCochesLocal();
       mostrarCoches();
   });
*/

// Botones del modal <dialog>
function cerrarModal() {
    cochePendiente = null;
    if (modalDuplicado.open) modalDuplicado.close();
}

modalDuplicado.addEventListener("close", () => {
    cochePendiente = null;
});

document.getElementById("descartar").addEventListener("click", () => {
    cerrarModal();
    resetForm();
    mostrarMensaje("Operación descartada", "error");
});

document.getElementById("sustituir").addEventListener("click", () => {
    if (!cochePendiente) return;
    const nuevo = cochePendiente;
    const indice = coches.findIndex(c => c.matricula === nuevo.matricula);
    if (indice !== -1) {
        coches[indice] = nuevo;
    } else {
        coches.push(nuevo);
    }
    cerrarModal();
    finalizarRegistro(nuevo, "Registro sustituido");
});

document.getElementById("fusionar").addEventListener("click", () => {
    if (!cochePendiente) return;
    const nuevo = cochePendiente;
    const existente = coches.find(c => c.matricula === nuevo.matricula);
    if (!existente) {
        coches.push(nuevo);
        cerrarModal();
        finalizarRegistro(nuevo, "Entrada registrada");
        return;
    }

    nuevo.incidencias.forEach(inc => {
        const yaLaTiene = existente.incidencias.some(
            i => i.tipo === inc.tipo && i.detalle === inc.detalle
        );
        if (!yaLaTiene) existente.incidencias.push(inc);
    });

    cerrarModal();
    finalizarRegistro(existente, "Incidencias unidas");
});

// Arranque
mostrarCoches();
