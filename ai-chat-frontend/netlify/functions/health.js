// Health check endpoint для мониторинга
exports.handler = async (event, context) => {
  const startTime = Date.now();
  
  try {
    // Проверка основных компонентов
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.VITE_APP_ENV || 'unknown',
      uptime: process.uptime ? Math.floor(process.uptime()) : null,
      memory: process.memoryUsage ? process.memoryUsage() : null,
      checks: {
        api: await checkApiHealth(),
        database: 'not_implemented', // TODO: добавить проверку БД
        redis: 'not_implemented'     // TODO: добавить проверку Redis
      }
    };

    const responseTime = Date.now() - startTime;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`
      },
      body: JSON.stringify({
        ...checks,
        responseTime: `${responseTime}ms`
      }, null, 2)
    };
    
  } catch (error) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error.message,
        responseTime: `${Date.now() - startTime}ms`
      }, null, 2)
    };
  }
};

// Проверка доступности API
async function checkApiHealth() {
  const apiUrl = process.env.VITE_API_URL;
  
  if (!apiUrl) {
    return 'not_configured';
  }
  
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    return response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    return 'unhealthy';
  }
}