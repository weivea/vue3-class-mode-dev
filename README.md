# vue3-class-mode-dev

本项目是基于 vue3 以自定义 class的模式来开发的尝试；
使用typescript + tsx 开发
感觉不错

## sample

```typescript
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

class Test extends Base<typeof props> {
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

  @RenderTriggered
  @Mounted
  handleM1(e?: DebuggerEvent) {
    this.handleM2();
    console.log('handleM1', e);
  }

  @Updated
  handleM2() {
    console.log('handleM2');
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

```


```typescript
// vueClass.ts
import {
  SetupContext,
  ExtractPropTypes,
  reactive,
  ref,
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
} from 'vue';

// enum methodKeyCache {
//   hookMethodKey = Symbol('m')
// }
const hookMethodKey = Symbol('m');

/**
 *  推导props类型
 */
export type InferPropsType<P> = Readonly<ExtractPropTypes<P>>;

function runBind(
  fn: any,
  _this: any,
  bindFun: (hook: () => any) => false | Function | undefined,
) {
  if (typeof fn === 'function') {
    bindFun(fn.bind(_this));
  }
}

/**
 * 基类
 */
export class Base<P = any> {
  declare $props: P;
  declare $ctx: SetupContext<Record<string, any>>;
  declare [hookMethodKey]?: [
    keyof this,
    (hook: () => any) => false | Function | undefined,
  ][];
  constructor(...args: any[]) {
    Object.defineProperty(this, '$props', {
      enumerable: false,
      configurable: false,
      get() {
        return args[0];
      },
    });
    Object.defineProperty(this, '$ctx', {
      enumerable: false,
      configurable: false,
      get() {
        return args[1];
      },
    });

    const hooks = this[hookMethodKey];
    if (hooks) {
      hooks.forEach(([methodName, bindFun]) =>
        runBind(this[methodName], this, bindFun),
      );
    }
  }
}

/**ref装饰器
 * @param target
 * @param name
 */
export function Ref(target: any, name: string | number | symbol): any {
  const refValue = ref<any>();
  const descriptor: PropertyDescriptor = {
    enumerable: true,
    get() {
      return refValue.value;
    },
    set(val: any) {
      refValue.value = val;
    },
  };
  return descriptor;
}

/**reactive装饰器
 * @param target
 * @param name
 */
export function Reactive(target: any, name: string | number | symbol): any {
  let refValue = reactive<any>({});
  const descriptor: PropertyDescriptor = {
    enumerable: true,
    get() {
      return refValue;
    },
    set(val: any) {
      refValue = reactive<any>(val);
    },
  };
  return descriptor;
}

/** onBeforeMount装饰器
 * @param target
 * @param propertyKey
 */
export function BeforeMount(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onBeforeMount])
    : (target[hookMethodKey] = [[propertyKey, onBeforeMount]]);
}

/** onMounnted装饰器
 * @param target
 * @param propertyKey
 */
export function Mounted(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onMounted])
    : (target[hookMethodKey] = [[propertyKey, onMounted]]);
}

/** onUpdated装饰器
 * @param target
 * @param propertyKey
 */
export function Updated(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onUpdated])
    : (target[hookMethodKey] = [[propertyKey, onUpdated]]);
}

/** onBeforeUpdate 装饰器
 * @param target
 * @param propertyKey
 */
export function BeforeUpdate(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onBeforeUpdate])
    : (target[hookMethodKey] = [[propertyKey, onBeforeUpdate]]);
}

/** onBeforeUnmount 装饰器
 * @param target
 * @param propertyKey
 */
export function BeforeUnmount(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onBeforeUnmount])
    : (target[hookMethodKey] = [[propertyKey, onBeforeUnmount]]);
}
/** onUnmounted 装饰器
 * @param target
 * @param propertyKey
 */
export function Unmounted(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onUnmounted])
    : (target[hookMethodKey] = [[propertyKey, onUnmounted]]);
}
/** onErrorCaptured 装饰器
 * @param target
 * @param propertyKey
 */
export function ErrorCaptured(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onErrorCaptured])
    : (target[hookMethodKey] = [[propertyKey, onErrorCaptured]]);
}
/** onRenderTracked 装饰器
 * @param target
 * @param propertyKey
 */
export function RenderTracked(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onRenderTracked])
    : (target[hookMethodKey] = [[propertyKey, onRenderTracked]]);
}
/** onRenderTriggered 装饰器
 * @param target
 * @param propertyKey
 */
export function RenderTriggered(target: any, propertyKey: keyof any) {
  target[hookMethodKey]
    ? target[hookMethodKey]?.push([propertyKey, onRenderTriggered])
    : (target[hookMethodKey] = [[propertyKey, onRenderTriggered]]);
}

```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
