import { ListQuestions } from '@/anamneses/application/usecases/list-questions.usecase';
import { Controller, Get, Inject } from '@nestjs/common';

@Controller('client/anamnesis/questions')
export class ClientAnamnesisQuestionsController {
  @Inject(ListQuestions)
  private readonly listQuestionsUseCase: ListQuestions;

  @Get()
  async list() {
    const questions = await this.listQuestionsUseCase.execute();

    return questions;
  }
}
