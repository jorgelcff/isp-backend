import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LlmService {
  private readonly llmUrl: string =
    'https://api.openai.com/v1/chat/completions';
  private readonly apiKey: string = process.env.OPENAI_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async queryLlm(prompt: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        this.llmUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return response.data.choices[0].message.content;
  }
}
