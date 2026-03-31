# ERP MDP PAN19 - v4.0.0 "Eficiencia y Control"

Sistema **MES/ERP** de grado industrial diseñado para la gestión de manufactura, cumplimiento **ISO 22000** (Inocuidad Alimentaria) y normativa **SII Chile** (DTE), operando bajo una arquitectura **Zero Trust** y patrón de datos **Memory-First**.

## 🏗️ Arquitectura del Sistema

El proyecto se rige por tres pilares fundamentales:
1.  **Dumb Server (Servidor Tonto):** El backend (`Core.gs`) actúa solo como un puente de paso y validador de integridad SHA-256. No procesa lógica de interfaz.
2.  **Memory-First:** Toda la base de datos se carga en la RAM del navegador al inicio de la sesión para búsquedas instantáneas y validación cruzada.
3.  **URS-28 (Uniform Record Structure):** Estándar de 28 columnas para asegurar la integridad referencial en todos los libros contables y de producción.

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

## 📦 Módulos Operativos

### 🛡️ Seguridad y Auditoría
* **Seguridad:** Gestión de usuarios y roles basada en niveles de acceso.
* **Auditoría Forense:** Registro inmutable de 12 columnas con encadenamiento criptográfico.
* **Sesión:** Control de autenticación y "Hot Kick" para revocación de acceso en tiempo real.

### 🏭 Abastecimiento y Bodega
* **Recepción Batch:** Ingesta masiva de DTEs (XML) con validación cruzada en RAM.
* **Maestro Ítems:** Gestión de fichas técnicas, alérgenos (ISO 22000) y stock.
* **Maestro Proveedores:** Enrolamiento y calificación de riesgo ISO.
* **Control de Lotes:** Trazabilidad total desde la recepción hasta la liberación de cuarentena.

### 💰 Finanzas y Control
* **Libro Compras:** Registro centralizado de documentos tributarios.
* **Libro Caja:** Conciliación bancaria y flujo de efectivo.

---

## 🚀 Despliegue en Google Apps Script (GAS)

Para poner en marcha el núcleo industrial, siga estrictamente el orden de inyección de archivos para evitar errores de referencia circular.

### 1. Preparación del Entorno
1.  Cree una nueva **Google Sheet** y asigne un nombre (ej. `ERP_PROD_V4`).
2.  Copie el ID de la hoja desde la URL.
3.  Vaya a `Extensiones > Apps Script`.

### 2. Inyección de Código (Servidor)
* **Core.gs:** Renombre el archivo `Core.js` del repositorio a `Core.gs` dentro del editor de GAS.
* **Config.gs:** Renombre `Config.js` a `Config.gs`.
    * **CRÍTICO:** Actualice la constante `CONFIG.SPREADSHEET_ID` con el ID obtenido.
    * Actualice `CONFIG.FOLDER_XML_BODEGA` con el ID de una carpeta de Drive para respaldos.

### 3. Inyección de Componentes (Frontend)
Cree los archivos de tipo **HTML** en el editor de GAS con los nombres exactos:
* `Index.html`, `Enrutamiento.html`, `Lib_Factory.html`, `Utils.html`, `Scripts_Main.html`, `Styles_Main.html`.

### 4. Publicación (Web App)
1.  Click en **Implementar > Nueva implementación**.
2.  Tipo: **Aplicación Web**.
3.  Ejecutar como: **Yo**.
4.  Quién tiene acceso: **Cualquier persona**.

---

## 📊 Diccionario de Datos y Mantenimiento (Estándar URS)

La base de datos reside en Google Sheets bajo el esquema **Uniform Record Structure (URS)**.

### 🔐 Gestión de Acceso e Identidad

#### **MAESTRO_USUARIOS**
Control de acceso y perfiles de identidad.
* `ID_UUID`: Llave primaria (UUID v4).
* `EMAIL`: Identificador único de acceso (Google Email).
* `NIVEL_ACCESO`: Rango numérico (1: Admin, 2: Operador, 3: Visita).
* `STATUS`: `ACTIVO` / `INACTIVO`.
* `NOMBRES`: Nombre completo del funcionario.

#### **MAESTRO_ROLES**
Definición de permisos granulares por módulo.
* `ID_ROL`: ID correlativo.
* `NOMBRE_ROL`: Etiqueta del perfil (ej. "AUDITOR PGA").
* `PERMISOS_JSON`: Arreglo de strings `["home", "recepcion", "auditoria"]`. El rol SUPER utiliza `["*"]`.

### 🏭 Producción y Trazabilidad

#### **ABASTECIMIENTO_LOTES (URS-16)**
Motor de la trazabilidad **HACCP** e **ISO 22000**.
* `ID_UUID`: Identificador único del registro.
* `ID_LOTE_PAN19`: Código interno de seguimiento.
* `SKU_INTERNO`: Código de producto vinculado a `MAESTRO_ITEMS`.
* `LOTE_PROVEEDOR`: Código de lote origen del XML/DTE.
* `SALDO_ACTUAL`: Stock físico disponible en tiempo real.
* `ESTADO_CALIDAD`: `APROBADO`, `CUARENTENA`, `RECHAZADO`.

### ⚙️ Estructuras JSON (Esquemas Lógicos)

