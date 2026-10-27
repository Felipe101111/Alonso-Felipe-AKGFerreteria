class DetallePedido {
    constructor(id, cantidad, precioUnitario, subtotal, pedidoId, productoId, productoNombre) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.productoNombre = productoNombre;
    }
}

export default DetallePedido;
