# 🐍 Python Services - Parallel Execution Guide

Complete guide for running Python services in parallel for optimal performance and real-time crypto data processing.

## 🎯 Service Architecture

### Core Services Overview
```
┌─────────────────────────────────────────────────────────────┐
│                  PYTHON SERVICES ECOSYSTEM                  │
├─────────────────┬───────────────────┬───────────────────────┤
│  Data Collection│   Data Processing │    Machine Learning   │
│                 │                   │                       │
│ • Market Data   │ • ETL Pipeline    │ • Model Training      │
│ • News Feeds    │ • Data Cleaning   │ • Predictions         │
│ • Technical     │ • Feature Eng.    │ • Risk Analysis       │
│   Indicators    │ • Validation      │ • Sentiment Analysis  │
└─────────────────┴───────────────────┴───────────────────────┘
```

## 📋 Service Details

### 1. Data Collector (`lib/coingecko_fetcher.py`)
**Purpose**: Real-time market data collection
```python
# Functionality
✅ Fetches live crypto prices from CoinGecko API
✅ Collects data for 50+ cryptocurrencies  
✅ Stores raw data in MinIO
✅ Handles API rate limits and retries
✅ Runs every 5 minutes

# Resource Usage
- Memory: ~100MB
- CPU: Low (I/O bound)
- Network: High (API calls)
```

### 2. Data Pipeline (`lib/data_pipeline.py`)
**Purpose**: ETL processing and data cleaning
```python
# Functionality  
✅ Processes raw API data
✅ Cleans and validates data quality
✅ Creates feature vectors for ML
✅ Generates aggregated datasets
✅ Runs hourly

# Resource Usage
- Memory: ~500MB-1GB
- CPU: Medium-High (data processing)
- Storage: High (MinIO operations)
```

### 3. ML Training (`lib/continuous-training.py`)
**Purpose**: Continuous model improvement
```python
# Functionality
✅ Updates LSTM models with new data
✅ Performs model validation
✅ Stores model artifacts in MinIO
✅ Monitors model performance
✅ Runs every 30 minutes

# Resource Usage
- Memory: ~1-2GB
- CPU: High (model training)
- GPU: Optional (if available)
```

### 4. Forecasting Service (`lib/real-time-forecasting.py`)
**Purpose**: Real-time price predictions
```python
# Functionality
✅ Generates price forecasts
✅ Calculates confidence intervals
✅ Provides API endpoints for predictions
✅ Serves real-time requests
✅ Runs on-demand

# Resource Usage
- Memory: ~300-500MB  
- CPU: Medium (inference)
- Latency: <2 seconds
```

### 5. Candle Service (`start_candle_service.py`)
**Purpose**: Technical analysis and indicators
```python
# Functionality
✅ Generates OHLCV candlestick data
✅ Calculates technical indicators (RSI, MACD, etc.)
✅ Provides trading signals
✅ Historical data analysis
✅ Runs daily

# Resource Usage
- Memory: ~200-400MB
- CPU: Medium (calculations)
- Storage: Medium (historical data)
```

---

## 🚀 Running Services in Parallel

### Method 1: PM2 Process Manager (Recommended)

#### Install PM2
```bash
npm install -g pm2
```

#### Start All Services
```bash
# Start all services with ecosystem config
pm2 start ecosystem.config.js

# Start individual services
pm2 start ecosystem.config.js --only crypto-data-collector
pm2 start ecosystem.config.js --only crypto-data-pipeline
pm2 start ecosystem.config.js --only crypto-ml-training
pm2 start ecosystem.config.js --only crypto-forecasting
pm2 start ecosystem.config.js --only crypto-candle-service
```

#### Monitor Services
```bash
# Real-time monitoring dashboard
pm2 monit

# Check status
pm2 status

# View logs
pm2 logs crypto-data-collector
pm2 logs --lines 100

# Restart service
pm2 restart crypto-ml-training

# Stop all
pm2 stop all
```

