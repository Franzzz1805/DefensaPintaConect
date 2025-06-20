document.addEventListener('DOMContentLoaded', function () {
    const tbody       = document.querySelector('#loadClienteList tbody');
    const addBtn      = document.getElementById('addClienteBtn');
    const modal       = document.getElementById('clienteModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('clienteForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/catalogo/clientes/';  // Ajusta la URL según tu endpoint real

    // Campos del formulario
    const inpCodigo    = document.getElementById('codigo');
    const inpNombre    = document.getElementById('nombre');
    const inpApellido  = document.getElementById('apellido');
    const inpTelefono  = document.getElementById('telefono');
    const inpDireccion = document.getElementById('direccion');

    let editarId = null;

    // Cargar clientes
    function cargarClientes() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = tbody.insertRow();
                    tr.insertCell(0).textContent = item.id;
                    tr.insertCell(1).textContent = item.codigo;
                    tr.insertCell(2).textContent = item.nombre;
                    tr.insertCell(3).textContent = item.apellido;
                    tr.insertCell(4).textContent = item.telefono;
                    tr.insertCell(5).textContent = item.direccion;

                    // Botón editar
                    const tdEdit = tr.insertCell(6);
                    const btnEdit = document.createElement('button');
                    btnEdit.classList.add('btn-edit');
                    btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                    btnEdit.addEventListener('click', () => abrirModal(item));
                    tdEdit.appendChild(btnEdit);

                    // Botón eliminar
                    const tdDel = tr.insertCell(7);
                    const btnDel = document.createElement('button');
                    btnDel.classList.add('btn-delete');
                    btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                    btnDel.addEventListener('click', () => eliminarCliente(item.id));
                    tdDel.appendChild(btnDel);
                });
            });
    }

    // Abrir modal
    function abrirModal(cliente = null) {
        editarId = cliente ? cliente.id : null;
        title.textContent = cliente ? 'Editar Cliente' : 'Agregar Cliente';

        inpCodigo.value    = cliente?.codigo || '';
        inpNombre.value    = cliente?.nombre || '';
        inpApellido.value  = cliente?.apellido || '';
        inpTelefono.value  = cliente?.telefono || '';
        inpDireccion.value = cliente?.direccion || '';

        modal.style.display = 'block';
    }

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar cliente
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            codigo:    inpCodigo.value.trim(),
            nombre:    inpNombre.value.trim(),
            apellido:  inpApellido.value.trim(),
            telefono:  inpTelefono.value.trim(),
            direccion: inpDireccion.value.trim()
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
            cargarClientes();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar el cliente.');
        });
    });

    // Eliminar cliente
    function eliminarCliente(id) {
        if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarClientes();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar el cliente.');
            });
    }

    // Carga inicial
    cargarClientes();
});
