export interface Message<T = any> {
    error: boolean;  // false (success) or true (error)
    respuesta: T;  // Contiene los datos devueltos por la API
    mensaje: string;
}
