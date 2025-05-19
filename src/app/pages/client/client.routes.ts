import { Routes } from "@angular/router";
import { ClientDashboardComponent } from "./client-dashboard/client-dashboard.component";
import { LayoutComponent } from "./layout/layout.component";
import { AccountSettingsComponent } from "../../components/account-settings/account-settings.component";
import { AddLoadComponent } from "./client-dashboard/add-load/add-load.component";

export const clientRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {path: '', component: ClientDashboardComponent},
        { path: 'account', component: AccountSettingsComponent},
        { path: 'add-load', component: AddLoadComponent},
    ]
}
];