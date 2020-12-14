import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ComponentInternalInstance,
  ref,
} from 'vue';
import TestTsx, { Test } from '@/components/TestTsx.tsx'; // @ is an alias to /src

const Home = defineComponent((props, ctx) => {
  const vm = getCurrentInstance();
  onMounted(() => {
    console.log(vm?.type);
  });
  const r1 = ref(null);
  return () => {
    return (
      <div class="home">
        <img alt="Vue logo" src={require('../assets/logo.png')} />
        <TestTsx
          ref={({ _: v }: any) => {
            setTimeout(() => {
              v.handleM3();
            }, 100);
          }}
          message="TestTsx1111111111"
        />
        <div>------------------</div>
        <TestTsx
          ref={({ _: v }: any) => {
            v.handleM3();
          }}
          message="TestTsx22222222222"
        />
      </div>
    );
  };
});

export default Home;
