# INSTRUCCIONES PARA CONFIGURAR GOOGLE RECAPTCHA v3

## Paso 1: Obtener claves de reCAPTCHA
1. Visita: https://www.google.com/recaptcha/admin/create
2. Registra un nuevo sitio con los siguientes datos:
   - Etiqueta: TruequeHub (o el nombre que prefieras)
   - Tipo de reCAPTCHA: **reCAPTCHA v3**
   - Dominios: 
     * localhost
     * tu-dominio.com (si ya tienes uno)
   - Acepta los términos de servicio
   - Enviar

3. Copia la **CLAVE DEL SITIO** (Site Key)
4. Pega la clave en el archivo `.env.local` (ver abajo)

## Paso 2: Crear archivo .env.local
Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_clave_del_sitio_aqui
```

## Ejemplo:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**NOTA:** La clave de ejemplo de arriba es la clave de prueba de Google que siempre pasa la validación.
Para producción, debes usar tu propia clave.

## Paso 3: Reiniciar el servidor de desarrollo
Después de crear el archivo `.env.local`, reinicia tu servidor:
```bash
bun run dev
```

## Verificación del Backend
Asegúrate de que el backend también esté configurado con la **SECRET KEY** de reCAPTCHA
para validar los tokens correctamente.
