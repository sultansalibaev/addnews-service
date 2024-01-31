export default {
    name: 'focus',
    mounted(el, binding) {
        if (el.tagName == 'INPUT' || el.hasAttribute('contenteditable')) {
            el.focus();
            return;
        }
        const innerInput = el.querySelector('input');
        const innerContenteditable = el.querySelector('[contenteditable]');
        let toFocusElement;
        if (binding.value == 'contenteditable' && innerContenteditable) {
            toFocusElement = innerContenteditable
        }
        else if (innerInput) {
            toFocusElement = innerInput
        }
        else if (innerContenteditable) {
            toFocusElement = innerContenteditable
        }
        else {
            return;
        }

        toFocusElement.focus();
    },
}
