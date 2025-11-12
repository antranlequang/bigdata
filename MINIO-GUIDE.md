# 🗄️ MinIO Integration Guide

Complete guide for connecting and managing MinIO data storage for your crypto dashboard.

## 🎯 Quick Setup

### Option 1: Use Pre-configured MinIO (Fastest)
```bash
# Already configured in vercel.json - No setup needed!
✅ Server: play.min.io
✅ Credentials: Built-in
✅ Bucket: crypto-data
✅ Works immediately
```

### Option 2: Local MinIO (Development)
```bash
# Start with Docker
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"

# Access console: http://localhost:9001
```

### Option 3: Cloud MinIO (Production)
```bash
# Sign up at min.io
# Get your credentials
# Update environment variables
```

---

## 🔧 Connection Configuration

### Environment Variables
```bash
# Local development (.env.local)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET=crypto-data

# Production (Vercel environment)
MINIO_ENDPOINT=play.min.io
MINIO_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F
MINIO_SECRET_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG
MINIO_USE_SSL=true
MINIO_BUCKET=crypto-data
```

### Test Connection
```python
# Test MinIO connection
python -c "
from lib.minio_client import VercelMinIOClient
client = VercelMinIOClient()
print('✅ MinIO connection successful!')
print('Buckets:', client.list_objects())
"
```

---

## 📁 Data Organization

### Bucket Structure
```
crypto-data/
├── raw/                     # Raw API data
│   ├── coingecko/          # Market data from CoinGecko
│   │   ├── bitcoin/        # Per-coin raw data
│   │   └── ethereum/
│   └── news/               # News articles
│       ├── cointelegraph/
│       └── cryptonews/
├── processed/              # Cleaned & transformed data
│   ├── prices/             # Price time series
│   │   ├── bitcoin_2024.csv
│   │   └── ethereum_2024.csv
│   ├── ohlcv/              # Candlestick data
│   │   ├── bitcoin_daily.csv
│   │   └── bitcoin_hourly.csv
│   └── features/           # ML feature vectors
├── models/                 # ML artifacts
│   ├── lstm_models/        # Trained models
│   │   ├── bitcoin_model_v1.h5
│   │   └── ethereum_model_v1.h5
│   ├── scalers/            # Data normalizers
│   │   ├── bitcoin_scaler.pkl
│   │   └── price_scaler.pkl
│   └── metadata/           # Model information
│       ├── model_config.json
│       └── performance_metrics.json
└── forecasts/              # Prediction outputs
    ├── daily/              # Daily forecasts
    │   └── bitcoin_forecast_20241112.json
    └── realtime/           # Real-time predictions
        └── latest_predictions.json
```

---

## 💻 MinIO Operations

### Python API Usage
```python
from lib.minio_client import VercelMinIOClient

# Initialize client
client = VercelMinIOClient()

# Upload DataFrame
import pandas as pd
df = pd.DataFrame({'price': [50000, 51000], 'timestamp': ['2024-01-01', '2024-01-02']})
client.upload_dataframe(df, 'processed/prices/bitcoin_test.csv')

# Download DataFrame
df_downloaded = client.download_dataframe('processed/prices/bitcoin_test.csv')
print(df_downloaded.head())

# Upload JSON data
metadata = {'model': 'LSTM', 'version': '1.0', 'accuracy': 0.95}
client.upload_json(metadata, 'models/metadata/bitcoin_model_info.json')

# Download JSON data
metadata_downloaded = client.download_json('models/metadata/bitcoin_model_info.json')
print(metadata_downloaded)

# List files in directory
files = client.list_objects('processed/prices/')
print('Available files:', files)

# Get downloadable URL
url = client.get_object_url('processed/prices/bitcoin_test.csv')
print('Download URL:', url)

# Backup data with timestamp
backup_path = client.backup_processed_data(df, 'bitcoin')
print('Backup stored at:', backup_path)
```

