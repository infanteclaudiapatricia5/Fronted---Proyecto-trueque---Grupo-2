# TruequeHub

TruequeHub es una plataforma web desarrollada en React + TypeScript que permite a los usuarios publicar, explorar y gestionar trueques de forma simple y organizada.  
Este README documenta todos los pasos necesarios para instalar, ejecutar y comprender la estructura del proyecto.

---

# 1. Requisitos previos

Antes de iniciar, asegúrate de tener instaladas las siguientes herramientas:

## Node.js (versión 18 o superior)
Descargar desde:
https://nodejs.org

Incluye:
- node
- npm

## PNPM (gestor de paquetes utilizado por el proyecto)
Instalación global:
npm install -g pnpm

---

# Requisitos previos

Antes de instalar el proyecto, asegúrate de tener lo siguiente:

## Node.js
Instálalo desde:
https://nodejs.org

Node incluye:
- node
- npm

Versión recomendada: 18.x o superior.

## PNPM (opcional pero recomendado)
Si el proyecto tiene archivo pnpm-lock.yaml, se recomienda usar PNPM.

Instalación:
npm install -g pnpm

Para verificar:
pnpm -v

---

# Instalación del proyecto

## 1. Abrir la terminal en la carpeta del proyecto

Ubícate en la misma carpeta donde está package.json.

Método rápido:
1. Abre el explorador de archivos.
2. En la barra de direcciones escribe: cmd
   Esto abrirá la terminal directamente en esa ubicación.

O manualmente:
cd ruta/del/proyecto

---

## 2. Instalar dependencias

Si usas PNPM:
pnpm install

Si prefieres NPM:
npm install

---

# Ejecutar el proyecto

## 1. Iniciar el servidor de desarrollo

pnpm run dev  
o  
npm run dev

Luego abre en el navegador:
http://localhost:3000

El servidor recargará automáticamente al modificar el código.

---

# Construir para producción

## 1. Crear la build

pnpm run build  
o  
npm run build

## 2. Ejecutar la build generada

pnpm start  
o  
npm start

---

# Scripts disponibles

pnpm run dev      → Ejecuta el entorno de desarrollo  
pnpm run build    → Genera la versión de producción  
pnpm run start    → Corre la build generada  

---
# 3. Estructura del proyecto

Esta es la estructura actual del proyecto según el repositorio:


├── app/
├── components/
├── hooks/
├── lib/
├── public/
├── styles/
├── README.md
├── components.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
└── tsconfig.json



A continuación, se describe la función de cada carpeta principal:

## app/
Contiene las rutas, páginas, layouts y segmentación propia de Next.js bajo el App Router.

## components/
Incluye todos los componentes reutilizables de la interfaz.

## hooks/
Contiene hooks personalizados utilizados a lo largo del proyecto.

## lib/
Funciones auxiliares, helpers y utilidades.

## public/
Archivos estáticos como imágenes, logos, fuentes, íconos o assets.

## styles/
Estilos globales, variables o archivos CSS y utilidades relacionadas.



# 5. Consideraciones adicionales

- PNPM es el gestor de paquetes recomendado para evitar inconsistencias con dependencias.
- El servidor de desarrollo corre por defecto en el puerto 3000.
- Asegúrate de ejecutar los comandos dentro de la carpeta correcta para evitar errores de módulos no encontrados.
- La estructura del proyecto favorece la escalabilidad y la separación lógica entre vistas, componentes y lógica auxiliar.

---

# Licencia

Proyecto de uso académico.  
Su distribución o modificación depende del equipo desarrollador.
