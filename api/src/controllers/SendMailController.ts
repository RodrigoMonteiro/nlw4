import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import sendMailService from '../services/sendMailService';
import { resolve } from 'path'
import { AppError } from '../errors/AppError';
class SendMailController {

    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        

        const userAlreadyExists = await usersRepository.findOne({ email })
        if (!userAlreadyExists) {
           throw new AppError("User does not exists!")
        }

        const surveysAlreadyExists = await surveysRepository.findOne({ id: survey_id })
        if (!surveysAlreadyExists) {
            throw new AppError("Survey does not exists!") 

        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")


        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{ user_id: userAlreadyExists.id, value: null }],
            relations: ["user", "survey"]
        })

        const variables = {
            name: userAlreadyExists.name,
            title: surveysAlreadyExists.title,
            description: surveysAlreadyExists.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await sendMailService.execute(email, surveysAlreadyExists.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists)
        }

        // Salvar as informações na tabela
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser)
        variables.id = surveyUser.id


        //Enviar um email para o usuário
        await sendMailService.execute(email, surveysAlreadyExists.title, variables, npsPath)

        return res.json(surveyUser)




    }
}
export { SendMailController }