import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { NotificationDto } from './dtos';
import { FilterNotificationForm } from './forms';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData
} from '@/common/decorators';
import { CountNotificationDto } from '@/modules/notification/dtos/notification-count.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiListResponse(NotificationDto, { objectName: 'notification' })
  // @PCode('GR_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Req() req, @Query() form: FilterNotificationForm) {
    form.accountId = req.user.id;
    const { notifications, count } = await this.notificationService.list(form);
    const response: ResponseListDto<NotificationDto[]> = {
      content: MapperUtil.toDtoList(notifications, NotificationDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  // @PCode('GR_L')
  @ApiResponse(CountNotificationDto, {
    message: 'Count notification successfully',
    objectName: 'notification'
  })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('count-unread')
  async countUnRead(@Req() req) {
    const count = await this.notificationService.countUnRead(req.user.id);

    return {
      data: { count },
      message: 'Get count unread successfully'
    };
  }

  @ApiResponseNoData({ message: 'Mark read notification successfully' })
  @UseGuards(JwtAuthGuard)
  @Put('mark-read/:id')
  async markRead(@Param('id') id: bigint) {
    await this.notificationService.markRead(id);
    return { message: 'Mark read notification successfully' };
  }

  @ApiResponseNoData({ message: 'Mark all notifications as read successfully' })
  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllRead(@Req() req) {
    await this.notificationService.markAllRead(req.user.id);
    return { message: 'Mark all notifications as read successfully' };
  }

  @Put('delete-all')
  @UseGuards(JwtAuthGuard)
  @ApiResponseNoData({ message: 'Delete all notifications successfully' })
  async deleteAll(@Req() req) {
    return await this.notificationService.deleteAllByAccountId(req.user.id);
  }
}
