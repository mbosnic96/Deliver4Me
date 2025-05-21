import { Routes } from "@angular/router";
import { ClientDashboardComponent } from "./client-dashboard/client-dashboard.component";
import { LayoutComponent } from "./layout/layout.component";
import { AccountSettingsComponent } from "../../components/account-settings/account-settings.component";
import { MyLoadsComponent } from "./my-loads/my-loads.component";
import { LoadPreviewComponent } from "./load-preview/load-preview.component";

export const clientRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {path: '', component: ClientDashboardComponent},
        { path: 'account', component: AccountSettingsComponent},
        { path: 'my-loads', component: MyLoadsComponent},
    ]
}
];