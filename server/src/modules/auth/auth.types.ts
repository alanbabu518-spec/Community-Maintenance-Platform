export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  unitId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}