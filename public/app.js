const API = 'http://localhost:3000/api/productos';
const $ = (id) => document.getElementById(id);

const form = $('producto-form');
const tablaBody = $('tabla-body');
const mensaje = $('mensaje');

// 1. Cargar productos al iniciar
async function cargarProductos() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    
    if (data.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="6">No hay productos</td></tr>';
      return;
    }

    tablaBody.innerHTML = data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion || '-'}</td>
        <td>S/ ${Number(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <button class="danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tablaBody.innerHTML = '<tr><td colspan="6">Error al conectar con el servidor</td></tr>';
  }
}

// 2. Guardar (Crear)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const nuevoProducto = {
    nombre: $('nombre').value,
    descripcion: $('descripcion').value,
    precio: Number($('precio').value),
    stock: Number($('stock').value)
  };

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });

    if (res.ok) {
      mensaje.textContent = ' Producto guardado';
      mensaje.className = 'mensaje ok';
      form.reset();
      cargarProductos(); // Recargar la tabla
      setTimeout(() => mensaje.textContent = '', 3000);
    }
  } catch (error) {
    mensaje.textContent = ' Error al guardar';
    mensaje.className = 'mensaje error';
  }
});

// 3. Eliminar
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.ok) cargarProductos();
  } catch (error) {
    alert('Error al eliminar');
  }
}

// Iniciar
cargarProductos();