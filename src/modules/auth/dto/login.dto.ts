import { IsEmail, IsNotEmpty, Matches } from "class-validator";


// TODO - move into a constant folder
export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,250}$/, {
        message: 'A senha deve conter letras maiúsculas, minusculas e números.',
    })
    password: string;
}