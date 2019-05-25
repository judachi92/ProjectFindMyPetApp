export class Usuario {
    id:number;
    nombre:string;
    apellido:string;
    cedula: string;
    direccion: string;
    clave: string;
    confirmar_clave: string;
    email:string;
    telefono:string;

    politica:boolean;

    access_token:string;
    token_type:string;
}