### Advanced Operations
```python
# Store ML model artifacts
client.store_model_artifacts(
    model_path='models/bitcoin_model.h5',
    scaler_path='models/bitcoin_scaler.pkl',
    metadata={
        'coin': 'bitcoin',
        'model_type': 'LSTM',
        'training_date': '2024-11-12',
        'accuracy': 0.92,
        'features': ['price', 'volume', 'market_cap']
    }
)

# Get latest processed data
latest_bitcoin_data = client.get_latest_processed_data('bitcoin')
if latest_bitcoin_data is not None:
    print(f"Latest data shape: {latest_bitcoin_data.shape}")

# Delete old files (cleanup)
old_files = client.list_objects('backups/bitcoin/')
for file in old_files[:-5]:  # Keep only last 5 backups
    client.delete_object(file)
```

---

## 🌐 Web Console Management

### Accessing MinIO Console

#### Local Development
```bash
# Console URL: http://localhost:9001
# Username: minioadmin
# Password: minioadmin

# Available features:
✅ File browser and upload
✅ Bucket management
✅ User access control
✅ Monitoring dashboard
✅ Object versioning
```

#### Cloud MinIO
```bash
# Console URL: https://console.min.io
# Use your cloud credentials

# Additional features:
✅ Global replication
✅ Advanced analytics
✅ Enterprise security
✅ SLA monitoring
```

### Browser Operations
1. **Upload Files**: Drag & drop in console
2. **Download Files**: Click download button
3. **Create Buckets**: Use bucket management
4. **Set Permissions**: Configure access policies
5. **Monitor Usage**: View storage and bandwidth

---

## 🔒 Security & Access Control

