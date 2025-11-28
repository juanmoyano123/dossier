# PLAN: Dossier - Herramienta Personal de Prospección

**Versión:** MVP Personal
**Fecha:** 25 Noviembre 2025
**Usuario:** Juan (uso personal, no equipo)

---

## QUÉ ESTAMOS CONSTRUYENDO

Una app web simple que:
1. Llama a Outscraper API para extraer negocios de Google Maps
2. Muestra los resultados en cards/tabla
3. Botón "Exportar a Google Sheets"

**Eso es todo.** Sin análisis de websites, sin dossiers automáticos, sin complejidad innecesaria.

---

## ARQUITECTURA ULTRA SIMPLIFICADA

```
Frontend (React + Tailwind)
    ↓
Backend (Flask API - 2 endpoints)
    ↓
Outscraper API / Google Sheets API
```

**Stack:**
- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Python Flask (2 endpoints, SIN base de datos)
- **APIs:** Google Maps API + Google Sheets API

**Hosting:**
- Frontend: Vercel (gratis)
- Backend: Railway (gratis o $5/mes)

**NO NECESITAMOS:**
- ❌ Base de datos (Supabase, PostgreSQL, nada)
- ❌ Guardar extracciones
- ❌ Histórico de búsquedas

**Costos (Google Maps API):**
- Crédito gratis: $200/mes = ~3,500 negocios/mes
- Tu uso estimado: 200 negocios/mes = **$0**

Todo vive en memoria del frontend mientras estés en la página.

---

## FEATURES (SOLO LO ESENCIAL)

### Feature 1: Buscar Negocios
**Pantalla:**
- Input: Ciudad/ZIP
- Input: Radio (5, 10, 25 millas)
- Dropdown: Categoría (pool services, landscaping, salons, etc)
- Botón: "Buscar"

**Backend:**
```python
@app.route('/api/search', methods=['POST'])
def search_businesses():
    # 1. Recibir: location, radius, category
    # 2. Llamar Google Maps Places API
    # 3. Retornar JSON directo al frontend
    # (NO guardamos nada)
```

**Tiempo:** 1 día

---

### Feature 2: Mostrar Resultados (2 vistas)
**Pantalla:**
- Toggle para cambiar vista: **Cards** o **Tabla**
- Vista Cards (grid de 3 columnas):
  - Nombre del negocio
  - Dirección
  - Teléfono
  - Website (link clickeable)
  - Rating de Google
  - # de reviews

- Vista Tabla (tipo spreadsheet):
  - Columnas: #, Nombre, Dirección, Teléfono, Website, Rating, Reviews
  - Cada fila es un negocio
  - Sorteable por columnas (opcional)

**Componente React:**
```jsx
// Toggle de vista
<div className="flex gap-2 mb-4">
  <button onClick={() => setView('cards')}>Vista Cards</button>
  <button onClick={() => setView('table')}>Vista Tabla</button>
</div>

{view === 'cards' ? (
  // Vista Cards
  <div className="grid grid-cols-3 gap-4">
    {businesses.map(biz => (
      <Card>
        <h3>{biz.name}</h3>
        <p>{biz.address}</p>
        <p>{biz.phone}</p>
        <a href={biz.website}>Website</a>
        <p>⭐ {biz.rating} ({biz.reviews} reviews)</p>
      </Card>
    ))}
  </div>
) : (
  // Vista Tabla
  <table className="w-full">
    <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Dirección</th>
        <th>Teléfono</th>
        <th>Website</th>
        <th>Rating</th>
        <th>Reviews</th>
      </tr>
    </thead>
    <tbody>
      {businesses.map((biz, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{biz.name}</td>
          <td>{biz.address}</td>
          <td>{biz.phone}</td>
          <td><a href={biz.website}>Link</a></td>
          <td>⭐ {biz.rating}</td>
          <td>{biz.review_count}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
```

**Tiempo:** 1 día

---

### Feature 3: Exportar a Google Sheets
**Pantalla:**
- Botón: "Exportar a Google Sheets" (arriba de los resultados)

**Backend:**
```python
@app.route('/api/export', methods=['POST'])
def export_to_sheets():
    # 1. Recibir array de negocios desde el frontend
    # 2. Llamar Google Sheets API
    # 3. Crear sheet con columnas: Name, Address, Phone, Website, Rating, Reviews
    # 4. Retornar URL del sheet creado
```

