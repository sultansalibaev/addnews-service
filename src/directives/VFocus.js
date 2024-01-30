export default {
    name: 'focus',
    mounted(el) {
        if (el.tagName == 'INPUT') {
            el.focus();
            return;
        }
        let innerInput = el.querySelector('input');
        if (innerInput) innerInput.focus();
    },
}
