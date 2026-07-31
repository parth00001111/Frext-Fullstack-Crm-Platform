export type Role = "Admin" | "Sales" | "Manager";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ICustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  assignedTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DealStage = "Lead" | "Qualified" | "Proposal" | "Won" | "Lost";

export interface IDeal {
  _id: string;
  title: string;
  value: number;
  stage: DealStage;
  customerId: string;
  assignedTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = "Pending" | "Completed";

export interface ITask {
  _id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  customerId: string;
  assignedTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INote {
  _id: string;
  content: string;
  entityType: "Customer" | "Deal" | "Task";
  entityId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IActivity {
  _id: string;
  userId: { _id: string; name: string } | string;
  action: string;
  entityType: "Customer" | "Deal" | "Task" | "Note";
  entityId: string;
  createdAt?: string;
}

export interface IDashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalDeals: number;
  totalTasks: number;
  wonDeals: number;
  lostDeals: number;
  pendingTask: number;
  completedTask: number;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  value?: T;
}
