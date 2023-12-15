import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { ActionLogger, Resource } from '../../common/decorators';
import { CreateMenuDto } from './dto/create-menu.dto';

@Resource({
  name: 'menus_manage',
  identify: 'menus:manage',
})
@Controller({
  path: 'menus',
  version: '1',
})
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async findMenus(@Query('id') id: string) {
    return this.menuService.findMany(id);
  }

  @Post()
  async createMenu(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Delete(':id')
  @ActionLogger({
    template: '<%= username %> 删除了菜单 <%= username %>',
    keys: ['username', ''],
  })
  async deleteMenu(@Param('id') id: string) {
    await this.menuService.deleteById(id);
    return 'ok';
  }
}
