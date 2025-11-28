# Dossier - Local Business Prospecting Tool

Herramienta simple para extraer negocios de Google Maps y exportarlos a Google Sheets.

## Setup

### 1. Backend (Flask)

```bash
cd backend

# Crear archivo .env con tus credenciales
cp .env.example .env
# Editar .env y agregar tu OUTSCRAPER_API_KEY

# Activar virtual environment
source venv/bin/activate

# Instalar dependencias (ya instaladas)
pip install -r requirements.txt

# Correr servidor
python app.py
```

Backend correrá en: `http://localhost:5000`

### 2. Frontend (React)

```bash
cd frontend

# Instalar dependencias (ya instaladas)
npm install

# Correr dev server
npm run dev
```

Frontend correrá en: `http://localhost:5173`

## Obtener API Keys

### Google Maps API Key
1. Ir a https://console.cloud.google.com
2. Crear nuevo proyecto (o usar uno existente)
3. Habilitar las siguientes APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API** (opcional, para el futuro)
4. Ir a "Credentials" → "Create Credentials" → "API Key"
5. Copiar tu API key
6. **IMPORTANTE:** Restringir la key (opcional pero recomendado):
   - Application restrictions: None (para desarrollo) o HTTP referrers (para producción)
   - API restrictions: Seleccionar solo Places API y Geocoding API
7. Pegar en `backend/.env`:
   ```
   GOOGLE_MAPS_API_KEY=tu_key_aqui
   ```

**Crédito gratis:** Google te da $200/mes gratis = ~3,500 negocios/mes sin costo

### Google OAuth (Para exportar a Sheets - Día 3)
1. En el mismo proyecto de Google Cloud Console
2. Habilitar Google Sheets API
3. Crear credenciales OAuth 2.0
4. Agregar a `backend/.env`

## Estructura del Proyecto

```
dossier/
├── backend/
│   ├── app.py              # Flask API
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   └── venv/               # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── index.css       # Tailwind styles
│   ├── package.json
│   └── vite.config.js
│
├── plan.md                 # Development plan
├── validacion.md          # Market validation
└── README.md              # This file
```

## Endpoints

### POST /api/search
Busca negocios usando Outscraper

**Request:**
```json
{
  "location": "Hickory, NC",
  "radius": 10,
  "category": "pool services"
}
```

**Response:**
```json
{
  "businesses": [
    {
      "name": "Joe's Pool Service",
      "address": "123 Main St",
      "phone": "(828) 555-1234",
      "website": "https://...",
      "rating": 4.5,
      "review_count": 87
    }
  ],
  "total": 47
}
```

### POST /api/export
Exporta negocios a Google Sheets (Coming in Day 3)

## Próximos Pasos

- [ ] Día 1: ✅ Setup completo
- [ ] Día 2: Frontend con 2 vistas (Cards + Tabla)
- [ ] Día 3: Google Sheets export + Deploy