**Frontend:**
```jsx
// businesses está en el state de React
<button onClick={() => exportToSheets(businesses)}>
  Exportar a Google Sheets
</button>
// Cuando termina, abrir el URL del sheet en nueva pestaña
```

**Tiempo:** 1-2 días

---

## TOTAL: 3 FEATURES, ~3 DÍAS DE DESARROLLO

---

## ENDPOINTS DE LA API (SOLO 2)

### 1. POST /api/search
**Input:**
```json
{
  "location": "Hickory, NC",
  "radius": 10,
  "category": "pool services"
}
```

**Output:**
```json
{
  "businesses": [
    {
      "name": "Joe's Pool Service",
      "address": "123 Main St, Hickory NC",
      "phone": "(828) 555-1234",
      "website": "https://joespools.com",
      "rating": 4.5,
      "review_count": 87
    },
    // ... más negocios
  ],
  "total": 47
}
```

---

### 2. POST /api/export
**Input:**
```json
{
  "businesses": [
    { "name": "Joe's Pool Service", "address": "...", ... },
    { "name": "Blue Wave Pools", "address": "...", ... }
  ]
}
```

**Output:**
```json
{
  "sheet_url": "https://docs.google.com/spreadsheets/d/abc123..."
}
```

---

## PANTALLAS (UI MÍNIMO)

### Pantalla 1: Home / Search
```
┌─────────────────────────────────────┐
│  DOSSIER - Prospección Local        │
├─────────────────────────────────────┤
│                                     │
│  Ubicación: [Hickory, NC        ]  │
│  Radio:     [10 millas ▼]          │
│  Categoría: [Pool Services ▼]      │
│                                     │
│         [  Buscar Negocios  ]      │
│                                     │
└─────────────────────────────────────┘
```

