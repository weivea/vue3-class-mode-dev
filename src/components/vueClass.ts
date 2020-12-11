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
  declare $props: InferPropsType<P>;
  declare $ctx: SetupContext<Record<string, any>>;
  declare [hookMethodKey]: [
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
    hooks.forEach(([methodName, bindFun]) =>
      runBind(this[methodName], this, bindFun),
    );
  }
}
Base.prototype[hookMethodKey] = [];

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
  target[hookMethodKey].push([propertyKey, onBeforeMount]);
}

/** onMounnted装饰器
 * @param target
 * @param propertyKey
 */
export function Mounted(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onMounted]);
}

/** onUpdated装饰器
 * @param target
 * @param propertyKey
 */
export function Updated(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onUpdated]);
}

/** onBeforeUpdate 装饰器
 * @param target
 * @param propertyKey
 */
export function BeforeUpdate(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onBeforeUpdate]);
}

/** onBeforeUnmount 装饰器
 * @param target
 * @param propertyKey
 */
export function BeforeUnmount(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onBeforeUnmount]);
}
/** onUnmounted 装饰器
 * @param target
 * @param propertyKey
 */
export function Unmounted(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onUnmounted]);
}
/** onErrorCaptured 装饰器
 * @param target
 * @param propertyKey
 */
export function ErrorCaptured(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onErrorCaptured]);
}
/** onRenderTracked 装饰器
 * @param target
 * @param propertyKey
 */
export function RenderTracked(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onRenderTracked]);
}
/** onRenderTriggered 装饰器
 * @param target
 * @param propertyKey
 */
export function RenderTriggered(target: any, propertyKey: keyof any) {
  target[hookMethodKey]?.push([propertyKey, onRenderTriggered]);
}
