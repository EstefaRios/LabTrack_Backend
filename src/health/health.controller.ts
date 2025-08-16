import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicRateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@ApiTags('Health')
@Controller('health')
@UseGuards(RateLimitGuard)
@PublicRateLimit()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check básico del sistema' })
  ping() {
    return {
      ok: true,
      api: 'LabTrack API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('detailed')
  @ApiOperation({
    summary: 'Health check detallado con información del sistema',
  })
  detailed() {
    const memoryUsage = process.memoryUsage();
    return {
      ok: true,
      api: 'LabTrack API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      },
      platform: process.platform,
      nodeVersion: process.version,
    };
  }
}