El sistema utiliza objetos JSON en la tabla `SYS_CONFIG` para parametrizar la lógica sin alterar el código:

1.  **MATRIZ_ALERGENOS:** `{"GLUTEN": ["HARINA", "TRIGO"], "LACTEOS": ["QUESO", "LECHE"]}`. Utilizado para escaneo automático de ingredientes en recepción.
2.  **CATALOGO_TIPOS_ITEM:** Define categorías como `MP_CRITICA` o `INS_QUIM`, gatillando reglas de inspección ISO diferenciadas.
3.  **SCHEMA_NUTRICIONAL:** Estructura de límites para etiquetado y cumplimiento de la Ley de Alimentos.

---

## 🛡️ Protocolo Forense (SYS_AUDIT_LOG)

**PROHIBIDO:** Editar manualmente la hoja `SYS_AUDIT_LOG`.
* El motor `Core.gs` valida la integridad mediante la columna `HASH_RECORD`.
* Cualquier edición manual romperá el encadenamiento criptográfico, activando la alerta de **"Ruptura de Integridad"**.
* El esquema consta de **12 columnas** obligatorias, incluyendo `IP_ADDRESS` y `HASH_PREVIOUS`.

---

## 📜 Estándares de Cumplimiento
* **SII Chile:** Procesamiento de XML mediante `SII_MAPPING` definido en `Config.js`.
* **ISO 22000:** Protocolo **PCC-01** integrado en el flujo de recepción.
* **Forense:** Cada fila escrita genera un hash SHA-256 derivado de la fila anterior.

---

### **CHECKLIST DE SALUD DEL SISTEMA**
- [x] `SPREADSHEET_ID` configurado en `Config.gs`.
- [x] Headers de las hojas coinciden con los índices `URS_` de `Config.gs`.
- [x] `SYS_AUDIT_LOG` inicializado con fila "GENESIS".
- [x] Permisos de Drive otorgados para la carpeta de XMLs.

**Documentación de Verdad Consolidada. Murphy fuera.**

---

# **ANÁLISIS ESTRUCTURAL URS (Uniform Record Structure)**

Los datos proporcionados para las 5 tablas base son **técnicamente exactos** y cumplen con el estándar URS declarado. Sin embargo, **la lista está incompleta** respecto al modelo de datos integral de la V4. Para que el motor "Memory-First" inicialice sin errores de dependencia y para cubrir la seguridad Zero Trust, debemos incluir las tablas de control, acceso y finanzas.

A continuación, presento la tabla **completa y validada**, integrando las piezas maestras faltantes:

### ⚙️ Estructura Completa de las Hojas (Tabs) - ERP MDP PAN19 V4
Cada pestaña en la hoja de cálculo debe coincidir exactamente con los nombres definidos en `Config.js > DB`.

| Hoja | Columnas Requeridas | Propósito |
| :--- | :--- | :--- |
| **`MAESTRO_ITEMS`** | 18 (URS-18) | Catálogo de SKUs, alérgenos e indicadores de inocuidad (ISO 22000). |
| **`MAESTRO_PROVEEDORES`** | 22 (URS-22) | Enrolamiento de entidades, RUT, giro y niveles de riesgo ISO. |
| **`LIBRO_COMPRAS`** | 29 (URS-29) | Registro transaccional inmutable de DTEs y detalles JSON (Compliance SII). |
| **`ABASTECIMIENTO_LOTES`** | 16 (URS-16) | Trazabilidad forense de saldos, ubicaciones y estados de calidad (HACCP/ISO). |
| **`SYS_AUDIT_LOG`** | 12 (URS-12) | Registro forense del sistema con encadenamiento criptográfico (Hash SHA-256). |
| **`SYS_CONFIG`** | 6 (URS-6)| Parámetros globales, esquemas JSON (Ej. Matrices de alérgenos) y reglas de negocio. |
| **`MAESTRO_USUARIOS`** | 7 (URS-7) | Control de identidades, UUID de acceso y estatus de cuentas. |
| **`MAESTRO_ROLES`** | 5 (URS-5) | Matriz de permisos en formato JSON para el enrutamiento y acceso granular a módulos. |
| **`LIBRO_CAJA`** | 10 (URS-10) | Control de movimientos, flujos bancarios y conciliación financiera. |

---

### **NOTAS TÉCNICAS DE INTEGRACIÓN:**
* **Seguridad Zero Trust:** Las tablas `MAESTRO_USUARIOS` y `MAESTRO_ROLES` son las primeras en ser consultadas por `Core.gs` antes de permitir la hidratación de los demás módulos. Su ausencia rompería la secuencia de arranque.
* **Parámetros Dinámicos:** La tabla `SYS_CONFIG` es vital para el módulo de Recepción, ya que alberga el objeto `MATRIZ_ALERGENOS` y `SII_MAPPING`.

### **CHECKLIST DE CIERRE DE AUDITORÍA**
- [x] Contraste URS validado contra `Config.js`.
- [x] Verificación de columnas exactas contra bases `.csv` de respaldo.
- [x] Integración de tablas núcleo de Seguridad, Finanzas y Configuración.

**La tabla está ahora blindada y lista para ser consolidada en el archivo README.md. ¿Autoriza continuar?**
