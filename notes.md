

**Files Read:**

**/Users/vania/Desktop/juan/icesi/VII/compu3/dev/repo-profe/2025-2-nest-postgres/src/main.ts**
```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

```



Te explico el archivo `main.ts` línea por línea:

## Función del main.ts

Este archivo es el **punto de entrada** de la aplicación NestJS. Configura y arranca el servidor.

```typescript path="/Users/vania/Desktop/juan/icesi/VII/compu3/dev/repo-profe/2025-2-nest-postgres/src/main.ts" start=5 end=15
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
```
## Configuraciones específicas

### `setGlobalPrefix('api')`
Agrega el prefijo `/api` a todas las rutas:
- Ruta del controller: `/students`  
- URL final: `/api/students`

### `useGlobalPipes`
Aplica **pipes** (transformadores/validadores) a **todas** las rutas de la aplicación automáticamente.

### `ValidationPipe`
Es un pipe que valida automáticamente los datos de entrada usando decoradores de `class-validator`:

```typescript
// En un DTO
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  age: number;
}
```
### `whitelist: true`
**Filtra propiedades no deseadas**. Solo permite propiedades que tengan decoradores de validación.

**Ejemplo:**
```json
// Request body
{
  "name": "Juan",
  "email": "juan@example.com", 
  "age": 20,
  "maliciousField": "hack"  // Esta se elimina automáticamente
}

// Llega al controller solo:
{
  "name": "Juan",
  "email": "juan@example.com",
  "age": 20
}
```
### `forbidNonWhitelisted: true`
En lugar de eliminar silenciosamente, **rechaza la petición** si encuentra propiedades no válidas.

**Ejemplo:**
```json
// Request con campo no permitido
{
  "name": "Juan",
  "unknownField": "value"
}

// Respuesta: 400 Bad Request
{
  "message": [
    "property unknownField should not exist"
  ],
  "error": "Bad Request"
}
```
## Beneficios de seguridad

Esta configuración protege contra:
- **Mass assignment attacks**: usuarios no pueden enviar campos extra
- **Datos maliciosos**: filtra automáticamente propiedades peligrosas  
- **Errores de validación**: rechaza datos que no cumplen las reglas del DTO

Es una configuración **esencial** para APIs en producción.

### service
el service es toda la logica de negocio de la aplicacion. 

### repositories
los repos sirven para comunicarnos con la base de datos. 

### controllers
se encargan de todo lo relacionado con las rutas. 
jwt, autenticacion, autorizacion.