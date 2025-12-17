export interface QuoteRequestPayload {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
}

export interface EstimateRequestPayload {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  timeline?: string;
  budget?: string;
  description: string;
  emergencyService: boolean;
}
