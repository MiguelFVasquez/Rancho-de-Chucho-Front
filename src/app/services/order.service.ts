import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../dto/message';
import { MessageDTO } from '../dto/messageDto';
import { ordenReadDto } from '../dto/order/orderReadDto';
import { OrdenCreateDto } from '../dto/order/createOrderDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiURL = 'http://localhost:8086/api/orden';  

  constructor(private http:HttpClient) { }

  //Method to get all orders 
  getAllOrders():Observable<Message<ordenReadDto[]>>{
    return this.http.get<Message<ordenReadDto[]>>(`${this.apiURL}/getAll`);
  }

  //Method to create a new order
  createOrder(newOrder: OrdenCreateDto): Observable<Message> {
    return this.http.post<Message<OrdenCreateDto>>(`${this.apiURL}/save`, newOrder);
  }
  



}
