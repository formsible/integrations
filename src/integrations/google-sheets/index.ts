import { google, sheets_v4 } from 'googleapis';
import Ajv, { JSONSchemaType } from 'ajv';
import configSchema from './config.schema.json';


interface Config {
  apiKey: string;
  spreadsheetId: string;
  sheetName?: string;
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}

const ajv = new Ajv();
const validateConfig = ajv.compile<Config>(configSchema as JSONSchemaType<Config>);

const config: Config = require('./config.json');

// Validate configuration
if (!validateConfig(config)) {
  console.error('Invalid configuration:', validateConfig.errors);
  process.exit(1);
}


export class GoogleDriveIntegration extends BaseIntegration {
  async onFormResponse(formResponse: FormResponse): Promise<{ success: boolean }> {
    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: config.apiKey });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${config.sheetName || 'Sheet1'}!A1`,
      valueInputOption: config.valueInputOption || 'RAW',
      requestBody: {
        values: [Object.values(formResponse.values)]
      }
    });
    
    console.log(`Form ${formResponse.formId} response saved to Google Sheets.`);
    return { success: true };
  }
}