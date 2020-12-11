import { defineComponent } from 'vue';
import TestTsx from '@/components/TestTsx.tsx'; // @ is an alias to /src

const Home = defineComponent((props, ctx) => {
  return () => {
    return (
      <div class="home">
        <img alt="Vue logo" src={require('../assets/logo.png')} />
        <TestTsx message="Welcome to Your Vue.js + TypeScript App" />
      </div>
    );
  };
});

export default Home;
