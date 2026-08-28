import type { ComponentPublicInstance } from 'vue';
import { onBeforeUpdate, ref } from 'vue';
import type { InputInstance } from '@/models/input';

/**
 * Composable to manage errors on a form with 1 or n inputs.
 *
 * A form can contain input fields and each input may be in error.
 * For accessibility reasons, the first field in error in the form must be focused.
 */
export function useInputs() {
  const inputsRef = ref<Record<string, ComponentPublicInstance<InputInstance>>>({});

  /**
   * Reset refs before each update in order to manage cases when an input is removed from the form.
   */
  onBeforeUpdate(() => {
    inputsRef.value = {};
  });

  /**
   * Function to register a component of type {@interface InputInstance} in {@const inputsRef}.
   *
   * Why are refs saved in {@const inputRef}?
   *
   * With Vue 3, it's impossible to access all the refs of a component as was the case in Vue 2 (`this.$refs`).
   * In addition, it's impossible to retrieve refs directly from a composable function.
   *
   * The chosen solution is to dynamically register the refs in order to access them directly from this
   * composable function and extract all the focus error logic into one function.
   * (See: https://vuejs.org/guide/essentials/template-refs.html#function-refs)
   *
   * How to register an InputInstance in a template ?
   * <MyInputComponent
   *   :ref="(el) => saveInputRef(0, el)"
   * />
   *
   * const { saveInputRef } = useInputs();
   *
   * @param key the key of the input to register (warning: each input must have a different index)
   * @param el the component that will be registered in {@constant inputsRef}
   */
  const saveInputRef = (key: string | number, el: ComponentPublicInstance | Element | null): void => {
    if (el === null || el instanceof Element) return;
    inputsRef.value[`input${key}`] = el as ComponentPublicInstance<InputInstance>;
  };

  /**
   * Focuses on the first input that is in error from the inputsRef list.
   */
  const focusOnErrors = (): void => {
    if (!inputsRef.value) return;

    for (const key in inputsRef.value) {
      if (inputsRef.value.hasOwnProperty(key)) {
        const inputRef = inputsRef.value[key];
        if (inputRef && inputRef.hasErrors) {
          if (typeof inputRef.focus === 'function') inputRef.focus();
          break;
        }
      }
    }
  };

  return {
    inputsRef,
    saveInputRef,
    focusOnErrors
  };
}
