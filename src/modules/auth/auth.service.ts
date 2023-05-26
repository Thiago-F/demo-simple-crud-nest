import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../data/repositories/user-repository';
import { EncryptAdapter } from '../../infra/bcryptAdapter';

import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly encryptService: EncryptAdapter,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

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

    async signUp({ data }: { data: SignUpDto }) {
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
