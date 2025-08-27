// src/routes/v1/index.js

const express = require('express');

// Import các file route riêng lẻ
const authRoute = require('../routes/auth.route');
const userRoute = require('../routes/user.router');
const postRoute = require('../routes/post.router');
const contactRoute = require('../routes/contact.route');
const settingsRoute = require('../routes/settings.route');
const permissionRoute = require('../routes/permission.route');
const analyticsRoute = require('../routes/analytics.route');

const router = express.Router();

// Tạo một mảng chứa các route và đường dẫn của chúng
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/contacts',
    route: contactRoute,
  },
  {
    path: '/settings',
    route: settingsRoute,
  },
  {
    path: '/permission',
    route: permissionRoute,
  },
  {
    path: '/analytics',
    route: analyticsRoute,
  },
];

// Dùng vòng lặp để gắn tất cả các route vào router chính
defaultRoutes.forEach((routeEntry) => {
  router.use(routeEntry.path, routeEntry.route);
});

// Bạn có thể thêm các route chỉ dành cho môi trường development ở đây nếu cần
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;