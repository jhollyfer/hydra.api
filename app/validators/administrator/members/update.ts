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
  neighborhood: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  complement: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  street: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
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

// Só pede nome, RG, data de nascimento e filiação.

const UpdateMemberSchema = z.object({
  name: z.string().trim(),
  cpf: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value;
    }),
  rg: z.string().trim(),
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
  address: Address.nullable().transform((value) => {
    if (!value) return null;
    return value;
  }),
  responsible: Responsible,
});

export default UpdateMemberSchema;
