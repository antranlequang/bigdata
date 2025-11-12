# 🚀 Crypto Dashboard - Complete Local & Cloud Platform

A comprehensive cryptocurrency analytics platform with real-time data collection, ML forecasting, and interactive visualization. Built with Next.js, Python, and MinIO for scalable data storage.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Python Services (Parallel Execution)](#python-services-parallel-execution)
4. [Running the Platform Locally](#running-the-platform-locally)
5. [MinIO Data Storage](#minio-data-storage)
6. [Features](#features)
7. [Architecture](#architecture)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This platform provides:
- **Real-time cryptocurrency price tracking** for 50+ coins
- **Advanced ML forecasting** using LSTM models
- **Technical analysis** with candlestick charts and indicators
- **News sentiment analysis** from multiple sources
- **Interactive dashboard** with responsive charts
- **Scalable data pipeline** with PySpark ETL
- **Cloud-ready deployment** for Vercel

---

## 🛠️ Local Development Setup

### Prerequisites

```bash
# Required software
- Node.js 18+ 
- Python 3.9+
- Git

# Optional (for advanced features)
- Docker (for MinIO)
- Java 8+ (for PySpark)
```

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard

# Install Node.js dependencies
npm install

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

**Required Environment Variables:**
```bash
# MinIO Configuration (Local or Cloud)
MINIO_ENDPOINT=localhost:9000          # or your-minio-server.com
MINIO_ACCESS_KEY=minioadmin           # your access key
MINIO_SECRET_KEY=minioadmin           # your secret key
MINIO_USE_SSL=false                   # true for cloud MinIO
MINIO_BUCKET=crypto-data

# API Keys (Optional but recommended)
COINGECKO_API_KEY=your-api-key
```

### 3. MinIO Setup (Choose One Option)

#### Option A: Docker MinIO (Recommended for Local)
```bash
# Start MinIO with Docker
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"

# Access MinIO Console: http://localhost:9001
# Login: minioadmin / minioadmin
```

#### Option B: Local MinIO Binary
```bash
# Download and run MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /tmp/minio-data --console-address ":9001"
```

#### Option C: Cloud MinIO (Production)
```bash
# Sign up at min.io and get your credentials
# Update .env.local with cloud credentials
MINIO_ENDPOINT=your-minio-instance.min.io
MINIO_USE_SSL=true
```

---

## 🐍 Python Services (Parallel Execution)

The platform runs multiple Python services in parallel for optimal performance:

### Core Services

| Service | File | Function | Schedule | Purpose |
|---------|------|----------|----------|---------|
| **Data Collector** | `lib/coingecko_fetcher.py` | Fetch market data | Every 5 minutes | Real-time price updates |
| **Data Pipeline** | `lib/data_pipeline.py` | ETL processing | Every hour | Clean and process data |
| **ML Training** | `lib/continuous-training.py` | Update models | Every 30 minutes | Improve predictions |
| **Forecasting** | `lib/real-time-forecasting.py` | Generate predictions | On-demand | Price forecasting |
| **Candle Service** | `start_candle_service.py` | Technical analysis | Daily | OHLCV data and indicators |

### Running Services in Parallel

#### Method 1: Individual Services
```bash
# Terminal 1: Data Collection
python lib/coingecko_fetcher.py

# Terminal 2: Data Processing  
python run_data_pipeline.py

# Terminal 3: ML Training
python lib/continuous-training.py

# Terminal 4: Forecasting Service
python lib/real-time-forecasting.py

# Terminal 5: Candle Service
python start_candle_service.py
```

#### Method 2: Background Services (Linux/Mac)
```bash
# Start all services in background
python lib/coingecko_fetcher.py &
python run_data_pipeline.py &
python lib/continuous-training.py &
python lib/real-time-forecasting.py &
python start_candle_service.py &

# Check running services
ps aux | grep python
```

#### Method 3: Process Manager (Recommended)
```bash
# Install pm2 for Node.js
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'data-collector',
      script: 'python',
      args: 'lib/coingecko_fetcher.py',
      interpreter: 'python'
    },
    {
      name: 'data-pipeline', 
      script: 'python',
      args: 'run_data_pipeline.py',
      interpreter: 'python'
    },
    {
      name: 'ml-training',
      script: 'python', 
      args: 'lib/continuous-training.py',
      interpreter: 'python'
    },
    {
      name: 'forecasting',
      script: 'python',
      args: 'lib/real-time-forecasting.py', 
      interpreter: 'python'
    },
    {
      name: 'candle-service',
      script: 'python',
      args: 'start_candle_service.py',
      interpreter: 'python'
    }
  ]
}
EOF

# Start all services
pm2 start ecosystem.config.js

# Monitor services
pm2 monit
```

---

## 🏃‍♂️ Running the Platform Locally

### Quick Start (Minimum Setup)

```bash
# 1. Start MinIO (choose your preferred method above)
docker run -d --name minio -p 9000:9000 -p 9001:9001 minio/minio server /data

# 2. Start the Next.js development server
npm run dev

# 3. Start basic data collection
python lib/coingecko_fetcher.py

# 4. Open browser
open http://localhost:3000
```

### Full Production Setup

```bash
# 1. Start all Python services
pm2 start ecosystem.config.js

# 2. Build and start Next.js
npm run build
npm start

# 3. Verify services
pm2 status
curl http://localhost:3000/api/health
```

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Test MinIO connection
npm run test:minio

# Test data pipeline
npm run test:pipeline

# Git validation
npm run git:validate
```

---

## 🗄️ MinIO Data Storage

### Data Organization

```
crypto-data/
├── raw/                     # Raw API data
│   ├── coingecko/          # CoinGecko API responses
│   └── news/               # News articles
├── processed/              # Cleaned data
│   ├── prices/             # Price time series
│   ├── ohlcv/              # Candlestick data
│   └── features/           # ML features
├── models/                 # ML model artifacts
│   ├── lstm_models/        # LSTM model files
│   ├── scalers/            # Data normalizers
│   └── metadata/           # Model metadata
└── forecasts/              # Prediction outputs
    ├── daily/              # Daily forecasts
    └── realtime/           # Real-time predictions
```

### MinIO Operations

```python
# Connect to MinIO
from lib.minio_client import VercelMinIOClient
client = VercelMinIOClient()

# Upload data
client.upload_dataframe(df, 'processed/prices/bitcoin_2024.csv')

# Download data
df = client.download_dataframe('processed/prices/bitcoin_2024.csv')

# List files
files = client.list_objects('processed/prices/')

# Get download URL
url = client.get_object_url('processed/prices/bitcoin_2024.csv')
```

### MinIO Web Console

```bash
# Access at: http://localhost:9001
# Default credentials: minioadmin / minioadmin

# Features available:
- File browser and upload
- Bucket management  
- Access control
- Monitoring and metrics
```

---

## ✨ Features

### Real-Time Dashboard
- **Live price tracking** for 50+ cryptocurrencies
- **Interactive charts** with zoom and pan
- **Market cap treemap** visualization
- **Technical indicators** (RSI, MACD, Bollinger Bands)
- **News sentiment** analysis with AI

### Advanced Analytics
- **LSTM price forecasting** with confidence intervals
- **Portfolio tracking** and performance analysis
- **Risk analysis** and volatility metrics
- **Correlation analysis** between assets
- **Market trend detection**

### Data Processing
- **Automated data collection** from CoinGecko
- **Real-time ETL pipeline** with PySpark
- **Data validation** and quality checks
- **Scalable storage** with MinIO
- **Historical data** management

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    CRYPTO DASHBOARD                         │
├─────────────────┬───────────────────┬───────────────────────┤
│   Frontend      │    Backend APIs   │    Python Services   │
│   (Next.js)     │   (TypeScript)    │     (Python)         │
│                 │                   │                       │
│ • Dashboard UI  │ • REST APIs       │ • Data Collection     │
│ • Charts        │ • WebSocket       │ • ML Training         │
│ • User Interface│ • Authentication  │ • Forecasting         │
└─────────────────┴───────────────────┴───────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MinIO STORAGE                            │
│  • Object Storage    • Data Lake    • Model Repository     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Collection**: Python services fetch data from APIs
2. **Processing**: ETL pipeline cleans and transforms data
3. **Storage**: Processed data stored in MinIO buckets
4. **Analysis**: ML models analyze data and generate predictions
5. **Visualization**: Frontend fetches data and displays charts
6. **Real-time**: WebSocket updates for live data streams

---

## 📡 API Documentation

### Core Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/health` | GET | System health check | None |
| `/api/coins` | GET | Available cryptocurrencies | None |
| `/api/crypto` | GET | Crypto data from MinIO | `coinId` |
| `/api/forecast` | GET | Price predictions | `coinId`, `source` |
| `/api/news-analysis` | GET | News sentiment | `days` |
| `/api/candle-chart` | GET | OHLCV data | `coinId`, `action` |

### Usage Examples

```javascript
// Get Bitcoin price data
const response = await fetch('/api/crypto?coinId=bitcoin');
const data = await response.json();

// Get price forecast
const forecast = await fetch('/api/forecast?coinId=bitcoin&source=minio');
const predictions = await forecast.json();

// Get news sentiment
const news = await fetch('/api/news-analysis?days=3');
const sentiment = await news.json();
```

---

## 🔧 Troubleshooting

### Common Issues

#### MinIO Connection Failed
```bash
# Check MinIO is running
curl http://localhost:9000/minio/health/live

# Test Python connection
python -c "from lib.minio_client import VercelMinIOClient; VercelMinIOClient()"

# Check credentials
cat .env.local | grep MINIO
```

#### Python Services Not Starting
```bash
# Check Python virtual environment
which python
pip list | grep -E "(flask|minio|pandas)"

# Check for port conflicts
netstat -an | grep :5000

# Check logs
tail -f *.log
```

#### Data Not Loading
```bash
# Check data collection
python lib/coingecko_fetcher.py

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/crypto?coinId=bitcoin

# Check MinIO data
python -c "
from lib.minio_client import VercelMinIOClient
client = VercelMinIOClient()
print(client.list_objects('processed/'))
"
```

#### Build Errors
```bash
# Clear caches
rm -rf .next node_modules
npm install
npm run build

# Fix import paths
npm run prebuild

# Check TypeScript errors
npx tsc --noEmit
```

### Performance Optimization

```bash
# Monitor Python processes
htop | grep python

# Check Node.js performance
npm run build -- --analyze

# MinIO performance
mc admin info myminio

# Database optimization
python lib/data_pipeline.py --optimize
```

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Logs**: Check `*.log` files in the root directory
- **Health Checks**: Use `/api/health` endpoint
- **Debug Mode**: Set `DEBUG=true` in environment
- **Community**: Open GitHub issues for bugs/features

---

## 🎯 Quick Reference

### Essential Commands
```bash
# Start everything
docker run -d --name minio -p 9000:9000 minio/minio server /data
pm2 start ecosystem.config.js
npm run dev

# Stop everything  
pm2 stop all
docker stop minio
```

### Key Files
- `package.json` - Node.js dependencies and scripts
- `.env.local` - Environment configuration
- `lib/` - Python services and utilities
- `app/` - Next.js application code
- `components/` - React components

### Monitoring URLs
- **Dashboard**: http://localhost:3000
- **MinIO Console**: http://localhost:9001  
- **API Health**: http://localhost:3000/api/health

---

**🎉 Your crypto dashboard is now ready! Start with the Quick Start guide above and explore the advanced features as you get familiar with the platform.**