import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from '@/domain/auth/guards/skip-auth';
import { Resource } from '@/shared/decorators/resource.decorator';
import { MenuService } from '@/domain/menu/menu.service';

@SkipAuth()
@Resource({
  name: 'menus_manage',
  identify: 'menus:manage',
})
@Controller({
  path: 'menus',
  version: 'menus',
})
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async findMany() {
    return;
  }
}
