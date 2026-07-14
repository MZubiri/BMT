# 🚀 Guía de Despliegue en Coolify - BMT

Esta guía detalla los pasos para desplegar la web del **Batallón Militar Táctico (BMT)** en tu servidor Oracle Cloud a través de tu panel de **Coolify** (`http://147.15.100.230:8000`).

---

## Prerrequisitos

1. El repositorio está configurado y subido en GitHub: `https://github.com/MZubiri/BMT.git`.
2. Tu contenedor de base de datos MySQL (`bingo-mysql`) está activo en el VPS y tiene la base de datos `bmt_db` creada.

---

## Pasos para Desplegar en Coolify

### Paso 1: Agregar un Nuevo Recurso en Coolify
1. Inicia sesión en tu panel de Coolify (`http://147.15.100.230:8000/`) con tus credenciales.
2. Selecciona tu **Proyecto** y tu **Entorno** (ej. `Production`).
3. Haz clic en **"+ New Resource"** (Nuevo Recurso) y selecciona **"Application"** (Aplicación).

### Paso 2: Conectar el Repositorio de GitHub
1. Selecciona **"Public Repository"** (o conecta tu cuenta de GitHub si es privado).
2. En la URL del repositorio introduce:
   `https://github.com/MZubiri/BMT.git`
3. En **Branch** (Rama), escribe: `main`.
4. Haz clic en **"Save"**.

### Paso 3: Configurar el Método de Construcción (Dockerfile)
Coolify detectará la configuración. Asegúrate de ajustar lo siguiente:
1. **Build Pack**: Selecciona **"Dockerfile"**.
2. **Ports**: Cambia el puerto de la aplicación al puerto **`3000`** (que es el expuesto en nuestro Dockerfile).
3. **Destination / Network**: Asegúrate de que la aplicación se conecte a la misma red Docker que tu base de datos (`coolify` o la red del proyecto) para que puedan comunicarse internamente.

### Paso 4: Configurar Variables de Entorno (Environment Variables)
En la pestaña **"Environment Variables"** de la aplicación en Coolify, agrega las siguientes variables de producción:

| Variable | Valor Sugerido | Descripción |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Modo de ejecución del servidor. |
| `PORT` | `3000` | Puerto en el que escucha Express. |
| `JWT_SECRET` | `un_secreto_muy_seguro_y_largo_123` | Clave secreta para firmar tokens JWT. |
| `DB_HOST` | `147.15.100.230` | IP del VPS donde corre MySQL (o `bingo-mysql` si usan la misma red). |
| `DB_PORT` | `3306` | Puerto de MySQL. |
| `DB_USER` | `root` | Usuario administrador de MySQL. |
| `DB_PASSWORD` | `root123` | Contraseña del contenedor MySQL. |
| `DB_NAME` | `bmt_db` | Nombre de la base de datos de BMT. |

> 💡 **Tip de comunicación interna**: Si tu aplicación y tu MySQL están en la misma red de Docker de Coolify, puedes configurar:
> - `DB_HOST=bingo-mysql`
>
> De lo contrario, puedes usar la IP pública y el puerto expuesto:
> - `DB_HOST=147.15.100.230`

### Paso 5: Desplegar 🚀
1. Dirígete a la pestaña **"Deployments"** o haz clic en el botón superior **"Deploy"**.
2. Coolify descargará el repositorio, ejecutará el Dockerfile de 3 etapas (compilará el Frontend React, compilará el Backend en Node/TS, instalará las dependencias de producción) y lo pondrá en marcha de forma automática.
3. Configura el **Dominio** deseado (ej. `http://bmt.tudominio.com` o una IP con puerto) en la configuración general para que Traefik genere el certificado SSL/HTTPS de manera automatizada.
