# Proyecto: Automatización de Prospección para Negocios Locales

## Contexto
- **Objetivo**: Crear un sistema que automatice la recolección de información de negocios locales para venderles servicios de digitalización (websites, sistemas de agendamiento, presencia digital).
- **Ubicación inicial**: Hickory, North Carolina
- **Escala**: Comenzar en Hickory, expandir a otras ciudades con pequeños negocios locales
- **Modelo de negocio**: Vender servicios de digitalización directamente a negocios locales (no vender el sistema)

---

## El Modelo de Negocio

### Quién es el cliente
- Juan (tú) es quien vende directamente a los negocios locales
- No es un SaaS vendible a terceros; es tu máquina personal de prospección

### Qué se vende
- Digitalización web completa
- Websites modernos, responsive
- Sistemas de agendamiento online
- Optimización de presencia digital (Google Business, redes sociales)
- Automatización de reseñas y reputación online

### Industrias objetivo (inicialmente)
- Pool Services
- Landscaping / Servicios de jardinería
- Beauty Salons / Estéticas
- Restaurantes (enfoque en ventas delivery sin intermediarios)
- Barbershops
- Otros negocios locales con presencia digital desactualizada

---

## El Flujo de Prospección Completo

### Paso 1: Búsqueda Geográfica
- Seleccionar área en mapa (ej: Hickory, radio 10km)
- Filtrar por categoría (pool services, landscaping, etc.)
- Sistema devuelve lista de negocios en esa área (~30-50 negocios)

### Paso 2: Análisis Automático de Presencia Digital
Para cada negocio, el sistema extrae:
- Nombre, dirección, teléfono
- Website actual (si existe)
- Google Business Profile (rating, reseñas, fotos)
- Presencia en redes sociales (Facebook, Instagram)
- Antigüedad estimada del website
- Si es mobile-friendly
- Análisis de contenido (galería de fotos, testimonios, formularios, etc.)

### Paso 3: Generación de Dossier
El sistema automáticamente genera un documento por cada negocio que contiene:
- **Situación actual**: análisis de qué tiene hoy (website, redes, presencia)
- **Oportunidades**: qué le falta (website moderno, agendamiento online, reseñas automáticas, contenido en redes)
- **Propuesta de solución**: servicios específicos que ofreces
- **Precio estimado**: de la solución

### Paso 4: Salida Final
1. **Google Sheet**: Una fila por negocio con columnas de análisis
2. **Documentos PDF/Word**: Un dossier por cada negocio listo para enviar o compartir

---

## Las 3 Fuentes de Datos

### Fuente 1: Google Maps API
Búsqueda geográfica + categoría retorna:
- Nombre del negocio
- Dirección y coordenadas
- Teléfono
- Website (si está registrado)
- Horario de atención
- Rating y cantidad de reseñas
- URL del Google Business Profile

### Fuente 2: Análisis del Website Actual
Acceder y extraer del sitio web del negocio:
- Antigüedad estimada
- Responsive/Mobile-friendly (sí/no)
- Estructura de contenido (servicios, galería, testimonios, contacto)
- Imágenes de servicios
- Formularios de contacto

### Fuente 3: Google Business Profile + Redes Sociales
Desde el perfil de Google Business:
- Fotos de portada (antigüedad)
- Descripción
- Reseñas recientes (contenido)

Búsquedas en redes sociales:
- ¿Tiene Facebook activo?
- ¿Tiene Instagram?
- Última publicación
- Cantidad de followers

---

## Lo que Genera el Sistema

### Google Sheet (Una fila por negocio)
Columnas incluyen:
- Nombre negocio
- Dirección
- Teléfono
- Website actual
- Rating Google
- Cantidad reseñas
- Presencia en Facebook (sí/no, última actividad)
- Presencia en Instagram (sí/no, followers)
- Website antiguo (sí/no)
- Mobile-friendly (sí/no)
- Galería de fotos (sí/no)
- **Señales de oportunidad** (resumen ejecutivo)

### Dossier por Negocio (PDF/Word)
Documento templado que contiene:
- **NEGOCIO**: Nombre y datos básicos
- **ANÁLISIS ACTUAL**: Evaluación de website, Google Business, redes sociales, presencia digital
- **OPORTUNIDADES**: Qué le falta específicamente
- **PROPUESTA**: Servicios que ofreces
- **PRECIO ESTIMADO**: Investopción de la solución

---

## Visión del Usuario (UX)

1. **TÚ abres la app**
2. **Dibujas en mapa**: Hickory, radio 10km
3. **Seleccionas**: "Pool Services"
4. **Clickeas**: "Extraer"
5. **Sistema automáticamente** (2-5 minutos):
   - Busca 45 negocios en Google Maps
   - Extrae info de Google Business de cada uno
   - Accede a websites y analiza estructura
   - Busca presencia en Facebook/Instagram
   - Genera análisis de oportunidades
6. **RESULTADO**:
   - Google Sheet con 45 filas completas
   - 45 documentos/PDFs listos con dossier
   - **TÚ tienes prospección lista para outreach**

---

## Stack Técnico Recomendado

**Decisión: Construir SaaS Propio**

Razón: No quieres vender la automatización, quieres un resultado (Sheet + Docs con información). Make.com y Google Apps Script tienen limitaciones para uso repetido, delays y costos por uso.

**Stack propuesto**:
- **Backend**: Python + Flask
- **APIs**: Google Maps API, Google Sheets API, Google Docs API, Web Scraping (Selenium/BeautifulSoup)
- **Base de datos**: PostgreSQL (para historial de búsquedas, resultados cacheados)
- **Frontend**: React (interfaz para seleccionar área y categoría)
- **Integración**: Automática a Google Sheets y Google Docs del usuario

---

## Timeline Estimado

- **Desarrollo**: 2-3 semanas
- **MVP funcional**: Website + sistema de búsqueda + Sheet exportable
- **Validación**: Ejecutar 3-5 búsquedas reales, ver si la información es útil para vender

---

## Próximos Pasos

1. Definir exactamente qué campos van en el Sheet
2. Mapear estructura técnica del backend
3. Comenzar desarrollo del MVP
4. Validar con búsquedas reales en Hickory