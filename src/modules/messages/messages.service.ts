import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/modules/messages/dto/create-messages.dto';
import { MessagesRepository } from 'src/modules/messages/messages.repository';

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async createMessage(
    createMessagesDto: CreateMessageDto,
    username: string,
    senderIp: string,
  ) {
    const message = await this.messagesRepository.create(
      createMessagesDto,
      username,
      senderIp,
    );
    return message;
  }

  async getMessagesUser(username: string) {
    const messages = await this.messagesRepository.findByUsername(username);
    return messages;
  }

  async deleteMessage(id: string, userId: string) {
    const existingMessage = await this.messagesRepository.findOne(id);
    if (!existingMessage)
      throw new NotFoundException(["Message id doesn't exist in the database"]);

    if (existingMessage.user.id !== userId) throw new ForbiddenException();

    const deletedMessage = await this.messagesRepository.delete(id);
    return deletedMessage;
  }
}
