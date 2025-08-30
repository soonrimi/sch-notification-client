// scripts/patch-openapi-axios.js
// OpenAPI에서 axios 인스턴스를 config/axios.ts의 것으로 교체하는 자동 패치 스크립트

const fs = require('fs');
const path = require('path');

const openapiRequestPath = path.join(__dirname, '../src/api/core/request.ts');

const customAxiosImportLine = "import axios from '@/config/axios';";
const axiosReplaceRegex = /import axios from 'axios';/;

function patchOpenAPIRequest() {
  if (!fs.existsSync(openapiRequestPath)) {
    console.error('request.ts not found:', openapiRequestPath);
    return;
  }
  let content = fs.readFileSync(openapiRequestPath, 'utf8');

  // axios import 교체
  content = content.replace(axiosReplaceRegex, customAxiosImportLine);

  fs.writeFileSync(openapiRequestPath, content, 'utf8');
  console.log('✅ Patched OpenAPI request.ts to use config/axios.ts instance');
}

patchOpenAPIRequest();
