import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, UserRoutingModule, SharedModule]
})
export class UserModule {}
