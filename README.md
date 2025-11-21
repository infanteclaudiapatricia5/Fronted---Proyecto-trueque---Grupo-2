# TruequeHub

TruequeHub es una plataforma web desarrollada en React + TypeScript que permite a los usuarios publicar, explorar y gestionar trueques de forma simple y organizada.  
Este README documenta todos los pasos necesarios para instalar, ejecutar y comprender la estructura del proyecto, además de las decisiones de diseño y funcionamiento del sistema.

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

# Estructura del proyecto

/  
├── public/                   Archivos estáticos  
├── src/  
│   ├── assets/               Imágenes, íconos, recursos  
│   ├── components/           Componentes reutilizables  
│   ├── pages/                Vistas principales  
│   ├── hooks/                Hooks personalizados  
│   ├── services/             Lógica de API o funciones externas  
│   ├── styles/               Estilos globales  
│   └── main.tsx              Punto de entrada de la aplicación  
├── package.json              Dependencias y scripts  
├── pnpm-lock.yaml            Si el proyecto usa PNPM  
└── README.md                 Documentación del proyecto  

---

# Lineamientos de diseño

## Paleta de colores
Originalmente se usaron tonos morados con bajo contraste.  
Estos fueron reemplazados por una paleta más clara y coherente, mejorando:

- Legibilidad  
- Accesibilidad  
- Armonía visual  

## Iconografía
Los íconos fueron actualizados y estandarizados para mantener un estilo uniforme:

- Estilo minimalista  
- Líneas limpias  
- Mejor alineación  
- Mejor peso visual  

## Mejoras estéticas generales
- Mayor consistencia entre pantallas  
- Mejores jerarquías visuales  
- Espaciados más equilibrados  
- Interfaz más clara y moderna  


# Tecnologías utilizadas

- React  
- TypeScript  
- CSS  
- PNPM / NPM  


# Licencia

Proyecto de uso académico.  
Su distribución o modificación depende del equipo desarrollador.

