import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "../dto/message";
import { kindDishRead } from "../dto/category-dish/categoryReadDto";
import { MessageDTO } from "../dto/messageDto";
import { environment,local } from "../env/env";

@Injectable({
  providedIn: "root",
})
export class TipoPlatoService {
  private apiURL = environment.ApiUrl + "/api/tipoPlato";
  private testURL = local.ApiUrl + "/api/tipoPlato";
  constructor(private http: HttpClient) {}

  //Method to get all kind of dishses
  getAllKindDishs(): Observable<MessageDTO<kindDishRead[]>> {
    return this.http.get<MessageDTO<kindDishRead[]>>(`${this.apiURL}/getAll`);
  }
}
