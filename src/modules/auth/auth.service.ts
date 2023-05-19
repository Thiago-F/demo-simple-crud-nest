import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/data/repositories/user-repository';
import { EncryptAdapter } from 'src/infra/bcryptAdapter';

import { JwtService } from '@nestjs/jwt';

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
        private readonly encryptService: EncryptAdapter,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log('validate?')
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

        console.log('user validate', user)

        if (!user) {
            return null;
        }

        const comparePassword = await this.encryptService.compare(pass, user.password)

        if (!comparePassword) {
            throw new UnauthorizedException()
        }

        const { password, ...result } = user;
        return result;
    }

    async signUp({ data }: { data: any }) {
        const {
            name,
            email,
            phone,
            password,
            passwordConfirmation
        } = data

        if (password !== passwordConfirmation) {
            throw new BadRequestException('password does not match with confirm password')
        }

        const encryptedPassword = await this.encryptService.hash(password)

        const createdUser = await this.userRepository.create({
            name,
            email,
            phone,
            password: encryptedPassword
        })

        return createdUser
    }

    async login({ data, user }) {
        console.log('data, user', data, user)

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name
        }

        const access_token = this.jwtService.sign(payload)

        return {
            access_token
        }
    }
}
