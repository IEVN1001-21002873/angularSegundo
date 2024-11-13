import{Routes} from "@angular/router";
import { Ejemplo1Component } from "./formulario/ejemplo1/ejemplo1.component";
// import { ResistenciasComponent } from "./formulario/resistencias/resistencias.component";
export const routes: Routes=[
    {
        path: 'listaalumnos',
        loadChildren:()=> import (  "./alumnos/alumnos.component" )
    },
    {
        path:'ejemplo1',
        component: Ejemplo1Component
    },
    {
        path: 'formulario',
        loadChildren:()=> import (  "./formulario/rutas.formulario" )
    },
    {
        path: 'utl',
        loadChildren:()=> import('./utl/utl.routes')
    },
    {
        path: 'agregar',
        loadChildren:()=> import('.//agregar/agregar.component')
    },
    // {
    //     path: 'resistencias',  // Define la ruta 'ejemplo1'
    //     component: ResistenciasComponent  // Asigna el componente Ejemplo1Component para esta ruta
    //   },
];