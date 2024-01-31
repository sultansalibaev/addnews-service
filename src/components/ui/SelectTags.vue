<template>
    <div
        class="relative h-[33.19px] z-[9] max-w-[270px] w-full projects-container text-left"
        @click.stop="tags_modal = true"
        v-click-outside="hide_tags_modal"
    >
        <ResizableField
            class="h-[100px] projects !rounded-[5px]"
            :class="{
                '!pt-[0.5px] !pb-px': selected_tags.length > 0,
                '!h-[33.19px]': !tags_modal && selected_tags.length > 0,
                '!h-0 !p-0': selected_tags.length == 0,
            }"
        >
            <!-- [&:not(:empty)]:!pt-0 -->
            <TransitionGroup name="tags" tag="span" contenteditable="false" class="tags select-none" v-if="selected_tags.length">
                <span v-for="(project, index) in selected_tags" :key="project.id" class="inline-block">
                    <span
                        :title="project.name"
                        class="project-tag bg-gray-400 text-white rounded-[5px] px-[5px] inline-flex h-[18px] pt-[1.5px] mb-px items-center relative z-[8]"
                    >{{project.id}}<i
                        class="
                            fa-solid fa-xmark scale-[.7] absolute top-[-8px] right-[-8px]
                            transition-all bg-[#ec5e5e] text-white text-[13px] cursor-pointer pt-[2px]
                            flex w-[1.35em] h-[1.35em] items-center justify-center rounded-full
                        "
                        @click="removeTag(index)"
                    ></i></span>
                    <span class="font-bold text-[18px]" :class="{
                        'opacity-0': index == selected_tags.length - 1
                    }">,</span>&nbsp;
                </span>
            </TransitionGroup>
        </ResizableField>
        <div
            class="absolute top-[100px] left-0 right-0 h-[200px] ring-0 transition-all"
            :class="{
                '!p-0 !border-none !overflow-hidden': !tags_modal,
                '!h-0 ': !tags_modal && selected_tags.length > 0,
                '!h-[33.19px]': !tags_modal && selected_tags.length == 0,
                '!top-0': selected_tags.length == 0,
            }"
        >
            <input
                type="text"
                ref="search_text"
                @input="inputSearchText"
                :value="search_text"
                class="focus:outline-none text-[14px] w-full rounded-[5px] border-b-[1px] px-[10px]"
                :class="{
                    'my-[2px] h-[30px]': tags_modal && selected_tags.length > 0,
                    'h-[33.19px]': !tags_modal || selected_tags.length == 0,
                }"
                placeholder="Введите название либо ID-проекта"
            />
            <div
                id="project-list"
                class="chatgpt-textbox-scrollbar gray-scrollbar"
                :class="{
                    '!h-0 !p-0 !border-none pointer-events-none': !tags_modal,
                }"
                @scroll="onScroll"
            >
                <i v-if="tags_loading" class="fa-solid fa-spinner"></i>
                <div
                    v-else
                    v-for="project in sliced_tags"
                    :key="project.id"
                    class="project-id-name"
                    :class="{
                        'bg-[#0000001a]': getSelectedTagBy[project?.id]
                    }"
                    :title="`${project.id} - ${project.name}`"
                    @click.stop="toggleTag(project)"
                ><b v-if="isNumber(search_text) && search_text.trim() != ''">{{ project.id }}:&nbsp;</b>{{ project.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    tags_loading,

    tags,
    searched_tags,
    sliced_tags,
    selected_tags,
    getSelectedTagBy,

    getMoreTags,
    searchTags,
    removeTag,
    toggleTag,
} from "@/use/data/tags"

import ResizableField from "@/components/ui/ResizableField.vue"

export default {
    components: {
        ResizableField,
    },
    setup: () => ({
        tags_loading,

        tags,
        searched_tags,
        sliced_tags,
        selected_tags,
        getSelectedTagBy,

        getMoreTags,
        searchTags,
        removeTag,
        toggleTag,
    }),
    data: () => ({
        search_text: '',
        typingTimer: 0,
        doneTypingInterval: 1000,

        tags_modal: false,
    }),
    methods: {
        hide_tags_modal() {
            this.tags_modal = false;
        },
        isNumber(string) {
            return !Number.isNaN(Number(string.trim()));
        },
        disableSelectAll(event) {
            return !(event.keyCode == 65 && event.ctrlKey);
        },
        inputSearchText({ target }) {
            let { value } = target;
            clearTimeout(this.typingTimer);
			this.typingTimer = setTimeout(() => {

                this.searchTags(value.trim(), this.search_text);
                this.search_text = value.trim();

                this.$refs?.tags?.scrollTo({top: 0, behavior: 'smooth'});

            }, this.doneTypingInterval);
        },
        onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (scrollTop + clientHeight >= scrollHeight-32) {
                // this.get_more_temp_project_ids()
                this.getMoreTags()
            }
        },
    },
    watch: {
        tags_modal(bool) {
            if (bool) this.$refs?.search_text?.focus();
        }
    },
}
</script>