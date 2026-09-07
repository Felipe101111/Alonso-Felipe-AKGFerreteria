class Pedido {
    constructor(id, fecha, estado, total, clienteId) {
        this.id = id;
        this.fecha = fecha;
        this.estado = estado;
        this.total = total;
        this.clienteId = clienteId;
    }
}

export default Pedido;
