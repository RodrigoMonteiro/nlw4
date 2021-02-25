import { request, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'

class UserController {

    async create(req: Request, res: Response) {
        const { name, email } = req.body
        const usersRepository = getCustomRepository(UsersRepository)
        
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

        return res.status(201).send(user)
    }

}

export { UserController }