### Pantalla 2: Results - Vista Cards
```
┌─────────────────────────────────────────────────┐
│  47 negocios encontrados                        │
│  [Cards] [Tabla]  [Exportar]  [Nueva Búsqueda] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Joe's Pool│  │Blue Wave │  │Crystal   │     │
│  │Service   │  │Pools     │  │Clear     │     │
│  │          │  │          │  │          │     │
│  │123 Main  │  │456 Oak   │  │789 Pine  │     │
│  │(828)555..│  │(828)555..│  │(828)555..│     │
│  │Website   │  │Website   │  │No website│     │
│  │⭐ 4.5 (87)│  │⭐ 4.8 (54)│  │⭐ 4.2 (23)│     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  [Más negocios...]                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Pantalla 2: Results - Vista Tabla
```
┌──────────────────────────────────────────────────────────────────┐
│  47 negocios encontrados                                         │
│  [Cards] [Tabla]  [Exportar]  [Nueva Búsqueda]                  │
├──────────────────────────────────────────────────────────────────┤
│  #  │ Nombre          │ Dirección      │ Teléfono    │ Website  │
├─────┼─────────────────┼────────────────┼─────────────┼──────────┤
│  1  │ Joe's Pool Svc  │ 123 Main St    │ (828)555... │ Link     │
│  2  │ Blue Wave Pools │ 456 Oak Ave    │ (828)555... │ Link     │
│  3  │ Crystal Clear   │ 789 Pine Rd    │ (828)555... │ N/A      │
│ ... │ ...             │ ...            │ ...         │ ...      │
└─────┴─────────────────┴────────────────┴─────────────┴──────────┘
```

---

## PLAN DE DESARROLLO (3 DÍAS)

### Día 1: Setup + Outscraper Integration
- [ ] Crear proyecto React con Vite + Tailwind
- [ ] Setup Flask backend básico (SIN base de datos)
- [ ] Integrar Outscraper API
- [ ] Endpoint POST /api/search funcionando
- [ ] Retornar JSON directo al frontend

### Día 2: Frontend - Search + Results (2 vistas)
- [ ] Pantalla de búsqueda (form con 3 inputs)
- [ ] Llamar API desde React
- [ ] Guardar resultados en React state
- [ ] Toggle para cambiar entre Cards y Tabla
- [ ] Vista Cards: mostrar en grid de 3 columnas (Tailwind)
- [ ] Vista Tabla: mostrar en table con columnas (#, Nombre, Dirección, Teléfono, Website, Rating, Reviews)
- [ ] Loading state mientras busca
- [ ] Error handling básico

### Día 3: Google Sheets Export + Deploy
- [ ] Setup Google OAuth (credenciales)
- [ ] Endpoint POST /api/export
- [ ] Crear sheet con Google Sheets API
- [ ] Formatear columnas (nombre, dirección, etc)
- [ ] Botón "Exportar" en frontend (envía businesses desde React state)
- [ ] Abrir sheet en nueva pestaña cuando termina
- [ ] Deploy frontend a Vercel
- [ ] Deploy backend a Railway
- [ ] Probar en producción

---

## COSTOS OPERACIONALES

**APIs:**
- Google Maps API: $0 ($200 crédito gratis/mes = 3,500 negocios)
- Google Sheets API: $0 (gratis)

**Hosting:**
- Vercel: $0 (free tier)
- Railway: $0-5/mes (free tier o hobby)

**Total: $0-5/mes**

**Para 200 negocios/mes (tu caso):**
- Costo Google Maps API: $0 (muy por debajo del límite)
- Costo total: $0-5/mes

**Ahorro por no usar DB:**
- ✅ No Supabase
- ✅ No setup de DB
- ✅ No migraciones
- ✅ Menos complejidad

---

## LO QUE NO VAMOS A CONSTRUIR (POR AHORA)

❌ Análisis de websites (HTTPS, mobile-friendly, etc)
❌ Dossiers en Word/PDF
❌ Job queues y progress tracking
❌ Social media detection
❌ Review sentiment analysis
❌ Multi-usuario
❌ CRM integration
❌ Email outreach automation

**Si necesitás estas features después, las agregás.** Pero para MVP personal, no las necesitás.

---

## DESPUÉS DEL MVP (SI LO QUERÉS MEJORAR)

**V1.1 - Análisis básico (opcional):**
- Agregar columna "Tiene Website" (Sí/No)
- Agregar columna "Website moderno" (verificar año en copyright)
- Esto es 1 día extra de desarrollo

**V1.2 - Dossiers manuales (opcional):**
- En vez de generarlos automáticamente, tenés un botón "Ver Detalle"
- La pantalla de detalle tiene toda la info del negocio
- Vos copiás y pegás en tu template de Word
- Esto es medio día de desarrollo

**V1.3 - Filtros (opcional):**
- Filtrar por rating (solo 4+ estrellas)
- Filtrar por "tiene website" vs "no tiene website"
- Ordenar por rating, reviews, etc
- Esto es 1 día de desarrollo

---

## TECH STACK JUSTIFICACIÓN (SIMPLE)

**React:** Conocido, rápido de prototipar, Tailwind para styling rápido
**Flask:** Python simple, 3 endpoints, no necesitás Django
**Supabase:** PostgreSQL gratis, no tenés que configurar nada
**Outscraper:** Ya resuelve el scraping de Google Maps ($1-2 vs $25 de Google API)
**Google Sheets:** API oficial, fácil de usar, todo el mundo tiene Google

---

## PRÓXIMOS PASOS (EMPEZAR HOY)

1. [ ] Crear proyecto en Google Cloud Console
2. [ ] Habilitar Places API y Geocoding API
3. [ ] Crear API Key y copiarla a `backend/.env`
4. [ ] Probar Google Maps API con 1 búsqueda manual
5. [ ] Si funciona → continuar con Día 2 (Frontend)

---

## DECISIÓN CLAVE

**¿Querés construir esto o usar GoHighLevel por $97/mes?**

**Construir (3 días):**
- ✅ Control total
- ✅ Costo $0-5/mes
- ✅ Customizable
- ✅ Sin base de datos (ultra simple)
- ❌ 3 días sin vender

**GoHighLevel ($97/mes):**
- ✅ Disponible hoy
- ✅ Más features (CRM, emails, etc)
- ❌ $97/mes
- ❌ Menos customizable

**Mi recomendación:** Si nunca validaste que los dossiers funcionan, empezá con el proceso manual (Fase 1 del doc anterior) por 1-2 semanas. Si cerrás 2-3 deals, ahí sí construí esta tool simple.

---

**END OF SIMPLIFIED PLAN**
