export type ActionType = "transform" | "filter" | "enrich" | "webhook-forward";

export interface Pipeline {
  id: string;
  name: string;
  sourceUrl: string;
  actionType: ActionType;
  actionConfig: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePipelineDto {
  name: string;
  actionType: ActionType;
  actionConfig?: Record<string, any>;
  subscribers?: Array<{
    url: string;
    method?: string;
    headers?: Record<string, string>;
  }>;
}

export interface UpdatePipelineDto {
  name?: string;
  actionType?: ActionType;
  actionConfig?: Record<string, any>;
  isActive?: boolean;
}
