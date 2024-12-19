export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export interface Task {
  createdAt: number,
  createdBy: string,
  description: string,
  duration: number,
  homeId: string,
  id: string,
  name: string,
  priority: Priority,
  startingAt: number,
  updatedAt: number,
}
