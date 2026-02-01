import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PublicAccess } from 'src/common/decorators/public-access.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateMessageDto } from 'src/modules/messages/dto/create-messages.dto';
import { MessagesService } from 'src/modules/messages/messages.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post(':username')
  @PublicAccess()
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Param('username') username: string,
    @Ip() senderIp: string,
  ) {
    const message = await this.messagesService.createMessage(
      createMessageDto,
      username,
      senderIp,
    );
    return {
      statusCode: 201,
      message: 'Message sent successfully',
      data: message,
    };
  }

  @Get(':username')
  @PublicAccess()
  async listMessagesUser(@Param('username') username: string) {
    const messages = await this.messagesService.getMessagesUser(username);
    return {
      statusCode: 200,
      message: 'Fetched messages successfuly',
      data: messages,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMessage(@Param('id') messageId: string, @Req() req: Request) {
    const userId = req.user?.sub;

    if (!userId)
      throw new ForbiddenException(['Access denied, unauthorization']);

    const deletedMessage = await this.messagesService.deleteMessage(
      messageId,
      userId,
    );

    return {
      statusCode: 200,
      message: 'Message has been deleted',
      data: deletedMessage,
    };
  }
}
