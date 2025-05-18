import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../dto/message";
import { MessageDTO } from "../dto/messageDto";
import { ordenReadDto } from "../dto/order/orderReadDto";
import { OrdenCreateDto } from "../dto/order/createOrderDto";
import { environment, local } from "../env/env";
import { OrdenResponseSet } from "../dto/order/ordenResponseSet";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiURL = environment.ApiUrl + "/api/orden";
  private testURL = local.ApiUrl + "/api/orden";
  constructor(private http: HttpClient) {}

  //Method to get all orders
  getAllOrders(pageNo: number, pageSize: number): Observable<OrdenResponseSet<ordenReadDto>> {
    const params = {
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString()
    };
    return this.http.get<OrdenResponseSet<ordenReadDto>>(`${this.testURL}/getOrdenes`, { params });
  }


  //Method to create a new order
  createOrder(newOrder: OrdenCreateDto): Observable<Message> {
    return this.http.post<Message<OrdenCreateDto>>(
      `${this.testURL}/open`,newOrder,);
  }

  // Método para cancelar una orden
  cancelarOrden(idOrden: number): Observable<Message> {
    return this.http.put<Message>(`${this.testURL}/cancelar/${idOrden}`, {});
  }
}
