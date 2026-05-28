export type ActionType = "transform" | "filter" | "enrich" | "webhook-forward";

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  sourceUrl: string;
  actionType: ActionType;
  actionConfig: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePipelineDto {
  name: string;
  description: string;
  actionType: ActionType;
  actionConfig?: Record<string, any>;
  isActive: boolean;
  subscribersIds?: Array<string>;
}

export interface UpdatePipelineDto {
  name?: string;
  description?: string;
  actionType?: ActionType;
  actionConfig?: Record<string, any>;
  isActive?: boolean;
}
