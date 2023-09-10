import { createRouter, createWebHistory } from "vue-router";

import Home from '../views/Home.vue';
const lazyLoad = (view) => import(`../views/${view}.vue`);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/modes',
        name: 'Game-Modes',
        component: lazyLoad('GameModes'),
    },
    {
        path: '/shape',
        name: 'ShapeGame-Options',
        component: lazyLoad('ShapeGameOptions'),
    },
    {
        path: '/square',
        name: 'ShapeGame-Square',
        component: lazyLoad('ShapeGameSquare'),
    },
    {
        path: '/triangle',
        name: 'ShapeGame-Triangle',
        component: lazyLoad('ShapeGameTriangle'),
    },
    {
        path: '/circle',
        name: 'ShapeGame-Circle',
        component: lazyLoad('ShapeGameCircle'),
    },
    {
        path: '/trapeze',
        name: 'ShapeGame-Trapeze',
        component: lazyLoad('ShapeGameTrapeze'),
    },
    {
        path: '/pentagon',
        name: 'ShapeGame-Pentagon',
        component: lazyLoad('ShapeGamePentagon'),
    },
    {
        path: '/ellipse',
        name: 'ShapeGame-Ellipse',
        component: lazyLoad('ShapeGameEllipse'),
    },
    {
        path: '/heptagon',
        name: 'ShapeGame-Heptagon',
        component: lazyLoad('ShapeGameHeptagon'),
    },
    {
        path: '/rectangle',
        name: 'ShapeGame-Rectangle',
        component: lazyLoad('ShapeGameRectangle'),
    },
    {
        path: '/hexagon',
        name: 'ShapeGame-Hexagon',
        component: lazyLoad('ShapeGameHexagon'),
    },
    {
        path: '/star',
        name: 'ShapeGame-Star',
        component: lazyLoad('ShapeGameStar'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;