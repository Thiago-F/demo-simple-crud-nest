import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 12
export class EncryptAdapter {
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, SALT_ROUNDS)
    }
}