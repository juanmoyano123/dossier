# Guía de Deployment

## Arquitectura
- **Frontend**: React + Vite → Vercel
- **Backend**: Flask + Python → Railway/Render

## 1. Deployar Backend (Railway - Recomendado)

### Opción A: Railway (https://railway.app)

1. Crear cuenta en Railway.app
2. Click en "New Project" → "Deploy from GitHub repo"
3. Seleccionar el repositorio `juanmoyano123/dossier`
4. Railway detectará automáticamente Python
5. Configurar variables de entorno:
   - `GOOGLE_MAPS_API_KEY`: Tu API key de Google Maps
   - `FLASK_ENV`: production
   - `PORT`: 5001 (Railway lo asignará automáticamente)
6. Railway detectará automáticamente `requirements.txt`
7. El backend se deployará automáticamente

### Opción B: Render (https://render.com)

1. Crear cuenta en Render.com
2. Click en "New +" → "Web Service"
3. Conectar repositorio GitHub `juanmoyano123/dossier`
4. Configurar:
   - **Name**: dossier-backend
   - **Root Directory**: backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
5. Agregar variables de entorno:
   - `GOOGLE_MAPS_API_KEY`: Tu API key
   - `FLASK_ENV`: production
6. Click "Create Web Service"

**Una vez deployado, copia la URL del backend** (ej: `https://tu-app.railway.app` o `https://tu-app.onrender.com`)

## 2. Deployar Frontend (Vercel)

1. Ya tienes el proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agregar variable:
   - **Name**: `VITE_API_URL`
   - **Value**: La URL de tu backend (del paso anterior)
   - Ejemplo: `https://dossier-backend.railway.app`
4. Click en **Deployments** → Redeploy el último deployment

## 3. Verificar

1. Visita tu frontend en Vercel (ej: `https://dossier.vercel.app`)
2. Intenta hacer una búsqueda de negocios
3. Debería funcionar correctamente

## Variables de Entorno Necesarias

### Backend (Railway/Render)
```
GOOGLE_MAPS_API_KEY=tu_api_key_real
FLASK_ENV=production
PORT=5001
```

### Frontend (Vercel)
```
VITE_API_URL=https://tu-backend.railway.app
```

## Troubleshooting

### Error: "No route to host"
- El backend no está deployado o la URL en `VITE_API_URL` es incorrecta

### Error: "CORS policy"
- Verifica que el backend tenga CORS habilitado (ya está configurado en `app.py`)

### Error: "Google Maps API not configured"
- Falta configurar `GOOGLE_MAPS_API_KEY` en las variables de entorno del backend
