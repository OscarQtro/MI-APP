// Script para crear usuario Ernesto
const { testUsuarios } = require('./crear-usuario-personalizado');

async function ejecutar() {
  try {
    console.log('🚀 Creando usuario Ernesto...');
    const resultado = await testUsuarios.crearErnesto();
    
    if (resultado.success) {
      console.log('\n✅ USUARIO CREADO EXITOSAMENTE:');
      console.log('📧 Email:', resultado.email);
      console.log('🔑 Password:', resultado.password);
      console.log('👤 Nombre:', resultado.nombre);
      console.log('\n🎯 AHORA PUEDES PROBAR:');
      console.log('1. Ve a la pantalla de login');
      console.log('2. Usa:', resultado.email, '/', resultado.password);
      console.log('3. Después del login verás: "Hola,', resultado.nombre + '"');
    } else {
      console.log('❌ Error:', resultado.error);
    }
  } catch (error) {
    console.error('❌ Error ejecutando:', error.message);
  }
}

ejecutar();