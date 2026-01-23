# AI Support Copilot

**Autor:** Juan Barragan

---

## Descripción
AI Support Copilot es un sistema de soporte potenciado por Inteligencia Artificial que recibe tickets, los procesa automáticamente para determinar su categoría y sentimiento, y los visualiza en tiempo real en un dashboard interactivo. Incluye notificaciones simuladas para tickets negativos y utiliza un esquema de colores para representar el sentimiento de cada ticket.

---

## URLs de Despliegue

- **Frontend (Dashboard React + Vite):** [https://dashboard.render.com/static/srv-d5pe80n5c7fs73bkhej0](https://dashboard.render.com/static/srv-d5pe80n5c7fs73bkhej0)
- **Backend (API FastAPI):** [https://ai-support-copilot-cumb.onrender.com](https://ai-support-copilot-cumb.onrender.com)

**Para enviar un ticket**, usar JSON; se incluye una colección de Postman como ejemplo: `ai-support-copilot.postman_collection.json`

---

## Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript, Vite, Bootstrap 5, Tailwind CSS  
- **Backend:** Python, FastAPI, LangChain  
- **Base de Datos:** Supabase (PostgreSQL)  
- **Automatización:** n8n (triggers de tickets y notificaciones simuladas)  
- **Despliegue:** Render (frontend y backend)  
- **Realtime:** Canales de Supabase para actualización instantánea de tickets

---

## Arquitectura / Flujo

1. **Frontend React:**  
   - Se conecta directamente a Supabase para mostrar los tickets.  
   - Usa **Realtime** para actualizar automáticamente los tickets cuando cambian (procesados, categorías o sentimiento).  
   - Aplica colores por sentimiento y badges por categoría.

2. **Backend FastAPI:**  
   - Endpoint `POST /process-ticket` recibe el texto de un ticket.  
   - Usa **LangChain + LLM** para determinar la categoría y el sentimiento.  
   - Actualiza la tabla `tickets` en Supabase marcando el ticket como procesado.

3. **Base de Datos Supabase:**  
   - Tabla `tickets` con campos: `id`, `created_at`, `description`, `category`, `sentiment`, `processed`.  
   - Soporta suscripciones Realtime para el frontend.

4. **Automatización n8n:**  
   - Trigger de nueva fila en Supabase o webhook del backend.  
   - Procesa el ticket mediante la API de FastAPI.  
   - Si el sentimiento es **Negativo**, dispara una **notificación simulada** (ej. email).

---

## Estrategia de Prompt Engineering

Se diseñó un **prompt simple y efectivo** para que el modelo de lenguaje determine la categoría y el sentimiento de un ticket.

**Prompt usado:**

```
You are an AI support assistant.

Analyze the following support ticket and return a JSON object with:
- category: one of [Technical, Billing, Sales]
- sentiment: one of [Positive, Neutral, Negative]

Ticket:
"{ticket_text}"

Respond ONLY with valid JSON.
```

**Detalles destacados:**  
- Se obliga al modelo a responder **solo en JSON válido**, facilitando la integración automática.  
- Se limitan las categorías y sentimientos a opciones predefinidas, evitando errores.  
- Esto permite actualizar la base de datos de Supabase y el dashboard de forma confiable.

---

## Características Destacadas

- **Realtime en Frontend:** los cambios en tickets se reflejan instantáneamente gracias a los canales de Supabase.  
- **Notificaciones Negativas:** tickets con sentimiento negativo disparan alertas simuladas mediante n8n.  
- **Visualización intuitiva:** badges y colores por categoría y sentimiento para una lectura rápida del estado de los tickets.

---

## Estructura del Repositorio

```
/supabase
  └── setup.sql            # Esquema y políticas de la tabla tickets
/python-api
  ├── main.py              # API FastAPI
  ├── requirements.txt
  └── Dockerfile
/n8n-workflow
  └── workflow.json        # Flujo de automatización n8n
/frontend
  ├── src                  # Código fuente del dashboard React
  ├── package.json
  └── Dockerfile
```

---

## Contacto

Juan Barragan  
orionmaster8@gmail.com

---

*¡Gracias por revisar mi proyecto!*