export interface MessageDTO {
    status: string;   // Puede ser 'OK', 'ERROR', etc.
    message: any;  // El mensaje descriptivo de la respuesta.
}