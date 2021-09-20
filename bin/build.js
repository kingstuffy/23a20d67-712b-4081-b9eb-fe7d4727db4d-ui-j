const fs = require('fs');
require('dotenv').config();

const pathToLocalFile = 'application/js/local.js';

const localContent = `
const BASE_API_URL = '${process.env.BASE_API_URL}';
const DEFAULT_PRODUCT_SLUG = '${process.env.DEFAULT_PRODUCT_SLUG}';
`;

fs.writeFileSync(pathToLocalFile, localContent);
