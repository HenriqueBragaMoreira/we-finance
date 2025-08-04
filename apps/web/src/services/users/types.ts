export type GetUsersProps = {
  init?: string;
  limit?: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
};

export type GetUsersResponse = {
  data: GetUsersResponseDataField[];
  total: number;
};

export type GetUsersResponseDataField = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
};
