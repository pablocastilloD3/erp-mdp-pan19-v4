# ERP MDP PAN19 - v4.0.0 "Eficiencia y Control"

Sistema **MES/ERP** de grado industrial diseñado para la gestión de manufactura, cumplimiento **ISO 22000** (Inocuidad Alimentaria) y normativa **SII Chile** (DTE), operando bajo una arquitectura **Zero Trust** y patrón de datos **Memory-First**.

## 🏗️ Arquitectura del Sistema

El proyecto se rige por tres pilares fundamentales:
1. **Dumb Server (Servidor Tonto):** El backend (`Core.gs`) actúa solo como un puente de paso y validador de integridad SHA-256. No procesa lógica de interfaz.
2. **Memory-First:** Toda la base de datos se carga en la RAM del navegador al inicio de la sesión para búsquedas instantáneas y validación cruzada.
3. **URS (Uniform Record Structure):** Estándar de columnas fijas para asegurar la integridad referencial en todos los libros contables y de producción.

---

## 📁 Estructura del Núcleo (Base Files)

Estos archivos constituyen la infraestructura crítica e inmutable del sistema:

| Archivo | Función Principal |
| :--- | :--- |
| `Config.js` | **Fuente de la Verdad.** Mapeo de columnas URS, constantes del SII, IDs de carpetas y parámetros de red. |
| `Core.js` | Motor Backend. Gestiona el despliegue `doGet`, la escritura universal segura y el sellado de logs SHA-256. |
| `Index.html` | **App Shell.** Contenedor principal de la aplicación. |
| `Enrutamiento.html` | Orquestador de UI. Genera el menú lateral dinámicamente y gestiona el enrutador SPA. |
| `Lib_Factory.html` | **Patrón Factory.** Generador de componentes UI estandarizados (Tablas paginadas, formularios y modales). |
| `Utils.html` | Centinela del sistema. Gestiona la hidratación de la RAM (`descargarRAM`), el Splash Screen y la auditoría. |
| `Scripts_Main.html` | Núcleo SPA. Define el estado global `window.SISTEMA_ERP` y la lógica de navegación. |
| `Styles_Main.html` | ADN Visual. Reglas CSS core basadas en Bootstrap 5.3 con optimización para Safari/iOS. |

---

## 🧩 Arquitectura de Módulos (S-V-W)

Cada módulo funcional se divide obligatoriamente en tres componentes para garantizar escalabilidad:

* **S_[Modulo].html (Controlador):** Define metadatos, permisos y lógica de eventos de la interfaz.
* **V_[Modulo].html (Vista):** Contiene el template HTML puro basado en componentes de la `Factory`.
* **W_[Modulo].gs/js (Motor):** Ejecuta la lógica pesada, el parseo de datos y la comunicación con el `Core`.

---

## 🚀 Despliegue en Google Apps Script (GAS)

Para poner en marcha el núcleo industrial, siga estrictamente el orden de inyección de archivos:

### 1. Preparación del Entorno
1. Cree una nueva **Google Sheet** y asigne un nombre (ej. `ERP_PROD_V4`).
2. Copie el ID de la hoja desde la URL.
3. Vaya a `Extensiones > Apps Script`.

### 2. Inyección de Código (Servidor)
* **Core.gs:** Renombre el archivo `Core.js` del repositorio a `Core.gs` dentro del editor de GAS.
* **Config.gs:** Renombre `Config.js` a `Config.gs`.
    * **CRÍTICO:** Actualice la constante `CONFIG.SPREADSHEET_ID` con el ID obtenido.
    * Actualice `CONFIG.FOLDER_XML_BODEGA` con el ID de una carpeta de Drive para respaldos.

### 3. Inyección de Componentes (Frontend)
Cree los archivos de tipo **HTML** en el editor de GAS con los nombres exactos:
* `Index.html`, `Enrutamiento.html`, `Lib_Factory.html`, `Utils.html`, `Scripts_Main.html`, `Styles_Main.html`.

### 4. Publicación (Web App)
1. Click en **Implementar > Nueva implementación**.
2. Tipo: **Aplicación Web**.
3. Ejecutar como: **Yo** (Propietario de la base de datos).
4. Quién tiene acceso: **Cualquier persona** (Acceso protegido por Zero Trust).

---

## 📊 Matriz de Datos y Mantenimiento (Estándar URS)

La base de datos reside en Google Sheets. El incumplimiento de este esquema romperá la carga a RAM (`descargarRAM`). Cada pestaña debe coincidir exactamente con los nombres definidos en `Config.js > DB`.

| Hoja | Columnas | Propósito Central |
| :--- | :--- | :--- |
| `MAESTRO_ITEMS` | 18 (URS-18) | Catálogo de SKUs, alérgenos e indicadores de inocuidad (ISO 22000). |
| `MAESTRO_PROVEEDORES`| 22 (URS-22) | Enrolamiento de entidades, RUT, giro y niveles de riesgo ISO. |
| `LIBRO_COMPRAS` | 29 (URS-29) | Registro transaccional inmutable de DTEs y detalles JSON. |
| `ABASTECIMIENTO_LOTES`| 16 (URS-16) | Trazabilidad forense de saldos, ubicaciones y estados de calidad (HACCP/ISO). |
| `SYS_AUDIT_LOG` | 12 (URS-12) | Registro forense del sistema con encadenamiento criptográfico SHA-256. |
| `SYS_CONFIG` | 6 (URS-6) | Parámetros globales, esquemas JSON y reglas de negocio. |
| `MAESTRO_USUARIOS` | 7 (URS-7) | Control de identidades, UUID de acceso y estatus de cuentas. |
| `MAESTRO_ROLES` | 5 (URS-5) | Matriz de permisos en formato JSON para acceso granular. |
| `LIBRO_CAJA` | 10 (URS-10)| Control de movimientos y flujos financieros. |

### ⚙️ Estructuras JSON (Esquemas Lógicos en SYS_CONFIG)
El sistema utiliza objetos JSON para parametrizar la lógica sin alterar el código duro:
1. **MATRIZ_ALERGENOS:** `{"GLUTEN": ["HARINA", "TRIGO"], "LACTEOS": ["QUESO", "LECHE"]}`.
2. **CATALOGO_TIPOS_ITEM:** Define categorías (`MP_CRITICA`, `INS_QUIM`) para reglas de inspección.

---

## 🛡️ Protocolo Forense (SYS_AUDIT_LOG)

**PROHIBIDO:** Editar manualmente la hoja `SYS_AUDIT_LOG`.
* El motor `Core.gs` valida la integridad mediante la columna `HASH_RECORD`.
* Cualquier edición manual romperá el encadenamiento criptográfico, activando la alerta de **"Ruptura de Integridad"**.

---

## 📜 Estándares de Cumplimiento
* **SII Chile:** Procesamiento de XML mediante `SII_MAPPING` definido en `Config.js`.
* **ISO 22000:** Protocolo **PCC-01** integrado en el flujo de abastecimiento (bloqueo automático de Lotes sin certificar).
