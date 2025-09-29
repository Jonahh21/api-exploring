import { Routes } from '@angular/router';
import { Skeleton } from './layout/skeleton/skeleton';
import { GameDeals } from './pages/gamedeals/gamedeals';
import { GameDeal } from './pages/game-deal/game-deal';
import { Assembler } from './pages/assembler/assembler';

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
            },
            {
                path: ":id",
                loadComponent: () => GameDeal
            },
            {
                path: "**",
                redirectTo: "/gamedeals"
            }
        ]
    },
    {
        path: 'assembler',
        component: Skeleton,
        loadChildren: () => [
            {
                path: "",
                component: Assembler
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
