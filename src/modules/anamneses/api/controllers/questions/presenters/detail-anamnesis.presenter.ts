import { DetailAnamnesisOutput } from '@/anamneses/application/usecases/detail-anamnesis.usecase';

export class DetailAnamnesisPresenter {
  static toHTTP(data: DetailAnamnesisOutput) {
    const { anamnesis, questions } = data;

    const answersMap = new Map(
      anamnesis.answers.map((answer) => [answer.question.id, answer]),
    );

    return {
      id: anamnesis.id,
      client: {
        id: anamnesis.client.id,
        name: anamnesis.client.name,
      },
      questions: questions.map((question) => ({
        id: question.id,
        title: question.text,
        type: question.type,
        options: question.options,
        order: question.order,
        answers: answersMap.get(question.id)
          ? {
              id: answersMap.get(question.id).id,
              value: answersMap.get(question.id).answer,
            }
          : null,
      })),
    };
  }
}
