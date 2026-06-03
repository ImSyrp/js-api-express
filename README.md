# Portafolio Técnico de Arquitectura y Seguridad
## Guía de Laboratorio No. 10: Integración Monolítica y Acoplamiento Perimetral Seguro para Despliegue

**Institución:** Universidad Nacional Casimiro Sotelo Montenegro  
**Carrera:** Ingeniería de Sistemas  
**Curso:** Unidad II: Herramientas para el desarrollo Web  
**Equipo de Desarrollo:**
* Dylan
* Josue David

---

## 1. Estructura de Directorios (Integración Monolítica)

El proyecto se ha unificado siguiendo el enfoque monolítico de distribución de recursos. El Frontend estático reside en el directorio `public/`, servido directamente por el servidor web Express en la misma máquina física/puerto (eliminando cualquier conflicto de CORS).

```text
js-api-express/
│
├── prisma/
│   ├── migrations/             # Migraciones de base de datos
│   └── schema.prisma           # Esquema de Prisma ORM
│
├── public/                     # Contenedor Público (Frontend Estático)
│   ├── login.html              # Vista del portal de acceso seguro
│   ├── login.js                # Lógica del cliente con fetch relativo
│   ├── dashboard.html          # Panel del estudiante e integración API
│   ├── estilos.css             # Estilo CSS premium dark glassmorphic
│   └── script.js               # Redirección automática de la raíz (/)
│
├── src/
│   ├── controllers/
│   │   ├── acceso.controller.js # Controlador para saludo y registro
│   │   └── auth.controller.js   # Controlador para login y emisión JWT
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js   # Interceptor perimetral JWT (Bearer)
│   │
│   ├── routes/
│   │   ├── acceso.routes.js     # Rutas de acceso (saludo/registro)
│   │   └── auth.routes.js       # Rutas de autenticación (login)
│   │
│   └── server.js                # Raíz del Servidor limpia (Punto de entrada)
│
├── .env                        # Aislamiento de variables de entorno (Ignorado)
├── db.js                        # Inicialización de Prisma con Driver Adapter
├── package.json                 # Gestión de dependencias y scripts
└── prisma.config.ts             # Configuración centralizada de Prisma
```

---

## 2. Aislamiento Seguro de Claves Criptográficas

Para evitar credenciales quemadas en el código de producción, todas las llaves criptográficas y conexiones se han aislado rigurosamente en el entorno operativo a través del archivo `.env`:

```env
PORT=3005
DATABASE_URL="postgresql://postgres:1048@localhost:5432/cafe_aroma?schema=public"
JWT_SECRET=ClaveSecretaUltraSeguraParaCifrado2026_SoteloMontenegro
JWT_EXPIRES_IN=1h
```

> [!IMPORTANT]
> El archivo `.env` está debidamente excluido en el `.gitignore` del proyecto para evitar fugas de información sensible en los repositorios remotos.

---

## 3. Protocolo de Auditoría y QA (Aseguramiento de Calidad en Vivo)

El backend supera las pruebas de seguridad perimetral y robustez requeridas por el docente:

### Prueba A: Bloqueo Anónimo Perimetral
* **Acción:** Petición `GET` directa a `/api/saludo` sin cabecera de autenticación.
* **Resultado:** El middleware `protegerRuta` intercepta la petición y responde con un código **`401 Unauthorized`**.
```json
{
  "codigo": 401,
  "estado": "No Autorizado",
  "mensaje": "Acceso denegado. Se requiere una cabecera HTTP de tipo 'Bearer '."
}
```

### Prueba B: Manejo de Excepciones y Token Corrupto
* **Acción:** Petición `GET` a `/api/saludo` enviando un token alterado (`Authorization: Bearer unTokenInvalidoCualquiera123`).
* **Resultado:** El bloque `catch` del middleware atrapa el error y responde con un código **`403 Forbidden`** de manera limpia, sin tumbar el proceso de Node.js.
```json
{
  "codigo": 403,
  "estado": "Prohibido",
  "mensaje": "Token corrupto, inválido o modificado de manera maliciosa. Acceso revocado."
}
```

### Prueba C: Intercambio de Llaves Exitoso
* **Acción:** 
  1. `POST` a `/api/auth/login` con credenciales válidas (`admin` / `Sotelo2026*`). Se recibe el token JWT firmado.
  2. `GET` a `/api/saludo?llave=LLAVE_VALIDA` inyectando el token obtenido en los encabezados (`Authorization: Bearer <token>`).
* **Resultado:** El sistema valida la firma, inyecta la identidad en el objeto `req` y retorna **`200 OK`**.
```json
{
  "estado": "exito",
  "data": {
    "mensaje": "Bienvenido al sistema, Dylan y Josue",
    "timestamp": "2026-06-03T06:22:26.103Z"
  }
}
```

---

## 4. Pruebas Adicionales de Seguridad y Robustez

### Inyección SQL (Bypass de Autenticación)
* **Acción:** Envío de payload malicioso en la query: `?llave=' OR '1'='1`.
* **Resultado:** Prisma ORM parametriza automáticamente las consultas, impidiendo que el bypass tenga éxito. Responde con un correcto **`401 Unauthorized`**.

### Tolerancia a Fallos (Desconexión de Base de Datos)
* **Acción:** Simular desconexión cambiando la contraseña de base de datos en `.env`.
* **Resultado:** Los bloques `try/catch` de los controladores atrapan las excepciones de conexión de Prisma y responden con **`500 Internal Server Error`** en formato JSON. El servidor sigue en ejecución y no se cae.

### Violación de Restricción Única
* **Acción:** Registrar un usuario nuevo usando un `token_acceso` que ya existe en la base de datos a través de `POST /api/registro`.
* **Resultado:** El controlador captura el código de error `P2002` de Prisma y devuelve un código **`409 Conflict`** con el mensaje exacto al usuario.

---

## 5. Instrucciones de Ejecución

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```
2. **Ejecutar Migraciones y Generar Cliente**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
3. **Iniciar el Servidor**:
   ```bash
   npm run dev
   ```
4. **Abrir Prisma Studio (Opcional - Para Gestión de Base de Datos Visual)**:
   ```bash
   npx prisma studio
   ```
