export interface IRoom {
  roomId: string;
  roomName: string;
  roomStatus: boolean;
  department: IDepartment;
}

export interface IDepartment {
  departmentId: string;
  departmentName: string;
}
