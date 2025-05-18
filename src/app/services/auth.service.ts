import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginDto } from "../dto/login/LoginDto";
import { UsuarioReadDto } from "../dto/login/UsuarioReadDto";
import { Message } from "../dto/message";
import { Observable } from "rxjs";
import { environment } from "../env/env";
import { local} from "../env/env";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiURL = environment.ApiUrl + "/api/login";
  private testURL = local.ApiUrl + "/api/login";

  constructor(private http: HttpClient) {}

  loginMesero(login: LoginDto): Observable<Message<UsuarioReadDto>> {
    return this.http.post<Message<UsuarioReadDto>>(
      `${this.testURL}/mesero`,
      login,
    );
  }
}
