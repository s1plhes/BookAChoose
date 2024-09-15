import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/create-user',
      name: 'create-user',
      component: () => import('../views/Users/user_create.vue')
    },
    { path: '/users', name: 'users', component: () => import('../views/Users/user_list.vue') },
    {
      path: '/books/:tag',
      name: 'get-book-tag',
      component: () => import('../views/Books/book_by_tag.vue')
    },
    { path: '/books', name: 'books', component: () => import('../views/Books/book_index.vue') },
    {
      path: '/book/:bookId',
      name: 'getbook',
      component: () => import('../views/Books/book_get.vue')
    },
    {
      path: '/book/:bookId/chapter/:chapterId',
      name: 'getchapter',
      component: () => import('../views/Books/chapter_get.vue')
    },
    {
      path: '/book/create',
      name: 'create-book',
      component: () => import('../views/Books/book_create.vue')
    },
    {
      path: '/book/:bookId/chapter/create',
      name: 'create-chapter',
      component: () => import('../views/Books/chapter_create.vue')
    },
    {
      path: '/book/:bookId/edit',
      name: 'edit-book',
      component: () => import('../views/Books/book_edit.vue')
    },
    {
      path: '/book/:bookId/chapter/:chapterId/edit',
      name: 'edit-chapter',
      component: () => import('../views/Books/chapter_edit.vue')
    },
    {
      path: '/:username/',
      name: 'user_profile',
      component: () => import('../views/Users/user_profile.vue')
    },
    {
      path: '/:username/books',
      name: 'userbooks',
      component: () => import('../views/Books/book_user_get.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Users/user_register.vue')
    },
    { path: '/login', name: 'login', component: () => import('../views/Users/user_login.vue') },
    { path: '/logout', name: 'logout', component: () => import('../views/Users/user_logout.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Users/user_settings.vue')
    },
    { path: `/403`, name: '403', component: () => import('../views/403.vue') },
    { path: `/test`, name: 'test', component: () => import('../views/testView.vue') },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('../views/404.vue') },
    { path: `/404`, name: '404', component: () => import('../views/404.vue') },
    { path: `/up`, name: 'up', component: () => import('../views/UpView.vue') },

    {
      path: '/hk',
      children: [
        { path: '', component: () => import('@/views/admin/AdminOverview.vue') },
        {
          path: 'manage-users/:userId',
          component: () => import('@/views/admin/users/EditUser.vue')
        },
        { path: 'manage-users', component: () => import('@/views/admin/users/UsersList.vue') }
        //  { path: 'users/:id', component: AdminUserDetails },
      ]
    }
  ]
})

export default router
