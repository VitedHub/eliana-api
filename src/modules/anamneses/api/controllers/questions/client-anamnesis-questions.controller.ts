import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { RegisterAnamnesisAnswerDto } from './dto/register-anamnesis-answer.dto';
import { RegisterAnamnesisAnswer } from '@/anamneses/application/usecases/register-anamnesis-answer.usecase';
import { DetailAnamnesis } from '@/anamneses/application/usecases/detail-anamnesis.usecase';
import { DetailAnamnesisPresenter } from './presenters/detail-anamnesis.presenter';

@Controller('client/anamnesis')
export class ClientAnamnesisQuestionsController {
  @Inject(RegisterAnamnesisAnswer)
  private readonly registerAnamnesisAnswerUseCase: RegisterAnamnesisAnswer;
  @Inject(DetailAnamnesis)
  private readonly detailAnamnesisUseCase: DetailAnamnesis;

  @Post('answers')
  async registerAnswers(@Body() body: RegisterAnamnesisAnswerDto) {
    const result = await this.registerAnamnesisAnswerUseCase.execute({
      anamnesisId: body.anamnesisId,
      answers: body.answers,
    });

    return result;
  }

  @Get(':anamnesisId')
  async detailAnamnesis(@Param('anamnesisId') anamnesisId: string) {
    const result = await this.detailAnamnesisUseCase.execute({ anamnesisId });

    return DetailAnamnesisPresenter.toHTTP(result);
  }
}
