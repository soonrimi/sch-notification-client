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

const requestPath = path.join(__dirname, '../src/api/core/request.ts');

fs.readFile(requestPath, 'utf8', (err, data) => {
  if (err) throw err;

  let newData = data;

  // 1. axiosInstance import 추가 (중복 방지)
  if (!newData.includes("import axiosInstance from '@/axiosInstance';")) {
    newData = newData.replace(
      /^(\/\*.*?\*\/\s*)?import axios from 'axios';/s,
      (match) =>
        `${match}\nimport axiosInstance from '@/axiosInstance'; // [patched]\n`
    );
  }

  // 2. request 함수 기본값 axiosInstance로 변경
  newData = newData.replace(
    /(export const request = <T>\(config: OpenAPIConfig, options: ApiRequestOptions, axiosClient: AxiosInstance = )(axios)(\): CancelablePromise<T> => {)/,
    '$1axiosInstance$3 // [patched]'
  );

  fs.writeFile(requestPath, newData, 'utf8', (err) => {
    if (err) throw err;
    // console.log('request.ts axiosInstance 패치 완료');
  });
});
