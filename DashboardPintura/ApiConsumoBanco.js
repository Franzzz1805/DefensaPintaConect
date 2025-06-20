document.addEventListener('DOMContentLoaded', function () {
    const tbody       = document.querySelector('#loadBancoList tbody');
    const addBtn      = document.getElementById('addBancoBtn');
    const modal       = document.getElementById('bancoModal');
    const closeModal  = document.getElementById('closeModal');
    const form        = document.getElementById('bancoForm');
    const title       = document.getElementById('modal-title');
    const apiUrl      = 'http://127.0.0.1:8000/catalogos/bancos/';  // Ajusta si tu ruta es diferente

    // Campos del formulario
    const inpCodigo     = document.getElementById('codigo');
    const inpDescripcion= document.getElementById('descripcion');
    const inpDireccion  = document.getElementById('direccion');
    const inpTelefono   = document.getElementById('telefono');
    const inpMunicipio  = document.getElementById('municipio');
    const inpLatitud    = document.getElementById('latitud');
    const inpLongitud   = document.getElementById('longitud');

    let editarId = null;

    // Cargar bancos
    function cargarBancos() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(item => {
                    const tr = tbody.insertRow();
                    tr.insertCell(0).textContent = item.id;
                    tr.insertCell(1).textContent = item.codigo;
                    tr.insertCell(2).textContent = item.descripcion;
                    tr.insertCell(3).textContent = item.direccion;
                    tr.insertCell(4).textContent = item.telefono;
                    tr.insertCell(5).textContent = item.municipio; // puede mostrar el ID o nombre si el backend lo devuelve como string
                    tr.insertCell(6).textContent = item.latitud || '';
                    tr.insertCell(7).textContent = item.longitud || '';

                    // Botón editar
                    const tdEdit = tr.insertCell(8);
                    const btnEdit = document.createElement('button');
                    btnEdit.classList.add('btn-edit');
                    btnEdit.innerHTML = '<i class="bx bx-edit"></i>';
                    btnEdit.addEventListener('click', () => abrirModal(item));
                    tdEdit.appendChild(btnEdit);

                    // Botón eliminar
                    const tdDel = tr.insertCell(9);
                    const btnDel = document.createElement('button');
                    btnDel.classList.add('btn-delete');
                    btnDel.innerHTML = '<i class="bx bx-trash"></i>';
                    btnDel.addEventListener('click', () => eliminarBanco(item.id));
                    tdDel.appendChild(btnDel);
                });
            });
    }

    // Abrir modal
    function abrirModal(banco = null) {
        editarId = banco ? banco.id : null;
        title.textContent = banco ? 'Editar Banco' : 'Agregar Banco';

        inpCodigo.value      = banco?.codigo || '';
        inpDescripcion.value = banco?.descripcion || '';
        inpDireccion.value   = banco?.direccion || '';
        inpTelefono.value    = banco?.telefono || '';
        inpMunicipio.value   = banco?.municipio || '';
        inpLatitud.value     = banco?.latitud || '';
        inpLongitud.value    = banco?.longitud || '';

        modal.style.display = 'block';
    }

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Botón agregar
    addBtn.addEventListener('click', () => abrirModal());

    // Guardar banco
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const payload = {
            codigo:      inpCodigo.value.trim(),
            descripcion: inpDescripcion.value.trim(),
            direccion:   inpDireccion.value.trim(),
            telefono:    inpTelefono.value.trim(),
            municipio:   parseInt(inpMunicipio.value),
            latitud:     inpLatitud.value ? parseFloat(inpLatitud.value) : null,
            longitud:    inpLongitud.value ? parseFloat(inpLongitud.value) : null
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
            cargarBancos();
        })
        .catch(err => {
            console.error(err);
            alert('Hubo un problema al guardar el banco.');
        });
    });

    // Eliminar banco
    function eliminarBanco(id) {
        if (!confirm('¿Seguro que deseas eliminar este banco?')) return;
        fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Error al eliminar');
                cargarBancos();
            })
            .catch(err => {
                console.error(err);
                alert('No se pudo eliminar el banco.');
            });
    }

    // Carga inicial
    cargarBancos();
});
