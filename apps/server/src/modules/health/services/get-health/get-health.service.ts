import { Injectable } from '@nestjs/common';
import type { Health } from '@flowdesk/schemas';

@Injectable()
export class GetHealthService {
  execute(): Health {
    return { status: 'ok' };
  }
}
