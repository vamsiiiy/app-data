import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private appservice: AppService) { }
  
  private floorListSelection: string[] = [];
  private roomListSelection: string[];
  private response:any=[];


  private gridApi;

  columnDefs = [
    { field: 'name' },
    { field: 'size' },
    { 
      field: 'price',
      valueFormatter: this.currencyFormatter
    
    },
    { field: 'rooms' },
    { 
      field: 'floor',
      valueFormatter: this.AddingFloorFilter 
    }
];

rowData = []; 

SelectFloor(params: any){
  var value = params.currentTarget.value;
  var isChecked = params.currentTarget.checked;
  if(isChecked && !this.floorListSelection.includes(value)){          
      this.floorListSelection.push(value);
  }
  else if(this.floorListSelection.includes(value)){
    // this.floorListSelection.pop(value);
        const index: number = this.floorListSelection.indexOf(value);
    if (index !== -1) {
        this.floorListSelection.splice(index, 1);
    }   
 
  }
this.filterGrid();

}

SelectRoom(params: any){
   var value = params.currentTarget.value;
  if(params.currentTarget.checked && !this.roomListSelection.includes(value)){          
      this.roomListSelection.push(value);
  }
    else if(this.roomListSelection.includes(value)){
    // this.floorListSelection.pop(value);
        const index: number = this.roomListSelection.indexOf(value);
    if (index !== -1) {
        this.roomListSelection.splice(index, 1);
    }   
 
  }
}

filterGrid(){

  var tobeFiltered = this.response;
  var fiteredList = [];

  fiteredList = tobeFiltered.filter(data => {

    if(this.floorListSelection.includes(data.floor.toString())){
      return data;
    }
      
  });

this.rowData = fiteredList;
this.gridApi.setRowData(this.rowData); // Refresh grid

    console.log(this.rowData);
}

filterGridBasedOnRoom(){
  this.rowData = this.rowData.filter(item => {

    for(let room in this.roomListSelection){
       if (item.rooms == room)
          return true;
    }


   return false;

  
});
}

onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
  }


currencyFormatter(params: any) {
  var inrFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  return inrFormat.format(params.value);
}

AddingFloorFilter(params:any){  
  return params.value+"F";
}

AddingVolumeilter(params:any){  
  return params.value+"m";
}


  ngOnInit(): void {
    this.appservice.getJSON().subscribe(response => {
      if(response != null){
        this.rowData = response.units;
        this.response= response.units;
      }
    });

  }


}
