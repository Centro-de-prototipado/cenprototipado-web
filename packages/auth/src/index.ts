// @cen/auth — cuenta única del Centro de Prototipado y la Red STEAM (Supabase Auth).
// Cada app monta <CuentaProvider config={…}> y usa los formularios de cuenta.
// Las páginas que usan formularios con parámetros de URL deben envolverse en <Suspense>.
export { CuentaProvider, useConfigCuenta, type ConfigCuenta } from "./config"
export {
  obtenerCliente,
  useSupabase,
  destinoSeguro,
  urlConSesion,
  mensajeError,
} from "./cliente"
export { useSesion } from "./ui/use-sesion"
export { BotonCuenta } from "./ui/boton-cuenta"
export { FormIngresar } from "./ui/form-ingresar"
export { FormRegistro } from "./ui/form-registro"
export { FormRecuperar } from "./ui/form-recuperar"
export { FormRestablecer } from "./ui/form-restablecer"
export { Continuar } from "./ui/continuar"
export { MiCuenta } from "./ui/mi-cuenta"
export {
  Aviso,
  Campo,
  BotonPrincipal,
  BotonSecundario,
  PanelCuenta,
} from "./ui/formulario"
export { MarcoDividido } from "./ui/marco-dividido"
