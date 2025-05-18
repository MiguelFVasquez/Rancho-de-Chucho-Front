import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NewProduct } from "../dto/product/newProductDto";
import { MessageDTO } from "../dto/messageDto";
import { Message } from "../dto/message";
import { editProduct } from "../dto/product/editProductDto";
import { productDto } from "../dto/product/productDto";
import { units } from "../dto/product/units";
import { environment,local } from "../env/env";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  private apiURL = environment.ApiUrl + "/api/ingrediente";
  private testURL = local.ApiUrl + "/api/ingrediente";
  constructor(private http: HttpClient) {}

  //Method to add a new product
  saveProduct(newProduct: NewProduct): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${this.testURL}/save`, newProduct);
  }
  //Method to edit a product
  editProduct(id: number, editProduct: editProduct): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(
      `${this.testURL}/${id}/update`,
      editProduct,
    );
  }
  //Method to edit stock of a producto
  addToStock(id: number, nueva_cantidad: number): Observable<MessageDTO> {
    const url = `${this.testURL}/updateStock/${id}/${nueva_cantidad}/`;
    return this.http.put<MessageDTO>(url, {});
  }

  //Method to get all products
  getAllProducts(): Observable<MessageDTO<productDto[]>> {
    return this.http.get<MessageDTO<productDto[]>>(`${this.testURL}/getAll`);
  }

  //Method to delete a product
  deleteProduct(id: number): Observable<MessageDTO> {
    return this.http.delete<MessageDTO>(`${this.testURL}/${id}/delete`);
  }

  //Method to get all of units
  getUnits(): Observable<Message<units[]>> {
    return this.http.get<Message<units[]>>(`${this.testURL}/getUnidadMedida`);
  }
}
