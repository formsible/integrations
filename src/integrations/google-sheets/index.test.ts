import { google, sheets_v4 } from 'googleapis';
import { GoogleDriveIntegration, FormResponse } from './index';

// Mock the Google Sheets API
jest.mock('googleapis', () => {
  const sheets = {
    spreadsheets: {
      values: {
        append: jest.fn().mockResolvedValue({}),
      },
    },
  };
  return { google: { sheets: jest.fn(() => sheets) } };
});

describe('GoogleDriveIntegration', () => {
  let integration: GoogleDriveIntegration;
  let formResponse: FormResponse;
  let appendMock: jest.Mock;

  beforeEach(() => {
    integration = new GoogleDriveIntegration();
    formResponse = {
      formId: 'testFormId',
      userId: 'testUserId',
      timestamp: new Date(),
      values: { field1: 'value1', field2: 'value2' }
    };
    
    // Get the mock function for append
    const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: '' });
    appendMock = sheets.spreadsheets.values.append as jest.Mock;
  });

  it('should append form response to Google Sheets', async () => {
    await integration.onFormResponse(formResponse);

    expect(appendMock).toHaveBeenCalledWith({
      spreadsheetId: expect.any(String),
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['value1', 'value2']]
      },
    });
  });

  it('should handle different configurations', async () => {
    const config = {
      apiKey: 'testApiKey',
      spreadsheetId: 'testSpreadsheetId',
      sheetName: 'CustomSheet',
      valueInputOption: 'USER_ENTERED',
    };

    // Override the config
    jest.mock('./config.json', () => config, { virtual: true });

    await integration.onFormResponse(formResponse);

    expect(appendMock).toHaveBeenCalledWith({
      spreadsheetId: 'testSpreadsheetId',
      range: 'CustomSheet!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['value1', 'value2']]
      },
    });
  });

  it('should return success on successful form response handling', async () => {
    const result = await integration.onFormResponse(formResponse);
    expect(result).toEqual({ success: true });
  });

  it('should log error and return failure if Google Sheets API fails', async () => {
    // Mock API to throw an error
    appendMock.mockRejectedValueOnce(new Error('Google Sheets API error'));

    await expect(integration.onFormResponse(formResponse)).rejects.toThrow('Google Sheets API error');
  });
});
