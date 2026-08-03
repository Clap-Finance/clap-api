import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns the service health status. This endpoint is public.' })
  @ApiResponse({ status: 200, description: 'Service is healthy', schema: { example: { status: 'ok', timestamp: '2024-01-01T00:00:00.000Z' } } })
  async check() {
    return this.healthService.check();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check', description: 'Checks if the service is ready to serve requests, including database connectivity. This endpoint is public.' })
  @ApiResponse({ status: 200, description: 'Readiness check result', schema: { example: { status: 'ready', database: 'connected', timestamp: '2024-01-01T00:00:00.000Z' } } })
  async ready() {
    return this.healthService.ready();
  }
}
