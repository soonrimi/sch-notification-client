const fs = require('fs');
const path = require('path');

const openApiPath = path.join(__dirname, '../src/api/core/OpenAPI.ts');

fs.readFile(openApiPath, 'utf8', (err, data) => {
  if (err) throw err;
  const newData = data.replace(
    /BASE: 'http:\/\/notification\.iubns\.net'/,
    "BASE: 'https://notification.iubns.net'"
  );
  fs.writeFile(openApiPath, newData, 'utf8', (err) => {
    if (err) throw err;
    console.log('OpenAPI 업데이트 완료');
  });
});
