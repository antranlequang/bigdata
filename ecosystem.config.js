module.exports = {
  apps: [
    {
      name: 'crypto-data-collector',
      script: 'python',
      args: 'lib/coingecko_fetcher.py',
      interpreter: 'python',
      cwd: './crypto-dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PYTHONPATH: '.'
      },
      env_production: {
        NODE_ENV: 'production',
        PYTHONPATH: '.'
      },
      error_file: './logs/data-collector-error.log',
      out_file: './logs/data-collector-out.log',
      log_file: './logs/data-collector-combined.log',
      time: true
    },
    {
      name: 'crypto-data-pipeline', 
      script: 'python',
      args: 'run_data_pipeline.py',
      interpreter: 'python',
      cwd: './crypto-dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'development',
        PYTHONPATH: '.'
      },
      env_production: {
        NODE_ENV: 'production',
        PYTHONPATH: '.'
      },
      error_file: './logs/data-pipeline-error.log',
      out_file: './logs/data-pipeline-out.log',
      log_file: './logs/data-pipeline-combined.log',
      time: true
    },
    {
      name: 'crypto-ml-training',
      script: 'python', 
      args: 'lib/continuous-training.py',
      interpreter: 'python',
      cwd: './crypto-dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'development',
        PYTHONPATH: '.'
      },
      env_production: {
        NODE_ENV: 'production',
        PYTHONPATH: '.'
      },
      error_file: './logs/ml-training-error.log',
      out_file: './logs/ml-training-out.log',
      log_file: './logs/ml-training-combined.log',
      time: true
    },
    {
      name: 'crypto-forecasting',
      script: 'python',
      args: 'lib/real-time-forecasting.py',
      interpreter: 'python', 
      cwd: './crypto-dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PYTHONPATH: '.'
      },
      env_production: {
        NODE_ENV: 'production',
        PYTHONPATH: '.'
      },
      error_file: './logs/forecasting-error.log',
      out_file: './logs/forecasting-out.log',
      log_file: './logs/forecasting-combined.log',
      time: true
    },
    {
      name: 'crypto-candle-service',
      script: 'python',
      args: 'start_candle_service.py',
      interpreter: 'python',
      cwd: './crypto-dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PYTHONPATH: '.'
      },
      env_production: {
        NODE_ENV: 'production',
        PYTHONPATH: '.'
      },
      error_file: './logs/candle-service-error.log',
      out_file: './logs/candle-service-out.log',
      log_file: './logs/candle-service-combined.log',
      time: true
    }
  ]
}