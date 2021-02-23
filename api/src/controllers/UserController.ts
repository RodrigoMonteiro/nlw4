import { request, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { User } from '../models/User'

class UserController {

    async create(req: Request, res: Response) {
        const { name, email } = req.body
        const usersRepository = getRepository(User)
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if (userAlreadyExists) {
            return res.status(400).json({
                error: "User already exists!"
            })
        }
        // É necessário criar o user, pegando os dados do body para  salvar a instância de usuário
        const user = usersRepository.create({
            name, email
        })

        await usersRepository.save(user)

        return res.send(user)
    }

}

export { UserController }