import { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const TicketOrden = forwardRef(({ orden, cliente, dispositivo, estado }, ref) => {
  const fechaActual = new Date().toLocaleString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Validaciones para evitar errores
  if (!orden || !cliente || !dispositivo || !estado) {
    return null;
  }

  return (
    <div ref={ref} className="bg-white p-8" style={{ width: '80mm', fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
        <h1 className="text-xl font-bold mb-1">TECNOLOGÍA VIRTUAL CEL</h1>
        <p className="text-xs">Tracking de Estados</p>
        <p className="text-xs">Tel: 7721-7169</p>
        <p className="text-xs">Santiago Atitlán</p>
      </div>

      {/* Fecha y Orden */}
      <div className="mb-4 text-xs">
        <p className="font-bold">RECIBO DE ORDEN</p>
        <p>Fecha: {fechaActual}</p>
        <div className="mt-2 border border-gray-400 rounded p-2 bg-gray-100">
          <p className="font-bold text-xs mb-1">NUMERO DE ORDEN:</p>
          <p className="font-bold text-xs font-mono break-all">#{orden.id}</p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="border-t border-b border-gray-300 py-3 mb-3 text-xs">
        <p className="font-bold mb-1">DATOS DEL CLIENTE:</p>
        <p><strong>Nombre:</strong> {cliente.nombre_completo || 'N/A'}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono || 'N/A'}</p>
        {cliente.correo && <p><strong>Email:</strong> {cliente.correo}</p>}
      </div>

      {/* Datos del Dispositivo */}
      <div className="border-b border-gray-300 pb-3 mb-3 text-xs">
        <p className="font-bold mb-1">DATOS DEL DISPOSITIVO:</p>
        <p><strong>Marca:</strong> {dispositivo.marca_nombre || 'N/A'}</p>
        <p><strong>Modelo:</strong> {dispositivo.modelo_nombre || 'N/A'}</p>
        {dispositivo.imei && <p><strong>IMEI:</strong> {dispositivo.imei}</p>}
        {dispositivo.color && <p><strong>Color:</strong> {dispositivo.color}</p>}
      </div>

      {/* Problema Reportado */}
      <div className="border-b border-gray-300 pb-3 mb-3 text-xs">
        <p className="font-bold mb-1">PROBLEMA REPORTADO:</p>
        <p className="whitespace-pre-wrap">{orden.descripcion_problema || 'Sin descripción'}</p>
      </div>

      {/* Estado y Prioridad */}
      <div className="border-b border-gray-300 pb-3 mb-4 text-xs">
        <div className="flex justify-between">
          <div>
            <p><strong>Estado:</strong> {estado.etiqueta_publica || 'Sin estado'}</p>
            <p><strong>Prioridad:</strong> {(orden.prioridad || 'normal').toUpperCase()}</p>
          </div>
          {orden.fecha_entrega_estimada && (
            <div className="text-right">
              <p><strong>Entrega Estimada:</strong></p>
              <p>{new Date(orden.fecha_entrega_estimada).toLocaleDateString('es-GT')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Código QR */}
      <div className="text-center mb-4">
        <p className="text-xs font-bold mb-2">CONSULTA EL ESTADO DE TU REPARACIÓN:</p>
        <div className="flex justify-center">
          <QRCodeCanvas 
            value={`${window.location.origin}/consulta/${orden.id}`}
            size={100}
            level="H"
          />
        </div>
        <p className="text-xs mt-2">Escanea este código QR</p>
      </div>

      {/* Términos y Condiciones */}
      <div className="border-t-2 border-dashed border-gray-400 pt-3 text-xs">
        <p className="font-bold mb-2">TÉRMINOS Y CONDICIONES:</p>
        <ul className="space-y-1 text-xs leading-tight">
          <li>• Escanea el QR para ver el progreso del estado.</li>
          <li>• Garantía de 30 días en reparación realizada.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-3 border-t border-gray-300 text-xs">
        <p className="font-bold">¡GRACIAS POR SU CONFIANZA!</p>
        <p className="mt-2">_________________________</p>
        <p>Firma del Cliente</p>
      </div>

      {/* Info adicional */}
      <div className="text-center mt-4 text-xs text-gray-600">
        <p>© 2025 Tecnología Virtual Cel</p>
      </div>
    </div>
  );
});

TicketOrden.displayName = 'TicketOrden';

export default TicketOrden;