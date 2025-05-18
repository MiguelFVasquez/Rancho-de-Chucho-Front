import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PlatoCreate } from "../dto/dish/PlatoCreateDto";
import { MessageDTO } from "../dto/messageDto";
import { Observable } from "rxjs";
import { PlatoUpdate } from "../dto/dish/PlatoUpdateDto";
import { platoReadDto } from "../dto/dish/dishdto";
import { environment,local } from "../env/env";

@Injectable({
  providedIn: "root",
})
export class PlatoService {
  private apiURL = environment.ApiUrl + "/api/plato";
  private testURL = local.ApiUrl + "/api/plato";
  constructor(private http: HttpClient) {}

  //Method to get all dishs
  getAllDishs(): Observable<MessageDTO<platoReadDto[]>> {
    return this.http.get<MessageDTO<platoReadDto[]>>(`${this.testURL}/getAll`);
  }

  //Add a new dish
  savePlato(newPlato: PlatoCreate): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${this.testURL}/save`, newPlato);
  }
  //Method to edit a dish
  editPlato(id: number, editDish: PlatoUpdate): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${this.testURL}/${id}/update`, editDish);
  }

  //Method to delete a dish
  deletePlato(id: number): Observable<MessageDTO> {
    return this.http.delete<MessageDTO>(`${this.testURL}/${id}/delete`);
  }
}
