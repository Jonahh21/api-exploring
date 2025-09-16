import { Routes } from '@angular/router';
import { Skeleton } from './layout/skeleton/skeleton';
import { GameDeals } from './pages/gamedeals/gamedeals';

export const routes: Routes = [
    {
        path: '',
        component: Skeleton,
    },
    {
        path: 'gamedeals',
        component: Skeleton,
        loadChildren: () => [
            {
                path: "",
                component: GameDeals
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
