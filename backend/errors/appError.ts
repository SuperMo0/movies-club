export class appError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}