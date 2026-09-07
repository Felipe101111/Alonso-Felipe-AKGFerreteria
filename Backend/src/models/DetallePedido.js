class DetallePedido {
    constructor(id, cantidad, precioUnitario, subtotal, pedidoId, productoId) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
    }
}

export default DetallePedido;
