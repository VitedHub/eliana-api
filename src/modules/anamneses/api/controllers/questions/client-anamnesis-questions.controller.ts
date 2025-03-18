import { ListQuestions } from '@/anamneses/application/usecases/list-questions.usecase';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RegisterAnamnesisAnswerDto } from './dto/register-anamnesis-answer.dto';
import { RegisterAnamnesisAnswer } from '@/anamneses/application/usecases/register-anamnesis-answer.usecase';

@Controller('client/anamnesis')
export class ClientAnamnesisQuestionsController {
  @Inject(ListQuestions)
  private readonly listQuestionsUseCase: ListQuestions;
  @Inject(RegisterAnamnesisAnswer)
  private readonly registerAnamnesisAnswer: RegisterAnamnesisAnswer;

  @Post('answers')
  async registerAnswers(@Body() body: RegisterAnamnesisAnswerDto) {
    const result = await this.registerAnamnesisAnswer.execute({
      anamnesisId: body.anamnesisId,
      answers: body.answers,
    });

    return result;
  }

  @Get('questions')
  async list() {
    const result = await this.listQuestionsUseCase.execute();

    return result;
  }
}
