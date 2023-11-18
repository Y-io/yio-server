import { Controller, Get } from '@nestjs/common';
import { SkipAuthDecorator } from '@/shared/decorators/skip-auth.decorator';
import { Resource } from '@/shared/decorators/resource.decorator';
import { MenuService } from '@/domain/menu/menu.service';

@SkipAuthDecorator()
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
