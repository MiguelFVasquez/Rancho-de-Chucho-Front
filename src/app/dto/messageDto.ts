export interface MessageDTO {
    status: boolean;  // true (success) or false (error)
    message: number;  // ID of the created product or -1 if error
}
