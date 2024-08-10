export interface IntegrationLifecycle {
  onFormInitiated?(formId: string, userId: string): Promise<{ success: boolean }>;
  onFormResponse(formResponse: FormResponse): Promise<{ success: boolean }>;
  onFormResponseCompleted?(formResponse: FormResponse): Promise<{ success: boolean }>;
  onFormResponseUpdated?(formResponse: FormResponse): Promise<{ success: boolean }>;
  onFormResponseReset?(formResponse: FormResponse): Promise<{ success: boolean }>;
  onFormResponseRemoved?(formResponse: FormResponse): Promise<{ success: boolean }>;
}


export abstract class BaseIntegration implements IntegrationLifecycle {
    abstract onFormResponse(formResponse: FormResponse): Promise<{ success: boolean }>;
  
    async onFormInitiated?(formId: string, userId: string): Promise<{ success: boolean }> {
      console.log('Default onFormInitiated implementation');
      return { success: true };
    }
  
    async onFormResponseCompleted?(formResponse: FormResponse): Promise<{ success: boolean }> {
      console.log('Default onFormResponseCompleted implementation');
      return { success: true };
    }
  
    async onFormResponseUpdated?(formResponse: FormResponse): Promise<{ success: boolean }> {
      console.log('Default onFormResponseUpdated implementation');
      return { success: true };
    }
  
    async onFormResponseReset?(formResponse: FormResponse): Promise<{ success: boolean }> {
      console.log('Default onFormResponseReset implementation');
      return { success: true };
    }
  
    async onFormResponseRemoved?(formResponse: FormResponse): Promise<{ success: boolean }> {
      console.log('Default onFormResponseRemoved implementation');
      return { success: true };
    }
  }
  