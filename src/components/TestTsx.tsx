import { defineComponent, DebuggerEvent, watch } from 'vue';
import {
  Base,
  Ref,
  Reactive,
  Mounted,
  Updated,
  InferPropsType,
} from './vueClass';

import { State } from '@/store/index';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const props = {
  message: { type: String },
};

type Props = InferPropsType<typeof props>;

class Test extends Base<Props> {
  @Ref
  data1 = 2;

  @Reactive
  dataObj = {
    bbcnt: 12,
  };

  $store = useStore<State>();
  $router = useRouter();
  $route = useRoute();

  constructor(...args: any[]) {
    super(...args);
    // onMounted(this.handleM1.bind(this));
    watch(
      () => {
        return this.dataObj.bbcnt;
      },
      (newval, oldVal) => {
        console.log('bbcnt change', newval);
      },
    );
  }

  clickHander() {
    console.log('1233');
    this.data1++;
  }
  clickHander2() {
    console.log('bbcnt');
    this.dataObj.bbcnt++;
  }
  @Mounted
  handleM1() {
    this.handleM2();
    console.log('handleM1');
  }
  @Updated
  handleM2(e?: DebuggerEvent) {
    console.log('handleM2', e);
  }
  render() {
    return (
      <div>
        213134<div>{this.$props.message}</div>1324134
        <div>store: {this.$store.state.key1}</div>
        <div onClick={this.clickHander.bind(this)}>data1:{this.data1}</div>
        <div onClick={this.clickHander2.bind(this)}>
          dataObj.bbcnt:{this.dataObj.bbcnt}
        </div>
      </div>
    );
  }
}

const TestTsx = defineComponent({
  props,
  setup(props, ctx) {
    const r = new Test(props, ctx);
    return r.render.bind(r);
  },
});

export default TestTsx;
