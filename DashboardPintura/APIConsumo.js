document.addEventListener('DOMContentLoaded', function () {
    const tbody       = document.querySelector('#loadProductoList tbody');
    const addBtn      = document.getElementById('addProductoBtn');
    const modal       = document.getElementById('productoModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('productoForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/catalogo/productos/';

    // Campos del formulario
    const inpCodigo      = document.getElementById('codigo');
    const inpColor       = document.getElementById('codigoColor');
    const inpNombre      = document.getElementById('nombre');
    const inpPrecio      = document.getElementById('precio');
    const inpStock       = document.getElementById('stock');
    const inpMarca       = document.getElementById('marca');
    const inpAlmacen     = document.getElementById('almacen');
    const inpTipo        = document.getElementById('tipo');

    let editarId = null;

    // Cargar productos
    function cargarProductos() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = tbody.insertRow();
                    tr.insertCell(0).textContent = item.id;
                    tr.insertCell(1).textContent = item.codigo;
                    
                    // Color visual con cuadrado de color
                    const colorCell = tr.insertCell(2);
                    const colorBox = document.createElement('div');
                    colorBox.style.width = '20px';
                    colorBox.style.height = '20px';
                    colorBox.style.backgroundColor = item.codigoColor;
                    colorBox.style.border = '1px solid #ccc';
                    colorCell.appendChild(colorBox);

                    tr.insertCell(3).textContent = item.nombre;
                    tr.insertCell(4).textContent = item.precio;
                    tr.insertCell(5).textContent = item.stock;
                    tr.insertCell(6).textContent = item.marca;
                    tr.insertCell(7).textContent = item.almacen;
                    tr.insertCell(8).textContent = item.tipo;

                    // Botón editar
                    const tdEdit = tr.insertCell(9);
                    const btnEdit = document.createElement('button');
                    btnEdit.classList.add('btn-edit');
                    btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                    btnEdit.addEventListener('click', () => abrirModal(item));
                    tdEdit.appendChild(btnEdit);

                    // Botón eliminar
                    const tdDel = tr.insertCell(10);
                    const btnDel = document.createElement('button');
                    btnDel.classList.add('btn-delete');
                    btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                    btnDel.addEventListener('click', () => eliminarProducto(item.id));
                    tdDel.appendChild(btnDel);
                });
            });
    }

    // Abrir modal
    function abrirModal(producto = null) {
        editarId = producto ? producto.id : null;
        title.textContent = producto ? 'Editar Producto' : 'Agregar Producto';

        inpCodigo.value  = producto?.codigo || '';
        inpColor.value   = producto?.codigoColor || '#000000';
        inpNombre.value  = producto?.nombre || '';
        inpPrecio.value  = producto?.precio || '';
        inpStock.value   = producto?.stock || '';
        inpMarca.value   = producto?.marca || '';
        inpAlmacen.value = producto?.almacen || '';
        inpTipo.value    = producto?.tipo || '';

        modal.style.display = 'block';
    }

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar producto
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            codigo:       inpCodigo.value.trim(),
            codigoColor:  inpColor.value.trim(),
            nombre:       inpNombre.value.trim(),
            precio:       parseFloat(inpPrecio.value),
            stock:        parseInt(inpStock.value),
            marca:        parseInt(inpMarca.value),
            almacen:      parseInt(inpAlmacen.value),
            tipo:         parseInt(inpTipo.value)
        };

        const url = editarId ? `${apiUrl}${editarId}/` : apiUrl;
        const method = editarId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al guardar');
            modal.style.display = 'none';
            cargarProductos();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar el producto.');
        });
    });

    // Eliminar producto
    function eliminarProducto(id) {
        if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarProductos();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar el producto.');
            });
    }

    // Carga inicial
    cargarProductos();
});
