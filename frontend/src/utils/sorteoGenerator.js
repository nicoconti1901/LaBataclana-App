export const sorteoGenerator = {
  generarCodigo(length = 8) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let codigo = ''
    for (let i = 0; i < length; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return codigo
  },

  generarNumeroSorteo(min = 1, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  generarCodigoReserva() {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = this.generarCodigo(4)
    return `${timestamp}-${random}`
  },
}
