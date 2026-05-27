export type Method = "POST" | "GET" | "UPDATE" | "DELETE" | "PATCH";

export interface Subscriber {
  id: string;
  url: string;
  method: Method;
  headers: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriberDto {
  url: string;
  method?: Method;
  headers?: Record<string, any>;
}

export interface UpdateSubscriberDto {
  url?: string;
  method?: Method;
  headers?: Record<string, any>;
}
