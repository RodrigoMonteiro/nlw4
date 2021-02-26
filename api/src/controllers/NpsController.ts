import { getCustomRepository, Not, IsNull } from 'typeorm';
import { Request, Response } from 'express'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

// Observação importante sobre o cálculo do Nps...

// Notas entre => 0 - 6 = Detratores
// Notas entre => 7 - 8 = Passivos (Não vão entrar no cálculo)
// Notas entre => 9 - 10 = Promotores 

class NpsController {

    async execute(req: Request, res: Response) {
        const { survey_id } = req.params
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractors = surveysUsers.filter(survey => {
            (survey.value >= 0 && survey.value >= 6)
        }).length

        const promotors = surveysUsers.filter(survey => {
            (survey.value >= 9)
        }).length
        
        
        const passives = surveysUsers.filter(survey => {
            (survey.value > 6 && survey.value < 9)
        }).length
const totalAnswers = surveysUsers.length
const calculate = Number((((promotors - detractors) /totalAnswers) *100).toFixed(2))

return res.json({
    detractors,  promotors, passives, totalAnswers, nps: calculate

})
    }
} export { NpsController }