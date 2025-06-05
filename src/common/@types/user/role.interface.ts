export interface IRole {
  id: string; // Unique identifier for the role
  name: string; // Name of the role, e.g., 'Admin', 'User'
  description?: string; // Optional description of the role
  permissions: string[]; // List of permissions associated with the role
  createdAt: Date; // Timestamp when the role was created
  updatedAt: Date; // Timestamp when the role was last updated
  isActive: boolean; // Indicates if the role is currently active
}

export interface IRoleResponse {
  roles: IRole[]; // Array of roles
  totalCount: number; // Total number of roles available
  page: number; // Current page number
  pageSize: number; // Number of roles per page
}
