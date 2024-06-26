import bcrypt from 'bcryptjs';
import { User } from '~/server/models/User.model';
import type { ApiResponse } from '~/server/types/apiresponse.interface';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const config = useRuntimeConfig();
  try {
    const name = body.name;
    const email = body.email;
    const password = body.password;

    if (name === '') throw new Error('name harus di isi');
    if (password === '') throw new Error('password harus di isi');

    const cekMail = await User.findOne({ email });
    if (cekMail) throw new Error('email already exist');

    const salt = bcrypt.genSaltSync(config.saltRounds);
    const passwordHas = await bcrypt.hashSync(password, salt);

    const res = await User.create({
      name,
      email,
      password: passwordHas,
    });

    return { data: res, message: 'user hasbeen saved' } as ApiResponse<
      [],
      string
    >;
  } catch (error) {
    return error as ApiResponse<[], string>;
  }
});
