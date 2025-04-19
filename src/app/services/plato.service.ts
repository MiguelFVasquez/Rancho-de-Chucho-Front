import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { platoCreate } from '../dto/dish/PlatoCreateDto';
import { MessageDTO } from '../dto/messageDto';
import { Observable } from 'rxjs';
import { PlatoUpdate } from '../dto/dish/PlatoUpdateDto';
import { platoReadDto } from '../dto/dish/dishdto';

@Injectable({
  providedIn: 'root'
})
export class PlatoService {
  private apiURL = 'http://localhost:8086/api/plato';  
  
  constructor(private http:HttpClient) { }

  //Method to get all dishs
  getAllDishs():Observable<MessageDTO<platoReadDto[]>>{
    return this.http.get<MessageDTO<platoReadDto[]>>(`${this.apiURL}/getAll`);
  }
  
  //Add a new dish
  savePlato(newPlato:platoCreate) : Observable<MessageDTO>{
    return this.http.post<MessageDTO>(`${this.apiURL}/save`, newPlato);
  }
  //Method to edit a dish
  editPlato(id:number, editDish:PlatoUpdate): Observable<MessageDTO>{
    return this.http.put<MessageDTO>(`${this.apiURL}/${id}/update`, editDish);
  }

  //Method to delete a dish
  deletePlato(id:number):Observable<MessageDTO>{
    return this.http.delete<MessageDTO>(`${this.apiURL}/${id}/delete` );
  }
  

}
