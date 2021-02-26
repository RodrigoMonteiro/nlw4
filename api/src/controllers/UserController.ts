import { request, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'


// Usaremos o yup para validações de dados
class UserController {

    async create(req: Request, res: Response) {
        const { name, email } = req.body
        const schema = yup.object().shape({

            name: yup.string().required("Nome é obrigatório!"),
            email: yup.string().email().required("E-mail é obrigatório!")
        })


        try {
            await schema.isValid(req.body, { abortEarly: false })

        } catch (err) {
            throw new AppError(err)
        }


        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if (userAlreadyExists) {
            throw new AppError("User already exists!")
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