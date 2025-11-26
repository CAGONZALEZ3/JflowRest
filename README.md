# Jflowg

## Cómo colaborar en el repositorio

### Empezar en el proyecto:
- Descargar **git bash** https://git-scm.com/downloads (Buscar como configurar gitbash en internet).

- Crear una carpeta para guardar el proyecto 
  
        $ mkdir Desktop/<nombre-carpeta>       //creará una carpeta en el escritorio.
- Dentro de esa carpeta **clonamos** el repo por **HTTPS** 
        
        $ git clone <enlace-del-repo>
- Creamos un branch

        $ git branch <nombre-de-branch>
- Nos movemos a ese branch 
    
        $ git checkout tu-nombre-de-branch.
Listo! empezamos a programar. 
>[!IMPORTANT]
>Recuerda que para correr el projecto por primera vez es necesario realizar los siguientes comandos en el **backend** y **frontend**.
>
>-  `$npm install` para descargar las dependencias del projecto.
>
>- En el **frontend** `npm run dev` para correr el motor de vistas.

>[!NOTE]
>Es posible que te pida que inicies sesión en github cada vez que interactúes con el repositorio.
---
### Cómo hacer pull al repositorio:
Hacer pull significa traer las actualizaciones del repo a tu código local, lo trabajaremos de la siguiente manera:

- Nos movemos a la rama (branch) ***master*** `$ git checkout master` Luego `$ git pull origin master`. 
  
  Listo! ya tienes tu código actualizado.

- Recuerda regresar a tu rama `$ git checkout <nombre-de-branch>`, no se trabaja sobre la rama master!!.
---
### Cómo hacer un commit:
Hacer commit significa guardar el estado de tu código hasta el momento actual, se trabaja de la siguiente manera:

- Debemos añadir los archivos al seguimiento de git 
        
        $ git add -A
        
- Ahora ya podemos hacer **commit** con 
    
        $ git commit -m "mensaje explicando los cambios/añadidos que realizaste"
Listo! ya tienes un commit.

>[!NOTE]
>Puedes observar todos los commit del repo con `$ git log`. 
>
>Para salir del git log presiona `Q`.

--- 
### Cómo hacer merge del master con tu rama:
Hacer merge significa juntar los cambios del **master** con tu ***nombre-de-branch***, es importante que hagas esto siempre antes de hacer push al repositorio. Lo trabajaremos de la siguiente manera:

- Dentro de tu rama 
        
        $ git merge master
    
>[!NOTE]
>Si ocurren conflictos comunícate con la persona que hizo el último aporte al repositorio.
---
### Cómo hacer push al repositorio:
Hacer push significa **enviar tus cambios/añadidos** del último commit que hiciste **al repositorio**, es importante que siempre hagas push **única y exclusivamente** a **tu rama**. Lo trabajaremos de la siguiente manera:

- Dentro de tu rama (branch)
  
        $ git push origin <nombre-de-branch>