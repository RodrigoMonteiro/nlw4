import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { AppError } from '../errors/AppError';

class AnswerController {
    async execute(req: Request, res: Response) {
        const { value } = req.params
        const { u } = req.query

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            // Forçar o valor de u ser uma string, visto que o u pode ser undefined
            id: String(u)
        })
        if (!surveyUser) {
            throw new AppError("Survey User does not exists!")
           
        }

        surveyUser.value = Number(value)

        await surveysUsersRepository.save(surveyUser)

        return res.status(200).json(surveyUser)
    }
} export { AnswerController }