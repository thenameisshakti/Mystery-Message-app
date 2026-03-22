// interface → object shapes & public APIs
// type → unions, primitives, utilities


import { Message } from "../modal/user.modal"
export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptionMessages?: boolean
    messages?: Array<Message>
}