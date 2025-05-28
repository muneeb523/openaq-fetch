

# 🌍 DGM10 Local Sensor Integration with OpenAQ Fetch

## ✅ Purpose

This project integrates a **DGM10 air quality sensor** (or similar) with the [OpenAQ Fetch System](https://github.com/openaq/openaq-fetch). The sensor exposes data locally in JSON format at a URL (e.g., `http://192.168.0.196:8080/data.json`), and this integration makes the data compatible with OpenAQ's global air quality data platform.

OpenAQ is an open-source platform that aggregates air quality data from government, research-grade, and now **community-driven sensors** like yours.

---

## ⚙️ System Requirements

* Node.js ≥ 16.x
* Git
* Internet (for initial setup)
* Local DGM10-compatible sensor exposing JSON data
* Linux/macOS/WSL (recommended for easier CLI)

---

## 📦 Installation

1. **Clone OpenAQ Fetch repo:**

   ```bash
   git clone https://github.com/openaq/openaq-fetch.git
   cd openaq-fetch
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Navigate to the `src/adapters/` directory and add your custom adapter**
   (see below for code)

4. **Register your sensor as a source in the `sources/` directory**
   (see below for configuration)

---

## 🧠 Architecture & Flow

```
┌────────────────────────────────────────────┐
│       Your Sensor (DGM10 or similar)       │
│  └── Serves JSON at http://192.168.0.196 ──┘
│                                            │
└──────────────┬─────────────────────────────┘
               ▼
        Custom Adapter (dgm10-local.js)
               ▼
         Transforms to OpenAQ format
               ▼
          openaq-fetch Framework
               ▼
       CLI output / optional push to DB/S3
```

---

## 🧩 Adapter Implementation

📁 `src/adapters/dgm10-local.js`

This adapter fetches sensor JSON and returns OpenAQ-compatible measurement objects.

> Supports gas types, temperature, and humidity in OpenAQ format.

🔧 View full code here: [Click to view code you implemented](#).

---

## 📁 Source File Configuration

📁 `sources/in.json`
(Add this object inside the array)

```json
{
  "name": "DGM10 Local Sensor",
  "adapter": "dgm10-local",
  "sourceURL": "http://192.168.0.196:8080/data.json",
  "url": "http://192.168.0.196:8080/data.json",
  "country": "IN",
  "city": "Delhi",
  "location": "My Home Sensor",
  "description": "Custom air quality sensor exposing JSON data from DGM10",
  "contacts": ["your-email@example.com"],
  "active": true,
  "type": "other",
  "license": "CC BY 4.0",
  "licenseURL": "https://creativecommons.org/licenses/by/4.0/",
  "mobile": false,
  "coordinates": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

---

## 🧪 Running the Adapter

Use the CLI to test:

```bash
node scripts/cli.js --adapter dgm10-local
```

Expected Output (sample):

```json
{
  "name": "dgm10-local",
  "measurements": [
    {
      "parameter": "h2se",
      "value": 3.21,
      ...
    },
    {
      "parameter": "o3",
      "value": 0.12,
      ...
    }
  ]
}
```

---

## 🌐 Environment Configuration

As per `env.md`, the following environment variables are available:

| Variable                | Purpose                            |
| ----------------------- | ---------------------------------- |
| `API_URL`               | Webhook to send data externally    |
| `WEBHOOK_KEY`           | Authentication for webhook         |
| `SAVE_TO_S3`            | Enable S3 save (if true or `1`)    |
| `AWS_BUCKET_NAME`       | S3 bucket for raw storage          |
| `PSQL_*`                | PostgreSQL config if pushing to DB |
| `STRICT`                | Enable strict failure on errors    |
| `LOG_LEVEL`             | Controls verbosity                 |
| `MAX_PARALLEL_ADAPTERS` | Performance tuning                 |

---

## 🧰 Useful CLI Commands

* Dry run and debug:

  ```bash
  node scripts/cli.js --adapter dgm10-local --dryrun --debug
  ```

* Only run specific source:

  ```bash
  node scripts/cli.js --source 'DGM10 Local Sensor'
  ```

---

## 🚀 Optional Deployment Paths

### A. **Local Scheduled Runs (Cron Job)**

```bash
crontab -e
```

```bash
*/15 * * * * cd /path/to/openaq-fetch && node scripts/cli.js --adapter dgm10-local >> logs/output.log
```

### B. **Push to Webhook or Cloud API**

Set `API_URL` and `WEBHOOK_KEY` in environment, modify adapter to POST JSON using `request-promise`.

### C. **Public Integration**

* Fork OpenAQ repo
* Add your adapter and source
* Open Pull Request (PR)
* Follow OpenAQ contribution guide

---

## 🔮 Future Improvements

* Push data to cloud backend (Firebase, MongoDB, InfluxDB)
* Visualize with Grafana, Home Assistant, or Node-RED
* Add retry logic for network failures
* Add sensor calibration offsets
* Map unsupported gas types to standard OpenAQ ones

---

## 🤝 Contributions & Acknowledgements

Special thanks to the OpenAQ open-source maintainers for enabling global community monitoring.

