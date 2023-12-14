<template>
    <span
        role="textbox"
        :ref="ref"
        :contenteditable="contenteditable ?? 'plaintext-only'"
        :placeholder="placeholder"
        class="
            chatgpt-textbox-scrollbar gray-scrollbar m-0 w-full resize-none border-0 bg-white text-black
            focus:ring-0 focus:outline-none !text-[14px] !py-[7.5px] !px-[10px]
            absolute top-0 left-0 right-0 overflow-y-auto leading-[1.3] transition-all"><slot></slot></span>
</template>

<script>

export default {
    props: {
        ref: {
            type: String,
            required: false,
            default: ''
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        contenteditable: {
            type: Boolean,
            required: false,
            default: undefined
        },
    },
}

</script>

<style>

/***************/

</style>