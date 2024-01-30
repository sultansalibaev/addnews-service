export default {
    name: 'click-outside',
    mounted(el, binding) {
        console.log('click-outside');
        console.log('el', el);
        const bubble = binding.modifiers.bubble;
        const handler = e => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
                console.log('mousedown');
                binding.value();
            }
        };
        el.__vueClickOutside__ = handler;
        // add Event Listeners
        document.addEventListener("mousedown", handler);
    },
    beforeUnmount(el) {
        document.removeEventListener("mousedown", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
    },
    // bind: function (el, binding, vNode) {
    //     // Provided expression must evaluate to a function.
    //     if (typeof binding.value !== "function") {
    //         const compName = vNode.context.name;
    //         let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
    //         if (compName) {
    //             warn += `Found in component '${compName}'`;
    //         }

    //         console.warn(warn);
    //     }
    //     // Define Handler and cache it on the element
    //     const bubble = binding.modifiers.bubble;
    //     const handler = e => {
    //         if (bubble || (!el.contains(e.target) && el !== e.target)) {
    //             console.log('mousedown, projects_modal', this.projects_modal);
    //             binding.value();
    //         }
    //     };
    //     el.__vueClickOutside__ = handler;
    //     // add Event Listeners
    //     document.addEventListener("mousedown", handler);
    // },
    // unbind: function (el) {
    //     // Remove Event Listeners
    //     document.removeEventListener("mousedown", el.__vueClickOutside__);
    //     el.__vueClickOutside__ = null;
    // }
};