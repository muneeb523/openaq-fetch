const path = require('path');
const fs = require('fs');
console.log("✅ fetch/index.js started");

// Proper CLI argument parsing function
function parseSourceArg() {
  const args = process.argv;
  console.log("🔍 Full process.argv:", args);  // LOG ADDED

  const sourceIndex = args.indexOf('--source');
  if (sourceIndex === -1 || sourceIndex + 1 >= args.length) {
    console.error('❌ Missing --source argument');
    process.exit(1);
  }
  const parsedName = args.slice(sourceIndex + 1).join(' ');
  console.log("🔍 Parsed source name:", parsedName);  // LOG ADDED
  return parsedName;
}

module.exports.run = function () {
  const sourcesPath = path.join(__dirname, '..', 'src', 'sources', 'za.json');
  console.log(`📂 Loading sources file from: ${sourcesPath}`);  // LOG ADDED

  const sourcesContent = fs.readFileSync(sourcesPath);
  console.log("📄 Raw sources file content loaded.");  // LOG ADDED

  const sources = JSON.parse(sourcesContent);
  console.log("✅ Parsed sources JSON successfully.");  // LOG ADDED

  const sourceName = parseSourceArg();
  console.log(`🔎 Looking for source: "${sourceName}"`);

  const source = sources.find(s => s.name === sourceName);
  if (!source) {
    console.error('❌ Source not found.');
    console.log("📝 Available sources:", sources.map(s => s.name));
    return;
  }

  console.log('✅ Source found. Running adapter...');
  console.log("🔧 Adapter name:", source.adapter);

  const adapterPath = path.join(__dirname, '..', 'src', 'adapters', `${source.adapter}.js`);
  console.log("📂 Loading adapter from:", adapterPath);  // LOG ADDED

  const adapter = require(adapterPath);

  adapter.fetchStream(source).then(result => {
    console.log("✅ Adapter executed successfully.");  // LOG ADDED
    if (result.measurements && result.measurements.length > 0) {
      result.measurements.forEach(measurement => {
        console.log(JSON.stringify(measurement, null, 2));
      });
    } else {
      console.log('⚠ No measurements returned.');
    }
  }).catch(err => {
    console.error('❌ Adapter execution failed:', err);
  });
};
