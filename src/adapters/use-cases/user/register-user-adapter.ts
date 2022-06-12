import * as user from '@/core/use-cases/user/register-user'
import { User } from '@/core/types/user'

export const registerUser: user.RegisterUser = (outsideRegister) => (data) =>
  user.registerUser(outsideRegister)(data)

export type OutsideRegisterUser = user.OutsideRegisterUser<{user: User}>
