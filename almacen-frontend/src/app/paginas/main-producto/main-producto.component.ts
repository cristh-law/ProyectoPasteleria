import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {Component, OnInit, ViewChild} from '@angular/core';
import {Producto} from "../../modelo/Producto";
import {MatTableDataSource} from "@angular/material/table";
import {ProductoService} from "../../servicio/producto.service";
import {FormProductoComponent} from "./form-producto/form-producto.component";

@Component({
  selector: 'app-main-producto',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './main-producto.component.html',
  styleUrl: './main-producto.component.css'
})
export class MainProductoComponent implements OnInit {
  dataSource: MatTableDataSource<Producto>;
  columnsDefinitions = [
    { def: 'idProducto', label: 'idProducto', hide: true},
    { def: 'nombre', label: 'nombre', hide: false},
    { def: 'descripcion', label: 'descripcion', hide: false},
    { def: 'precioventa', label: 'precioventa', hide: false},
    { def: 'acciones', label: 'acciones', hide: false}
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private krervice: ProductoService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}
  ngOnInit(): void {
    this.krervice.findAll().subscribe(data => this.createTable(data));

    this.krervice.getProductoChange().subscribe(data => this.createTable(data));
    this.krervice.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}))
  }
  createTable(data: Producto[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }
  openDialog(krentidad?: Producto){
    this._dialog.open(FormProductoComponent, {
      width: '750px',
      data: krentidad,
      disableClose: true
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  delete(idMedic: number){
    this.krervice.delete(idMedic)
      .pipe(switchMap( ()=> this.krervice.findAll()))
      .subscribe(data => {
        this.krervice.setProductoChange(data);
        this.krervice.setMessageChange('DELETED!');
      });
  }
}