### IAM Policies
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::crypto-data/*"
    }
  ]
}
```

### Access Keys Management
```bash
# Create read-only access key
mc admin user add myminio readonly-user readonly-password
mc admin policy set myminio readonly user=readonly-user

# Create write access key  
mc admin user add myminio write-user write-password
mc admin policy set myminio readwrite user=write-user

# List users
mc admin user list myminio
```

### Encryption
```python
# Client-side encryption (optional)
from cryptography.fernet import Fernet

# Generate key
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt before upload
data = "sensitive crypto data"
encrypted_data = cipher.encrypt(data.encode())

# Upload encrypted data
client.client.put_object(
    bucket_name='crypto-data',
    object_name='encrypted/sensitive_data.enc',
    data=io.BytesIO(encrypted_data),
    length=len(encrypted_data)
)
```

---

## 📊 Monitoring & Performance

### Health Checks
```python
def check_minio_health():
    try:
        client = VercelMinIOClient()
        # Test basic operations
        test_data = pd.DataFrame({'test': [1, 2, 3]})
        client.upload_dataframe(test_data, 'health/test.csv')
        downloaded = client.download_dataframe('health/test.csv')
        client.delete_object('health/test.csv')
        
        return {
            'status': 'healthy',
            'upload': True,
            'download': True,
            'delete': True
        }
    except Exception as e:
        return {
            'status': 'unhealthy',
            'error': str(e)
        }

# Run health check
health = check_minio_health()
print(health)
```

### Performance Monitoring
```python
import time

def benchmark_minio():
    client = VercelMinIOClient()
    
    # Upload benchmark
    start_time = time.time()
    test_df = pd.DataFrame({'data': range(10000)})
    client.upload_dataframe(test_df, 'benchmark/upload_test.csv')
    upload_time = time.time() - start_time
    
    # Download benchmark
    start_time = time.time()
    downloaded_df = client.download_dataframe('benchmark/upload_test.csv')
    download_time = time.time() - start_time
    
    # Clean up
    client.delete_object('benchmark/upload_test.csv')
    
    return {
        'upload_time_seconds': upload_time,
        'download_time_seconds': download_time,
        'data_size_rows': len(test_df)
    }

# Run benchmark
benchmark = benchmark_minio()
print(benchmark)
```

---

## 🔧 Troubleshooting

### Common Issues

#### Connection Failed
```bash
# Check MinIO server status
curl http://localhost:9000/minio/health/live

# Test with MC client
mc alias set local http://localhost:9000 minioadmin minioadmin
mc ls local

# Check environment variables
echo $MINIO_ENDPOINT
echo $MINIO_ACCESS_KEY
```

#### Upload/Download Errors
```python
# Debug connection
import logging
logging.basicConfig(level=logging.DEBUG)

# Test with verbose output
client = VercelMinIOClient()
try:
    client.ensure_bucket_exists()
    print("✅ Bucket accessible")
except Exception as e:
    print(f"❌ Bucket error: {e}")
```

#### Slow Performance
```bash
# Check network latency
ping play.min.io

# Monitor bandwidth
# Use network monitoring tools

# Optimize uploads
# Use multipart uploads for large files
```

#### Authentication Issues
```bash
# Verify credentials
mc admin info myminio

# Check IAM policies
mc admin policy list myminio

# Reset credentials (if using local)
docker restart minio
```

### Debug Commands
```bash
# List all objects
python -c "
from lib.minio_client import VercelMinIOClient
client = VercelMinIOClient()
print(client.list_objects())
"

# Check bucket policy
mc policy get local/crypto-data

# Monitor real-time operations
mc events local/crypto-data

# Storage usage stats
mc admin info local
```

---

## 🎯 Best Practices

### Data Management
- **Organize by type**: Separate raw, processed, and model data
- **Use timestamps**: Include dates in filenames for versioning
- **Clean up regularly**: Remove old backups and temporary files
- **Validate uploads**: Always verify data integrity after upload

### Performance Optimization
- **Batch operations**: Upload/download multiple files together
- **Compress data**: Use efficient formats (Parquet, compressed JSON)
- **Cache frequently accessed data**: Keep hot data easily accessible
- **Monitor usage**: Track storage and bandwidth consumption

### Security
- **Rotate access keys**: Change credentials regularly
- **Use least privilege**: Grant minimal required permissions
- **Encrypt sensitive data**: Use client-side encryption for sensitive info
- **Audit access**: Monitor who accesses what data

### Cost Optimization
- **Lifecycle policies**: Automatically transition old data to cheaper storage
- **Data deduplication**: Avoid storing duplicate datasets
- **Compression**: Reduce storage costs with efficient compression
- **Monitor billing**: Track usage to avoid unexpected costs

---

## 🚀 Integration Examples

### With Data Pipeline
```python
def process_and_store_data():
    # Fetch raw data
    client = VercelMinIOClient()
    raw_data = client.download_dataframe('raw/coingecko/bitcoin_latest.csv')
    
    # Process data
    processed_data = clean_and_transform(raw_data)
    
    # Store processed data
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    client.upload_dataframe(
        processed_data, 
        f'processed/prices/bitcoin_{timestamp}.csv'
    )
    
    return f"Processed {len(processed_data)} records"
```

### With ML Training
```python
def train_and_save_model():
    client = VercelMinIOClient()
    
    # Load training data
    training_data = client.download_dataframe('processed/features/bitcoin_features.csv')
    
    # Train model
    model = train_lstm_model(training_data)
    
    # Save model artifacts
    model.save('temp_model.h5')
    joblib.dump(scaler, 'temp_scaler.pkl')
    
    # Upload to MinIO
    success = client.store_model_artifacts(
        model_path='temp_model.h5',
        scaler_path='temp_scaler.pkl',
        metadata={
            'coin': 'bitcoin',
            'accuracy': model.evaluate(),
            'training_samples': len(training_data)
        }
    )
    
    # Clean up local files
    os.remove('temp_model.h5')
    os.remove('temp_scaler.pkl')
    
    return success
```

**🗄️ Your MinIO integration is now complete and optimized for crypto data management! 🚀**