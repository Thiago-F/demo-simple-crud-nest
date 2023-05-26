import { IsEmail, IsNotEmpty, Matches } from "class-validator";


// TODO - move into a constant folder

export class SignUpDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^([0-9]{10}|[0-9]{11})$/, {
        message: 'O telefone deve possuir 10 ou 11 caracteres',
    })
    phone: string;

    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,250}$/, {
        message: 'A senha deve conter letras maiúsculas, minusculas e números.',
    })
    password: string;

    @IsNotEmpty()
    passwordConfirmation: string;
}