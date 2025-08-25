import { UserRoleEnum } from 'generated/prisma';
import z from 'zod';

const Address = z.object({
  number: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  neighborhood: z.string().trim(),
  complement: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  street: z.string().trim(),
});

const Responsible = z.object({
  mother: z.string().trim(),
  father: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
});

const CreateMemberSchema = z.object({
  name: z.string().trim(),
  cpf: z.string().trim(),
  rg: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  birthDate: z.string().trim(),
  extras: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  role: z.enum(Object.values(UserRoleEnum)),
  address: Address,
  responsible: Responsible,
});

export default CreateMemberSchema;