### Method 2: Individual Terminals

#### Terminal 1: Data Collection
```bash
cd crypto-dashboard
source venv/bin/activate
python lib/coingecko_fetcher.py
```

#### Terminal 2: Data Processing
```bash
cd crypto-dashboard
source venv/bin/activate
python run_data_pipeline.py
```

#### Terminal 3: ML Training
```bash
cd crypto-dashboard
source venv/bin/activate
python lib/continuous-training.py
```

#### Terminal 4: Forecasting
```bash
cd crypto-dashboard
source venv/bin/activate
python lib/real-time-forecasting.py
```

#### Terminal 5: Technical Analysis
```bash
cd crypto-dashboard
source venv/bin/activate
python start_candle_service.py
```

### Method 3: Background Processes (Linux/Mac)

```bash
# Start all services in background
cd crypto-dashboard
source venv/bin/activate

python lib/coingecko_fetcher.py &
echo $! > pids/data-collector.pid

python run_data_pipeline.py &
echo $! > pids/data-pipeline.pid

python lib/continuous-training.py &
echo $! > pids/ml-training.pid

python lib/real-time-forecasting.py &
echo $! > pids/forecasting.pid

python start_candle_service.py &
echo $! > pids/candle-service.pid

# Check running services
ps aux | grep python

# Stop all services
for pid in $(cat pids/*.pid); do kill $pid; done
```

### Method 4: Docker Compose (Advanced)

```yaml
# docker-compose.services.yml
version: '3.8'
services:
  data-collector:
    build: .
    command: python lib/coingecko_fetcher.py
    environment:
      - PYTHONPATH=.
    volumes:
      - ./logs:/app/logs
    restart: always

  data-pipeline:
    build: .
    command: python run_data_pipeline.py
    environment:
      - PYTHONPATH=.
    volumes:
      - ./logs:/app/logs
    restart: always

  ml-training:
    build: .
    command: python lib/continuous-training.py
    environment:
      - PYTHONPATH=.
    volumes:
      - ./logs:/app/logs
    restart: always

  forecasting:
    build: .
    command: python lib/real-time-forecasting.py
    environment:
      - PYTHONPATH=.
    volumes:
      - ./logs:/app/logs
    restart: always

  candle-service:
    build: .
    command: python start_candle_service.py
    environment:
      - PYTHONPATH=.
    volumes:
      - ./logs:/app/logs
    restart: always
```

```bash
# Start with Docker
docker-compose -f docker-compose.services.yml up -d

# Monitor logs
docker-compose -f docker-compose.services.yml logs -f

# Stop services
docker-compose -f docker-compose.services.yml down
```

---

## 📊 Service Orchestration

### Dependency Chain
```
1. MinIO Running ← (Required for all services)
2. Data Collector ← (Provides raw data)
3. Data Pipeline ← (Depends on collected data)
4. ML Training ← (Depends on processed data)
5. Forecasting ← (Depends on trained models)
6. Candle Service ← (Independent, can run parallel)
```

### Execution Schedule
```python
# Recommended execution intervals
SERVICES = {
    'data_collector': '*/5 * * * *',    # Every 5 minutes
    'data_pipeline': '0 * * * *',       # Every hour
    'ml_training': '*/30 * * * *',      # Every 30 minutes  
    'forecasting': 'on_demand',         # API requests
    'candle_service': '0 0 * * *'       # Daily at midnight
}
```

### Resource Requirements
```bash
# Minimum system requirements for parallel execution
CPU: 4+ cores
RAM: 8GB+ 
Storage: 20GB+ free space
Network: Stable internet connection

# Recommended for optimal performance
CPU: 8+ cores
RAM: 16GB+
Storage: 50GB+ SSD
Network: High-speed broadband
```

---

## 🔧 Configuration & Optimization

