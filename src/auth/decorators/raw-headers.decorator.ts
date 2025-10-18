import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const RawHeaders = createParamDecorator(
  (data, context: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return request.rawHeaders;
  },
);
