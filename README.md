**GRUPO 1 - TRABAJO N°3**
--
1. Capra, Valentina
2. Gardiner, Ariadna
3. Kalpin, Sofia
4. Ransan, Magali


**DESCRIPCIÓN:**
Esta aplicación de productividad permite a los usuarios gestionar sus tareas de forma eficiente. Ofrece funcionalidades para crear, editar y eliminar tareas, asignarles prioridad y estado, y filtrarlas según estos criterios. Las tareas se almacenan localmente para asegurar su persistencia. Además, la app se conecta con una API para obtener sugerencias de organización o sincronizar tareas, y cuenta con un modo claro/oscuro para adaptarse a las preferencias del usuario.


**LIBRERÍAS UTILIZADAS:**
Este proyecto fue desarrollado con Expo SDK 53 y utiliza diversas librerías para facilitar el desarrollo de la aplicación. En el núcleo del proyecto se encuentran React 19.0.0, React Native 0.79.2 y Expo ~53.0.9, que proporcionan la base para construir interfaces móviles eficientes. Para la navegación entre pantallas se emplearon @react-navigation/native, @react-navigation/stack, react-native-screens y react-native-safe-area-context, mejorando el rendimiento y adaptabilidad a diferentes dispositivos.

En cuanto a la autenticación y conexión con backend, se integró Firebase mediante @react-native-firebase/app y @react-native-firebase/auth, permitiendo gestionar usuarios de forma segura. Para el almacenamiento local se utilizó @react-native-async-storage/async-storage, que permite guardar datos de manera persistente en el dispositivo.

La interfaz de usuario se complementa con @expo/vector-icons para íconos listos para usar, @react-native-picker/picker como selector desplegable y expo-status-bar para el control de la barra de estado. Finalmente, @babel/core se utilizó en el entorno de desarrollo para transpilar código moderno de JavaScript y garantizar compatibilidad con distintas plataformas.

**INSTRUCCIONES PARA CORRER LA APLICACIÓN**
1. Instalar Node.js
2. Descargar las dependencias con npm install.
3. Correr el comando npx expo start para iniciar el servidor de desarrollo.
4. Tener descargado en el celular la aplicación Expo Go necesaria para escanear el QR y probar la aplicación.

Base de datos a incorporar en el archivo .env en la raiz del proyecto
```bash
DATABASE_URL="postgresql://postgres:tallersoft600@colosal.duckdns.org:14998/S31-viginet?schema=public"
```
