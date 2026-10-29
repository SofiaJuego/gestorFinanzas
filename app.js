import { Transaccion } from './classes/Transaccion.js';

const form = document.getElementById('form-transaccion');
const tablaMovimientos = document.getElementById('tabla-movimientos');
const totalIngresosElem = document.getElementById('total-ingresos');
const totalGastosElem = document.getElementById('total-gastos');
const balanceNetoElem = document.getElementById('balance-neto');
const selectTipo = document.getElementById('tipo');
const selectCategoria = document.getElementById('categoria');

// validamos por tipo de categoria 
const categoriasPorTipo = {
    ingreso: ['Sueldo', 'Ventas', 'Extras'],
    gasto: ['Comida', 'Transporte', 'Entretenimiento', 'Servicios', 'Otros']
};

// actualizamos categorias segun el tipo que esta seleccionado
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

// carga la pagina
actualizarCategorias();

// submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault(); // es para que la pagina no se recargue
    
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
   
    const nuevaTransaccion = new Transaccion(tipo, descripcion, monto, categoria);
    actualizarInterfaz();

    form.reset();
    actualizarCategorias();
});

// actualizamos la pantalla con los datos del array
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
    Transaccion.historial.forEach((t) => {
        if (t.tipo === 'ingreso') {
            totalIngresos += t.monto;
        } else {
            totalGastos += t.monto;
        }

       
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50';

        const colorMonto = t.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600';
        const signoMonto = t.tipo === 'ingreso' ? '+' : '-';


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

    
    const balanceNeto = totalIngresos - totalGastos;

    totalIngresosElem.textContent = `$${totalIngresos.toFixed(2)}`;
    totalGastosElem.textContent = `$${totalGastos.toFixed(2)}`;
    balanceNetoElem.textContent = `$${balanceNeto.toFixed(2)}`;
    
    
    balanceNetoElem.className = `text-2xl font-bold ${balanceNeto >= 0 ? 'text-slate-900' : 'text-rose-600'}`;
}

//eliminamos registro de la transaccion
window.eliminarTransaccion = function(id) {
    const index = Transaccion.all.findIndex(t => t.id === id);
    
    if (index !== -1) {
        Transaccion.all.splice(index, 1);
        actualizarInterfaz();
    }
};