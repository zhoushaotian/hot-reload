
import Vue from 'vue';
import Router from 'vue-router';
import page1 from '../components/page1';

const Hello = resolve => {
    require.ensure(['../components/Hello'], () => {
        resolve(require('../components/Hello'));
    }, 'hello');
};

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'Hello',
        component: Hello
    },
    {
        path: '/page1',
        name: 'page1',
        component: page1
    }
    ]
});
