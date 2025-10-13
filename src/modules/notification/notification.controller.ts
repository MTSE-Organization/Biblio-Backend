import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { NotificationDto } from './dtos';
import { FilterNotificationForm } from './forms';
import { ApiListResponse } from '@/common/decorators';

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
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('count-unread')
  async countUnRead(@Req() req) {
    const count = await this.notificationService.countUnRead(req.user.id);
    console.log({ count });

    return {
      data: { count },
      message: 'Get count un read successfully'
    };
  }
}
