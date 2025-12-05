import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { CreateServiceAreaDto } from './dto/create-service-area.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { API_PREFIX } from '../app.controller';
@Controller(`${API_PREFIX}/service-areas`)
export class ServiceAreaController {
  constructor(private readonly serviceAreaService: ServiceAreaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createServiceAreaDto: CreateServiceAreaDto) {
    return this.serviceAreaService.create(createServiceAreaDto);
  }

  @Get()
  findAll() {
    return this.serviceAreaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceAreaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateServiceAreaDto: UpdateServiceAreaDto,
  ) {
    return this.serviceAreaService.update(id, updateServiceAreaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.serviceAreaService.remove(id);
  }
}
