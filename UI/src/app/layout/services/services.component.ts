import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { WebsiteService } from '../../shared/service/website.service';
import * as io from "socket.io-client";
import {environment} from '../../../environments/environment.prod';

export interface StockData {
  _id: string;
  stalt_user_id: string;
  stalt_st_id: string;
  stalt_qty: number;
  stalt_buy_rate: number;
  st_name: string;
  st_latest_rate: number;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  displayedColumns: string[] = [ 'st_name', 'stalt_qty', 'stalt_buy_rate', 'st_latest_rate', 'invested', 'current', 'return' ];
  dataSource: MatTableDataSource<StockData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  serviceData:any;

  token = localStorage['_stk_LO']
  socket = io( environment.marketPoint, {
    query: {
      token: this.token
    }
  })
  constructor(
    private webService:WebsiteService,
  ) { 
    this.serviceData = {}
    this.serviceData.tableList = []
  }

  ngOnInit() {
    this._getDashBoard();
    
    // this.socket.emit('stock_update', {})

    this.socket.on('stock_update', (msg: any) => {
      this.UpdateStock(msg)
    })

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateTable(){
    this.dataSource = new MatTableDataSource(this.serviceData.tableList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.start();
  }

  UpdateStock(data){
    let index = this.dataSource.data.findIndex(it=> it.stalt_st_id == data.id)
    if(index != -1){
      this.dataSource.data[index].st_latest_rate = data.value
    }
  }

  start(){
    this.serviceData.tableList.filter(it=>{    
      let obj1 = {
        room_id: it.stalt_st_id,
        sender_id: this.token
      }
      this.socket.emit('room_join',obj1)
    })
  }

  end(){
    this.serviceData.tableList.filter(it=>{    
      let obj1 = {
        room_id: it.stalt_st_id,
        sender_id: this.token
      }
      this.socket.emit('room_leave',obj1)
    })
  }

  _getDashBoard(){
    this.webService._getDashboard()
    .subscribe(res=>{
      // console.log(res)
      if(res.error == false){
        this.makeTheDesireData(res.body);
      }else{
        this.webService.openSnackBar(res.message, 'Error!', 2000); 
      }
    },err=>{
      console.log(err)
      this.webService.openSnackBar('Server encountered with some error, please try after some time.', 'Error!', 2000);
    })
  }

  makeTheDesireData(data){
    let arr = [], count = 0
    data.allot.filter(loop=>{
      let x = { ...loop }
      let index = data.stock.findIndex(it=> it._id == loop.stalt_st_id)
      let obj = {
        st_name: data.stock[index].st_name,
        st_latest_rate: data.stock[index].st_latest_rate
      }
      obj = { ...x, ...obj }
      arr.push(obj)
      count++;
      if(data.allot.length == count){
        this.serviceData.tableList = arr
        // console.log(this.serviceData.tableList)
        this.updateTable();
      }
    })
  }

  ngOnDestroy() {
    this.end();
    this.socket.emit('disconnect')
  }

}