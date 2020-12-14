import { defineComponent, DebuggerEvent, watch } from 'vue';
import {
  Base,
  Ref,
  Reactive,
  Mounted,
  Updated,
  RenderTriggered,
} from './vueClass';

import { State } from '@/store/index';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const props = {
  message: {
    type: String,
    default: function() {
      return 'Default string';
    },
  },
};

export class Test extends Base<typeof props> {
  @Ref
  private data1 = 2;

  @Reactive
  private dataObj = {
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

  @RenderTriggered
  @Mounted
  handleM1(e?: DebuggerEvent) {
    this.handleM2();
    console.log('handleM1', e);
  }

  @Updated
  handleM2() {
    console.log('handleM2', this.$props.message);
  }

  handleM3() {
    console.log('handleM3', this.$props.message);
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
