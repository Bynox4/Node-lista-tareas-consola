import 'colors';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

import { confirmar, inquirerMenu, leerInput, listadoTareaBorrar, mostrarListadoChecklist, pausa } from './helpers/inquirer.js';
import Tareas from './models/tareas.js';



const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ){ //cargar tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        // imprime menu
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
                break;

            case '2': // lista completa
                tareas.listadoCompleto();
                break;

            case '3': // lista completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case '4': // lista pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas(ids)
                break;

            case '6': // Borrar
                const id = await listadoTareaBorrar(tareas.listadoArr);
                if( id !== '0' ){
                    const confirm = confirmar('¿Está seguro?')
                    if (confirm) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }
                
                break;
        }

        guardarDB( tareas.listadoArr );

        if ( opt !== '0' ) await pausa();

        
    } while ( opt !== '0' );


    // pausa();

}

main();