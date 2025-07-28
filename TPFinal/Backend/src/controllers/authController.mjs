import * as authService from "../services/authService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

export const login = catchAsync(async (req, res) => {
  const { email, contrasena } = req.body;

  const loginData = await authService.loginUser({ email, contrasena });

  res.status(200).json({
    message: "Autenticación exitosa",
    token: loginData.token,
    usuarioId: loginData.usuarioId,
  });
});

export const validateToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  const usuarioId = await authService.validateToken(token);

  res.status(200).json({
    message: "Token válido",
    usuarioId,
  });
});
