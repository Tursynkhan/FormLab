// src/comments/comments.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway()
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private commentsService: CommentsService) {}

  @SubscribeMessage('newComment')
  async handleNewComment(@MessageBody() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create(createCommentDto);

    this.server.emit('commentAdded', comment);
    return comment;
  }
}
