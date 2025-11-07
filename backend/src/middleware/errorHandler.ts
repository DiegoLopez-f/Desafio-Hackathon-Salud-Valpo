import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error capturado por middleware:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de OpenAI API
  if (err.message.includes('OpenAI')) {
    return res.status(503).json({
      success: false,
      error: 'Servicio de IA temporalmente no disponible. Intenta nuevamente en unos momentos.'
    });
  }

  // Error de validación
  if (err.message.includes('validation') || err.message.includes('required')) {
    return res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos. Verifica tu solicitud.'
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor. Por favor contacta al soporte si el problema persiste.'
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint no encontrado: ${req.method} ${req.url}`
  });
};