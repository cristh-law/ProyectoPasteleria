import { Routes } from '@angular/router';
import {MainCategoriaComponent} from "./main-categoria/main-categoria.component";
import {FormCategoriaComponent} from "./main-categoria/form-categoria/form-categoria.component";
import {MainProductoComponent} from "./main-producto/main-producto.component";
import {FormProductoComponent} from "./main-producto/form-producto/form-producto.component";

export const pagesRoutes: Routes = [
  {
    path: 'categoria',
    component: MainCategoriaComponent,
    children: [
      { path: 'new', component: FormCategoriaComponent },
      { path: 'edit/:id', component: FormCategoriaComponent },
    ],
  },
  {
    path: 'producto',
    component: MainProductoComponent,
    children: [
      { path: 'new', component: FormProductoComponent },
      { path: 'edit/:id', component: FormProductoComponent },
    ],
  },

];