### Environment Variables
```bash
# Required for all services
export MINIO_ENDPOINT=localhost:9000
export MINIO_ACCESS_KEY=minioadmin
export MINIO_SECRET_KEY=minioadmin
export MINIO_USE_SSL=false
export MINIO_BUCKET=crypto-data

# Optional optimizations
export PYTHONUNBUFFERED=1
export OMP_NUM_THREADS=4
export CUDA_VISIBLE_DEVICES=0  # If using GPU
```

### Performance Tuning
```python
# Memory optimization
import gc
gc.collect()  # Force garbage collection

# CPU optimization  
import os
os.environ['OMP_NUM_THREADS'] = '4'

# I/O optimization
import multiprocessing
WORKER_PROCESSES = multiprocessing.cpu_count()
```

### Logging Configuration
```python
# Enhanced logging for production
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/service.log'),
        logging.StreamHandler()
    ]
)
```

---

## 📈 Monitoring & Health Checks

### Service Health Endpoints
```python
# Health check URLs (when services expose HTTP)
data_collector_health = "http://localhost:5001/health"
data_pipeline_health = "http://localhost:5002/health"
ml_training_health = "http://localhost:5003/health"
forecasting_health = "http://localhost:5004/health"
candle_service_health = "http://localhost:5005/health"
```

### Monitoring Commands
```bash
# PM2 monitoring
pm2 monit              # Real-time dashboard
pm2 status             # Service status
pm2 logs --lines 50    # Recent logs

# System monitoring
htop                   # CPU and memory usage
df -h                  # Disk usage  
netstat -tulpn         # Port usage
```

### Alert Configuration
```bash
# Set up alerts for service failures
pm2 install pm2-logrotate
pm2 install pm2-server-monit

# Configure email alerts
pm2 set pm2-server-monit:monitor true
pm2 set pm2-server-monit:port 8888
```

---

## 🔄 Service Management Scripts

### Start All Services
```bash
#!/bin/bash
# scripts/start-services.sh
echo "Starting crypto dashboard Python services..."

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    pm2 start ecosystem.config.js
    echo "✅ All services started with PM2"
else
    echo "⚠️ PM2 not found, starting services individually..."
    
    # Create logs directory
    mkdir -p logs
    
    # Start services in background
    python lib/coingecko_fetcher.py > logs/data-collector.log 2>&1 &
    echo $! > pids/data-collector.pid
    
    python run_data_pipeline.py > logs/data-pipeline.log 2>&1 &
    echo $! > pids/data-pipeline.pid
    
    python lib/continuous-training.py > logs/ml-training.log 2>&1 &
    echo $! > pids/ml-training.pid
    
    python lib/real-time-forecasting.py > logs/forecasting.log 2>&1 &
    echo $! > pids/forecasting.pid
    
    python start_candle_service.py > logs/candle-service.log 2>&1 &
    echo $! > pids/candle-service.pid
    
    echo "✅ All services started in background"
fi

echo "🎉 Python services are now running in parallel!"
```

### Stop All Services
```bash
#!/bin/bash
# scripts/stop-services.sh
echo "Stopping crypto dashboard Python services..."

if command -v pm2 &> /dev/null; then
    pm2 stop ecosystem.config.js
    echo "✅ All PM2 services stopped"
else
    # Stop background processes
    for pid_file in pids/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            kill $pid 2>/dev/null && echo "Stopped process $pid"
            rm "$pid_file"
        fi
    done
    echo "✅ All background services stopped"
fi
```

---

## 🎯 Quick Commands Reference

```bash
# Start everything
pm2 start ecosystem.config.js

# Monitor all services
pm2 monit

# Check status
pm2 status

# View specific service logs
pm2 logs crypto-data-collector

# Restart a service
pm2 restart crypto-ml-training

# Stop all services
pm2 stop all

# Delete all services
pm2 delete all

# Save current PM2 configuration
pm2 save

# Resurrect saved configuration on reboot
pm2 startup
```

**🐍 Your Python services are now optimized for parallel execution with comprehensive monitoring and management! 🚀**