const swaggerAutogen = require('swagger-autogen')({ openapi: '3.1.0' });

const doc = {
  info: {
    title: 'DormDeals REST API',
    description: 'RESTful API for DormDeals',
    version: '1.0.0',
    contact: {
      name: 'DormDealsProject',
      url: 'https://dormdeal-project.vercel.app/',
      email: 'dormdealsproject@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local',
    },
  ],
  tags: [
    { name: 'Post', description: 'API สำหรับจัดการโพสต์' },
    { name: 'User', description: 'API สำหรับจัดการผู้ใช้' },
    { name: 'Admin', description: 'API สำหรับจัดการแอดมิน' },
    // { name: 'Chatroom', description: 'API สำหรับจัดการห้องแชท' },
    { name: 'Maincategory', description: 'API สำหรับจัดการหมวดหมู่หลัก' },
    // { name: 'Message', description: 'API สำหรับจัดการข้อความ' },
    { name: 'Mod', description: 'API สำหรับจัดการม็อด' },
    { name: 'Notification', description: 'API สำหรับจัดการการแจ้งเตือน' },
    { name: 'Rating', description: 'API สำหรับจัดการการให้คะแนน' },
    { name: 'Report', description: 'API สำหรับจัดการรายงาน' },
    { name: 'Subcategory', description: 'API สำหรับจัดการหมวดหมู่ย่อย' },
    { name: 'Wishlist', description: 'API สำหรับจัดการรายการโปรด' },
  ],
};

const outputFile = './swagger-output.json'; 

const router = [
  '../routers/post.router.js',
  '../routers/admin.router.js',
//   '../routers/chatroom.router.js',
    '../routers/maincategory.router.js',
//   '../routers/message.router.js',
  '../routers/mod.router.js',
   '../routers/notification.router.js',
   '../routers/rating.router.js',
   '../routers/report.router.js',
  '../routers/subcategory.router.js',
  '../routers/user.router.js',
   '../routers/wishlist.router.js',
];

swaggerAutogen(outputFile, router, doc);
