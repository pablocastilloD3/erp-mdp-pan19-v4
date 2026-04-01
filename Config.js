/**
 * @file Config.gs
 * @description Fuente de la Verdad Inmutable. Mapeo URS y Lógica de Relaciones.
 * @version 2.3.0
 * @reparacion [A5] SPREADSHEET_ID truncado — eliminado fragmento /edit?gid=... inválido.
 * @reparacion [NUEVO] LLAVES_PRIMARIAS — Mapa declarativo para Exploración Activa en Core.js v6.0.0.
 */

var CONFIG = {
  APP_NAME: "ERP MDP PAN19",
  VERSION: "4.0.0",
  ENV: "DEV",
  COMPLIANCE: {
    NORMA_1: "ISO 22000 COMPLIANT",
    NORMA_2: "DTE SII CHILE"
  },
  ARCHITECTURE: "Zero Trust Architecture",
  CHILE_OFFSET: "America/Santiago",

  // ═══ [A5] CORREGIDO: Solo el ID, sin fragmento de URL ═══
  SPREADSHEET_ID: "1vwJaRvW8eTFqfhr02yOvPBOMvmDtTI6mJ_irXQXtZk4",

  FOLDER_XML_BODEGA: "1rRUzM1XqSshYn1YjD5irqFzzjgg3Ztw1",

  // =========================================================================
  // 1. MAPEO DE TABLAS FÍSICAS (Nombres de pestañas en Google Sheets)
  // =========================================================================
  DB: {
    COMPRAS: 'LIBRO_COMPRAS',
    ITEMS: 'MAESTRO_ITEMS',
    CONFIG: 'SYS_CONFIG',
    PROVEEDORES: 'MAESTRO_PROVEEDORES',
    AUDIT_LOG: 'SYS_AUDIT_LOG',
    USUARIOS: 'MAESTRO_USUARIOS',
    ROLES: 'MAESTRO_ROLES',
    LOTES: 'ABASTECIMIENTO_LOTES',
    CAJA: 'LIBRO_CAJA'
  },

  // =========================================================================
  // 1.5. LLAVES PRIMARIAS POR TABLA (Exploración Activa v6.0.0)
  // =========================================================================
  // Cada clave corresponde al ID usado en CONFIG.DB.
  // El valor es el nombre EXACTO de la columna cabecera en la hoja física.
  // w_EjecutarTransaccionSegura usa este mapa para localizar la PK por nombre
  // en lugar de asumir que siempre es cabeceras[0].
  LLAVES_PRIMARIAS: {
    COMPRAS: 'ID_UUID',
    ITEMS: 'ID_ITEM',
    CONFIG: 'PARAM_KEY',
    PROVEEDORES: 'ID_UUID',
    AUDIT_LOG: 'ID_LOG',
    USUARIOS: 'ID_UUID',
    ROLES: 'ID_ROL',
    LOTES: 'ID_UUID',
    CAJA: 'ID_MOVIMIENTO'
  },

  // =========================================================================
  // 2. DICCIONARIO TÉCNICO URS (Uniform Record Structure)
  // =========================================================================

  URS_COMP: {
    ID_UUID: 0, TIMESTAMP_CREATE: 1, TIMESTAMP_UPDATE: 2, USER_CREATOR: 3, USER_UPDATER: 4, STATUS: 5,
    FECHA_EMISION: 6, TIPO_DTE: 7, FOLIO: 8, RUT_EMISOR: 9, RAZON_SOCIAL: 10, FECHA_RECEPCION_REAL: 11,
    MONTO_NETO: 12, MONTO_EXENTO: 13, MONTO_IVA: 14, OTROS_IMPUESTOS: 15, MONTO_TOTAL: 16, OBSERVACIONES: 17,
    ISO_LOTE: 18, ISO_VENCIMIENTO: 19, ISO_ALERGENOS: 20, ISO_RIESGO_PROV: 21, CONTROL_CALIDAD: 22,
    ESTADO_PAGO: 23, URL_XML: 24, SII_FCT_PROP: 25, SOURCE_APP: 26, CATEGORY_FLOW: 27, DETALLE_JSON: 28
  },

  MAPA_DTE: {
    SKU: 'sku',
    NOMBRE: 'nmb',
    CANTIDAD: 'qty',
    PRECIO: 'prc',
    DESC: 'det'
  },

  URS_CAJA: {
    ID_MOVIMIENTO: 0, FECHA_BANCO: 1, INSTITUCION: 2, DESCRIPCION_BANCO: 3, TIPO: 4,
    MONTO: 5, ESTADO_CONCILIACION: 6, FOLIO_VINCULADO: 7, FECHA_SISTEMA: 8, USUARIO_SYNC: 9
  },

  URS_LOTES: {
    ID_UUID: 0, ID_LOTE_PAN19: 1, SKU_INTERNO: 2, LOTE_PROVEEDOR: 3, DTE_TIPO: 4, DTE_FOLIO: 5,
    RUT_PROVEEDOR: 6, FECHA_ELABORACION: 7, FECHA_CADUCIDAD: 8, CANTIDAD_ORIGINAL: 9, SALDO_ACTUAL: 10,
    UBICACION: 11, ESTADO_CALIDAD: 12, URL_EVIDENCIA: 13, TIMESTAMP_CREATE: 14, USER_CREATOR: 15
  },

  URS_ITEMS: {
    ID_ITEM: 0, TIMESTAMP_UPDATE: 1, USER_UPDATER: 2, STATUS: 3, SKU_INTERNO: 4,
    NOMBRE_TECNICO: 5, TIPO_ITEM: 6, UNIDAD_MEDIDA: 7, AFECTO_IVA: 8, CUENTA_CONTABLE: 9,
    CATEGORIA_ABC: 10, STOCK_MINIMO: 11, PUNTO_REORDEN: 12, STOCK_MAXIMO: 13,
    ISO_ALERGENOS: 14, ISO_VIDA_UTIL_DIAS: 15, RUT_PROV_PREFERENTE: 16, FICHA_TECNICA_JSON: 17
  },

  URS_PROV: {
    ID_UUID: 0, TIMESTAMP_CREATE: 1, TIMESTAMP_UPDATE: 2, STATUS: 3, RUT_ENTIDAD: 4, RAZON_SOCIAL: 5,
    GIRO: 6, ACTECO: 7, DIRECCION: 8, COMUNA: 9, CIUDAD: 10, EMAIL: 11, TELEFONO: 12, ISO_RIESGO: 13,
    ISO_CERTIFICADOS: 14, FECHA_ULT_AUDITORIA: 15, CATALOGO_JSON: 16, CONDICION_PAGO: 17,
    OBSERVACIONES: 18, USER_UPDATER: 19, ALERTA_AUTO: 20, ALERTA_STATUS: 21
  },

  URS_AUDIT: {
    ID_LOG: 0, TIMESTAMP: 1, USER_EMAIL: 2, ACTION_TYPE: 3, MODULO: 4, ENTIDAD_ID: 5,
    VALOR_ANTERIOR: 6, VALOR_NUEVO: 7, IP_ADDRESS: 8, DETALLES: 9, HASH_RECORD: 10, HASH_PREVIOUS: 11
  },

  URS_USER: {
    ID_UUID: 0, EMAIL: 1, NIVEL_ACCESO: 2, STATUS: 3, NOMBRES: 4, TIMESTAMP_CREATE: 5, USER_CREATOR: 6
  },

  URS_CONFIG: {
    PARAM_KEY: 0, PARAM_VALUE: 1, TIPO_DATO: 2, DESCRIPCION: 3, TIMESTAMP_UPDATE: 4, USER_UPDATER: 5
  },

  URS_ROLES: {
    ID_ROL: 0, NOMBRE_ROL: 1, PERMISOS_JSON: 2, STATUS: 3, TIMESTAMP_UPDATE: 4
  }
};

/**
 * @section DICCIONARIO DE INFRAESTRUCTURA DE DATOS (V4)
 * Centraliza el mapeo entre XML del SII y la estructura forense.
 */
var CONFIG_DETALLE_COMPRAS = {
  SII_MAPPING: {
    SKU: 'VlrCodigo',
    NOMBRE: 'NmbItem',
    DESCRIPCION: 'DscItem',
    CANTIDAD: 'QtyItem',
    PRECIO: 'PrcItem',
    UNIDAD: 'UnmdItem',
    MONTO: 'MntoItem'
  },

  EXTRACTORES: {
    LOTE: {
      pattern: /(?:LOTE|LOT|L:|B:|BATCH)\s*[:#-]?\s*([A-Z0-9.\-\/]+)/i,
      target_field: 'DESCRIPCION'
    }
  },

  SCHEMA_JSON: {
    sku: null,
    nombre: null,
    cantidad: 0,
    precio: 0,
    unidad: 'UN',
    lote: 'S/L',
    alergenos: 'OK',
    iso_status: 'PENDIENTE'
  }
};