import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/repositories/user-repository';
import { EncryptAdapter } from 'src/infra/bcryptAdapter';

class SignUpDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptService: EncryptAdapter
    ) { }

    async signUp({ data }: { data: SignUpDto }) {
        const { name, email, phone, password, passwordConfirmation } = data

        if (password !== passwordConfirmation) {
            throw new BadRequestException('password does not match with confirm password')
        }

        const encryptedPassword = await this.encryptService.hash(password)

        return await this.userRepository.create({
            name,
            email,
            phone,
            password: encryptedPassword
        })
    }
}
