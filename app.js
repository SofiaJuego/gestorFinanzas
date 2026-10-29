import { Transaccion } from './classes/Transaccion.js';

// 1. Declaramos los elementos 
const form = document.getElementById('form-transaccion');
const tablaMovimientos = document.getElementById('tabla-movimientos');
const totalIngresosElem = document.getElementById('total-ingresos');
const totalGastosElem = document.getElementById('total-gastos');
const balanceNetoElem = document.getElementById('balance-neto');
const selectTipo = document.getElementById('tipo');
const selectCategoria = document.getElementById('categoria');

// Parte de validaciones
const categoriasPorTipo = {
    ingreso: ['Sueldo', 'Ventas', 'Extras'],
    gasto: ['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Otros']
};

// Actualizar las opciones del select 
function actualizarCategorias() {
    const tipoSeleccionado = selectTipo.value;
    const opciones = categoriasPorTipo[tipoSeleccionado] || [];
    
    selectCategoria.innerHTML = '';
    opciones.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectCategoria.appendChild(option);
    });
}

// Cuando cambia el tipo (Ingreso/Gasto) para actualizar las categorías
selectTipo.addEventListener('change', actualizarCategorias);

// Cargar la página 
actualizarCategorias();

// 2. Evento submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Tomamos los valores
    const descripcion = document.getElementById('descripcion').value.trim();
    const montoStr = document.getElementById('monto').value;
    const tipo = selectTipo.value;
    const categoria = selectCategoria.value;

    // --- Validaciones ---
    if (descripcion === '') {
        alert('⚠️ Por favor, ingresa una descripción válida.');
        return;
    }

    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0) {
        alert('⚠️ El monto debe ser un número mayor a 0.');
        return;
    }
    // --------------------

    // Nueva instancia utilizando la clase Transaccion
    const nuevaTransaccion = new Transaccion(tipo, descripcion, monto, categoria);

    // Actualiza la interfaz (tabla y balances)
    actualizarInterfaz();

    // Limpia el formulario 
    form.reset();
    actualizarCategorias();
});

// 3. Función principal para calcular y actualizar la pantalla 
function actualizarInterfaz() {
    tablaMovimientos.innerHTML = '';

    // Si el array está vacío, mostramos el mensaje 
    if (Transaccion.all.length === 0) {
        tablaMovimientos.innerHTML = `
            <tr class="text-slate-400 text-center">
                <td colspan="4" class="py-4">No hay movimientos registrados todavía.</td>
            </tr>
        `;
        totalIngresosElem.textContent = '$0.00';
        totalGastosElem.textContent = '$0.00';
        balanceNetoElem.textContent = '$0.00';
        balanceNetoElem.className = 'text-2xl font-bold text-slate-900';
        return;
    }

    let totalIngresos = 0;
    let totalGastos = 0;

    // Recorre todas las transacciones almacenadas
    Transaccion.all.forEach((t) => {
        if (t.tipo === 'ingreso') {
            totalIngresos += t.monto;
        } else {
            totalGastos += t.monto;
        }

        // Crea la fila (<tr>) para la tabla
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50';

        // Definimos color y signo 
        const colorMonto = t.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600';
        const signoMonto = t.tipo === 'ingreso' ? '+' : '-';

        // Introducir el contenido HTML en la fila
        tr.innerHTML = `
            <td class="py-3 px-3 font-medium text-slate-800">${t.descripcion}</td>
            <td class="py-3 px-3 text-slate-600">
                <span class="px-2 py-1 bg-slate-100 rounded-md text-xs">${t.categoria}</span>
            </td>
            <td class="py-3 px-3 font-bold ${colorMonto}">${signoMonto}$${t.monto.toFixed(2)}</td>
            <td class="py-3 px-3 text-center">
                <button onclick="eliminarTransaccion(${t.id})" class="text-slate-400 hover:text-rose-600 transition text-sm font-medium">
                    Eliminar
                </button>
            </td>
        `;

        tablaMovimientos.appendChild(tr);
    });

    // 4. Cálculos del balance global
    const balanceNeto = totalIngresos - totalGastos;

    totalIngresosElem.textContent = `$${totalIngresos.toFixed(2)}`;
    totalGastosElem.textContent = `$${totalGastos.toFixed(2)}`;
    balanceNetoElem.textContent = `$${balanceNeto.toFixed(2)}`;
    
    // Si el balance es negativo, figura en rojo
    balanceNetoElem.className = `text-2xl font-bold ${balanceNeto >= 0 ? 'text-slate-900' : 'text-rose-600'}`;
}

// 5. Función global para eliminar registros
window.eliminarTransaccion = function(id) {
    const index = Transaccion.all.findIndex(t => t.id === id);
    
    if (index !== -1) {
        Transaccion.all.splice(index, 1);
        actualizarInterfaz();
    }
};