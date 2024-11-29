import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {Categoria} from "../../modelo/Categoria";
import {CategoriaService} from "../../servicio/categoria.service";
import {FormCategoriaComponent} from "./form-categoria/form-categoria.component";

@Component({
  selector: 'app-main-categoria',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './main-categoria.component.html',
  styleUrl: './main-categoria.component.css'
})
export class MainCategoriaComponent implements OnInit {
  dataSource: MatTableDataSource<Categoria>;
  columnsDefinitions = [
    { def: 'idCategoria', label: 'idCategoria', hide: true},
    { def: 'nombreCategoria', label: 'nombreCategoria', hide: false},
    { def: 'acciones', label: 'acciones', hide: false}
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private krervice: CategoriaService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}
  ngOnInit(): void {
    this.krervice.findAll().subscribe(data => this.createTable(data));

    this.krervice.getCategoriaChange().subscribe(data => this.createTable(data));
    this.krervice.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}))
  }
  createTable(data: Categoria[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }
  openDialog(krentidad?: Categoria){
    this._dialog.open(FormCategoriaComponent, {
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
        this.krervice.setCategoriaChange(data);
        this.krervice.setMessageChange('DELETED!');
      });
  }
}
