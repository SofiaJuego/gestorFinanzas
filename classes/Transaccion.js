export class Transaccion {
    // creamos el array para almacenar todas las transacciones
    static historial = [];

    constructor(tipo, descripcion, monto, categoria) {
        this.id = Date.now(); // Un identificador único basado en la hora actual
        this.tipo = tipo; // 'ingreso' o 'gasto'
        this.descripcion = descripcion; // Texto ingresado por el usuario
        this.monto = parseFloat(monto); 
        this.categoria = categoria; // Categoría seleccionada

        // guardamos la transacción en el historial
        Transaccion.historial.push(this);
        console.log(`Transacción creada:${this.id}, ${this.descripcion}, Monto: ${this.monto}, Tipo: ${this.tipo}, Categoría: ${this.categoria}`);
    }
}