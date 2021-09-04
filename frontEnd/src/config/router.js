import VueRouter from 'vue-router'
let routes = {
  path: '/',
  name:'index',
  component:()=> import('../App'),
  children:[
    {
      path: 'result',
      component:()=>import('../components/resultUpload'),
      name:'result',
    },
  ]
}
export const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition){
      return savedPosition
    }
    else{
      return {x: 0, y: 0}
    }
  },
  routes: [routes]
});
router.beforeEach((to, from, next) => {
  if(from.query.redact){
    next(false);
  }
  else {next()}
});