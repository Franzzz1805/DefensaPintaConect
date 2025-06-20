document.addEventListener('DOMContentLoaded', function () {
    const tbody       = document.querySelector('#loadMarcaList tbody');
    const addBtn      = document.getElementById('addMarcaBtn');
    const modal       = document.getElementById('marcaModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('marcaForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/catalogo/marcas/';  // Ajusta según tu endpoint real

    // Campos del formulario
    const inpCodigo = document.getElementById('codigo');
    const inpNombre = document.getElementById('nombre');

    let editarId = null;

    // Cargar marcas
    function cargarMarcas() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = tbody.insertRow();
                    tr.insertCell(0).textContent = item.id;
                    tr.insertCell(1).textContent = item.codigo;
                    tr.insertCell(2).textContent = item.nombre;

                    // Botón editar
                    const tdEdit = tr.insertCell(3);
                    const btnEdit = document.createElement('button');
                    btnEdit.classList.add('btn-edit');
                    btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                    btnEdit.addEventListener('click', () => abrirModal(item));
                    tdEdit.appendChild(btnEdit);

                    // Botón eliminar
                    const tdDel = tr.insertCell(4);
                    const btnDel = document.createElement('button');
                    btnDel.classList.add('btn-delete');
                    btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                    btnDel.addEventListener('click', () => eliminarMarca(item.id));
                    tdDel.appendChild(btnDel);
                });
            });
    }

    // Abrir modal
    function abrirModal(marca = null) {
        editarId = marca ? marca.id : null;
        title.textContent = marca ? 'Editar Marca' : 'Agregar Marca';

        inpCodigo.value = marca?.codigo || '';
        inpNombre.value = marca?.nombre || '';

        modal.style.display = 'block';
    }

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar marca
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            codigo: inpCodigo.value.trim(),
            nombre: inpNombre.value.trim()
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
            cargarMarcas();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar la marca.');
        });
    });

    // Eliminar marca
    function eliminarMarca(id) {
        if (!confirm('¿Seguro que deseas eliminar esta marca?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarMarcas();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar la marca.');
            });
    }

    // Carga inicial
    cargarMarcas();
});
