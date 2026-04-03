async function conectarConBackend() {
    try {
        const respuesta = await fetch('/api/saludo');
        const datos = await respuesta.json();


        console.log(datos);
        alert(datos.mensaje);
    } catch (error) {
        console.error("Error al conectar con el backend: ", error);
        
    }
}

conectarConBackend();