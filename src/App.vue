<template>
    <div class="p-[15px]" @click="project_list_modal = false">
        <div class="input-group h-full mb-[15px] flex items-end">
            <div class="relative w-full h-[33.63px] z-10 rounded-tl-[4px] rounded-bl-[4px]" id="chatgpt-prompt-textarea">
                <ResizableField
                    ref="urlsInput"
                    :contenteditable="'plaintext-only'"
                    :placeholder="'Введите ссылку на публикацию'"
                    class="max-h-[200px] min-h-[24px] [&:not(:focus)]:!max-h-[39.86px] whitespace-pre-line"
                    @input="inputUrlsInput"
                    @focusout="updateHtml"
                    v-html="urlsInput"
                ></ResizableField>
            </div>
            <span class="input-group-btn mob-p-x-0" style="width: unset;">
                <button type="button" class="btn btn-primary" @click="add_urls">Добавить</button>
            </span>
        </div>
        <div class="tabs-container">
            <ul class="nav nav-tabs" role="tablist">
                <li v-if="urls.to_system.length" :class="{ active: selected_tab == 1 }" @click="selected_tab = 1">
                    <a class="nav-link" data-toggle="tab" href="#tab-1" :aria-expanded="selected_tab == 1">
                        <i class="fa-solid fa-info"></i>
                        Инфо
                    </a>
                </li>
                <li v-if="own_requests.length" :class="{ active: selected_tab == 2 }" @click="selected_tab = 2">
                    <a class="nav-link" data-toggle="tab" href="#tab-2" :aria-expanded="selected_tab == 2">
                        <i class="fa-solid fa-plus"></i>
                        <!-- <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/parsing.svg" alt="parsing icon"> -->
                        Добавление
                    </a>
                </li>
                <li v-if="items_manually.length" :class="{ active: selected_tab == 3 }" @click="selected_tab = 3">
                    <a class="nav-link" data-toggle="tab" href="#tab-3" :aria-expanded="selected_tab == 3">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/add-manually.svg" alt="add-manually icon">
                        Вручную
                    </a>
                </li>
                <li v-if="urls.unknown_source.length" :class="{ active: selected_tab == 4 }" @click="selected_tab = 4">
                    <a class="nav-link" data-toggle="tab" href="#tab-4" :aria-expanded="selected_tab == 4">
                        Источник
                    </a>
                </li>
                <li v-if="urls.to_projects.length" :class="{ active: selected_tab == 5 }" @click="selected_tab = 5">
                    <a class="nav-link" data-toggle="tab" href="#tab-5" :aria-expanded="selected_tab == 5">
                        <i class="fa fa-desktop"></i>
                        Проект
                    </a>
                </li>
                <li v-if="urls.invalid.length" class="!float-right" :class="{ active: selected_tab == 6 }" @click="selected_tab = 6">
                    <a class="nav-link" data-toggle="tab" href="#tab-6" :aria-expanded="selected_tab == 6">
                        <i class="fa-solid fa-triangle-exclamation text-[#f2b90a] !scale-[1.4]"></i>
                    </a>
                </li>
            </ul>
            <div class="tab-content bg-white pb-[15px]">
                <div role="tabpanel" id="tab-1" class="tab-pane" :class="{ active: selected_tab == 1 }">
                    <NewsTable
                        @select-item="selectItem"
                        @remove-item="removeItem"
                        :items="urls.to_system"
                        :tab-name="'to_system'"
                        :selectable="true"
                        :set-columns="{ published_at: false, published_at: false }"
                    />
                    <div class="flex items-center gap-x-[12px] px-[15px] mx-[5px]">
                        <button
                            type="button"
                            :class="{
                                '!bg-gray-300 !border-gray-300 pointer-events-none': !selectedUrls.length,
                            }"
                            class="btn btn-primary ml-auto"
                            @click="add_items_manually"
                        >Добавить в ручную</button>
                        <button
                            type="button"
                            :class="{
                                '!bg-gray-300 !border-gray-300 pointer-events-none': !selectedUrls.length,
                            }"
                            class="btn btn-primary"
                            @click="add_items"
                        >Добавить в систему</button>
                    </div>
                </div>
                <div role="tabpanel" id="tab-2" class="tab-pane"  :class="{ active: selected_tab == 2 }">
                    <NewsTable :items="own_requests" :setColumns="{ source: false }" />
                </div>
                <div role="tabpanel" id="tab-3" class="tab-pane"  :class="{ active: selected_tab == 3 }" v-if="items_manually.length">
                    <NewsTable class="invalid-table" @remove-item="removeManuallyItem" :items="items_manually" :only="['link', 'project_id']" />
                </div>
                <div role="tabpanel" id="tab-4" class="tab-pane"  :class="{ active: selected_tab == 4 }" v-if="urls.unknown_source.length">
                    <NewsTable
                        @select-item="selectItem"
                        @remove-item="removeItem"
                        :items="urls.unknown_source"
                        :tab-name="'unknown_source'"
                        :set-columns="{ project_id: false, status: false }"
                        :selectable="true"
                    />
                </div>
                <div role="tabpanel" id="tab-5" class="tab-pane"  :class="{ active: selected_tab == 5 }" v-if="urls.to_projects.length">
                    <div class="flex justify-between items-center mt-[18px] px-[15px] mx-[5px] h-[33.63px]">
                        <h3 class="!text-[20px]">Добавление новых публикации:</h3>
                        <div
                            v-if="selectedUrls.length"
                            class="flex flex-grow-[1] items-center justify-end gap-[12px]"
                        >
                            <select-tags />
                            <button
                                type="button"
                                class="btn btn-default"
                                @click="cancelProjects()"
                            >Отмена</button>
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="applyProjects()"
                            >Применить</button>
                        </div>
                    </div>
                    <NewsTable
                        @select-item="selectItem"
                        @remove-item="removeItem"
                        :items="urls.to_projects"
                        :tab-name="'to_projects'"
                        :set-columns="{ status: false }"
                        :selectable="true"
                    />
                    <div class="flex items-center gap-x-[12px] px-[15px] mx-[5px]">
                        <button
                            type="button"
                            :class="{
                                '!bg-gray-300 !border-gray-300 pointer-events-none': !selectedUrls.length,
                            }"
                            class="btn btn-primary ml-auto"
                        >Добавить</button>
                    </div>
                </div>
                <div role="tabpanel" id="tab-6" class="tab-pane"  :class="{ active: selected_tab == 6 }" v-if="urls.invalid.length">
                    <NewsTable class="invalid-table" :withoutThead="true" :copy_link="true" :items="urls.invalid" :only="['link']" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NewsTable from './components/NewsTable.vue';
import ResizableField from './components/ui/ResizableField.vue';
import '@/use/utils'
import { getInfoItems, getItems, addToProjects } from './use/api';

import SelectTags from "@/components/ui/SelectTags.vue"
import { initProjects } from "@/use/api/projects"
import { clearSelectedTags, selected_tags } from "@/use/data/tags"

export default {
    name: 'App',
    components: {
        NewsTable,
        ResizableField,
        SelectTags,
    },
    setup: () => ({
        getInfoItems,
        getItems,

        initProjects,
        addToProjects,

        clearSelectedTags,
        selected_tags,
    }),
    data() {
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        function randomProjects() {
            return Array(randomInt(1,3)).fill(''+randomInt(10116,10189))
                        .map(p_id => ({
                            id: p_id,
                            name: 'Project name ...'
                        }))
        }
        let own_requests = this.shuffle([...(
            Array(25).fill(1).map((n,i) => ({
                category_id: this.getEvery(i+1, 13),
                type: 1,
                link: 'https://www.ami.com/@turarym/video/7210744343785688326',
                parsing: false,
                published_at: '2023-03-29 09:51:34',
                projects: randomProjects(),
                status: 'Выполнен'
            }))
        ), ...(
            Array(25).fill(1).map((n,i) => ({
                category_id: this.getEvery(i+1, 10),
                type: 2,
                link: 'https://www.tiktok.com/@turarym/video/7210744343785688326',
                parsing: false,
                published_at: '2023-03-29 09:51:34',
                projects: randomProjects(),
                status: 'Выполнен'
            }))
        )]);

        let social_category_ids = {
            'vk.com': 1,
            'facebook': 2,
            'twitter.com': 3,
            'instagram.com': 4,
            'youtube.com': 6,
            'ok.ru': 7,
            't.me': 9,
            'tiktok.com': 10,
        };

        return {
            selected_tab: 2,
            urls: {
                invalid: [],
                to_system: [],
                unknown_source: [],
                to_projects: [],
            },
            social_hosts: Object.keys(social_category_ids),
            social_category_ids: social_category_ids,
            own_requests,
            items_manually: [],
        }
    },
    methods: {
        handlerAddToProjects() {
            this.addToProjects(this.urls.to_projects)
                .then(response => {
                    console.log('handlerAddToProjects', response);
                })
        },
        cancelProjects() {
            // this.input_project = '';
            this.urls.to_projects.forEach(item => {
                if (!item.selected) return;
                item.selected = false;
            });
            this.clearSelectedTags();
        },
        applyProjects() {
            // this.input_project = '';
            this.urls.to_projects.forEach(item => {
                if (!item.selected) return;

                item.selected = false;
                item.projects = JSON.parse(JSON.stringify(this.selected_tags));
                console.log(item.link, item);
                console.log('selected_tags', this.selected_tags);
                console.log('item.projects', item.projects);
            });
            this.clearSelectedTags();
        },
        selectItem(event, index, tab_name) {
            if (!event.shiftKey && this.urls[tab_name]) this.urls[tab_name][index].selected = !this.urls?.[tab_name][index].selected;

            let start = this.lastSelectedIndex, end = index;

            if (event.shiftKey && this.lastSelectedIndex > index) {
                start = index;
                end = this.lastSelectedIndex;
            }

            const bool = this.urls?.[tab_name].slice(start, end+1).some(temp => !temp.selected);

            if (this.lastSelectedIndex != undefined && event.shiftKey) {
                for (let i = start; i <= end; i++) {
                    if (this.urls[tab_name]) this.urls[tab_name][i].selected = bool;
                }
            }

            if (!event.shiftKey) this.lastSelectedIndex = index;
        },
        removeItem(itemIndex, tab_name) {
            if (itemIndex > -1) this.urls?.[tab_name].splice(itemIndex, 1)
        },
        removeManuallyItem(itemIndex) {
            if (itemIndex > -1) this.items_manually.splice(itemIndex, 1)
        },
        shuffle(array) {
            let currentIndex = array.length,  randomIndex;

            while (currentIndex > 0)
            {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }

            return array;
        },
        add_items_manually() {
            this.urls.to_system.filter(item => item.selected).forEach(item => {
                if (this.all_items_manually_obj[item.link]) return;
                this.items_manually.unshift(item);
            })
            this.urls.to_system = this.urls.to_system.filter(item => !item.selected)
        },
        add_items() {
            this.urls.to_system.filter(item => item.selected).forEach(item => {
                if (this.all_items_manually_obj[item.link]) return;
                this.items_manually.unshift(item);
            })
            this.urls.to_system = this.urls.to_system.filter(item => !item.selected)
        },
        getEvery(num, every) {
            return num > every ? num - (every * parseInt(num / every)) || every : num
        },
        inputUrlsInput({ target: { textContent } }) {
            this.urlsInput = textContent;
        },
        add_urls() {
            let temp_valid_urls = [];
            this.urlsInput.trim().split('\n').forEach(url => {

                url = url.trim();

                if (this.all_urls_obj[url] || !url) return;

                let hostname = this.validHttpUrl(url).hostname;
                
                if (!hostname) {
                    this.urls.invalid.unshift({ link: url })
                }
                else if (this.social_hosts.some(host => hostname.includes(host))) {
                    temp_valid_urls.unshift({ link: url, type: 2 })
                }
                else {
                    temp_valid_urls.unshift({ link: url, type: 1 })
                }
            });

            this.$refs.urlsInput.$refs.textbox.innerHTML = this.urlsInput = '';

            if (temp_valid_urls.length) {
                this.getInfoItems(temp_valid_urls.map(item => item.link))
                    .then(response => {
                        console.log('getInfoItems', response);
                        let temp_items = response.data.map(item => {
                            let hostname = this.validHttpUrl(item.link).hostname;
                            let social_host = this.social_hosts.find(host => hostname.includes(host));
                            if (social_host != undefined) {
                                item.type = 2;
                                item.category_id = this.social_category_ids?.[social_host];
                            }
                            if (item.published_at) {
                                item.published_at = new Date(item.published_at).format("Y-m-d h:i:s");
                            }

                            return item;
                        });
                        this.splitItems(temp_items);
                        if (this.urls.unknown_source.length) this.selected_tab = 4;
                    });
            }
        },
        splitItems(items) {
            items.forEach(item => {
                if (item?.source == undefined) {
                    this.urls.unknown_source.push(item);
                }
                else if (item.status == 'Found') {
                    this.urls.to_projects.push(item);
                }
                else {
                    this.urls.to_system.push(item);
                }
            });
            console.log('urls', this.urls)
        },
        validHttpUrl(string) {
            let url;
            
            try {
                url = new URL(string);
                if (url.protocol !== "http:" && url.protocol !== "https:") return {};
                return url 
            } catch (_) {
                return {};
            }
        },
    },
    computed: {
        all_urls_obj() {
            return [...new Set([
                ...this.urls.invalid.map(item => item.link),
                ...this.urls.to_system.map(item => item.link),
            ])].reduce((d,n) => ({...d,[n]: true}), {})
        },
        all_items_manually_obj() {
            return this.items_manually.map(item => item.link).reduce((d,n) => ({...d,[n]: true}), {})
        },
        selectedUrls() {
            return this.urls.to_projects.filter(item => item?.selected)
        },
        // async initProjects() {
        //     try {
        //         let response = await axios.get('/ru/project-search/getallprojects');

        //         return response.data;
        //     }
        //     catch (error) {
        //         console.log(error);
        //         return [];
        //     }
        // },
    },
    created() {
        this.initProjects();

        this.getItems(0, true)
            .then(response => {
                console.log('response', response);
            })
            .catch(error => console.log(error));

        this.getItems()
            .then(response => {
                console.log('response', response);
            })
            .catch(error => console.log(error));
    }
}
</script>


<style scoped>


div {
    line-height: 1;
}

#chatgpt-prompt-textarea:has(span:empty:not(:focus)) {
    border: 1px solid rgba(0,0,0,.1);
    overflow: hidden;
}
#chatgpt-prompt-textarea:has(span:empty) + span button {
    background: #d1d5db !important;
    border-color: #d1d5db !important;
    pointer-events: none;
}


</style>

<style>

.project-tag:not(:hover) .fa-xmark {
    opacity: .5;
    transform: scale(.5) !important;
}

.projects:not(:empty):not(:has( > .tags)) {
    padding-top: 4px !important;
}

/* .projects-container:not(:focus-within) .project-list {
    opacity: 0;
    pointer-events: none;
}

.projects-container:not(:focus-within) .projects {
    height: 33.19px;
} */
#project-list {
    left: 0;
    right: 0;
    background: white;
    z-index: 12;
    height: 200px;
    overflow: hidden;
    padding: 5px;
    border-radius: 5px;
    overflow-y: scroll;
    font-size: 14px;
}
.project-id-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 26px;
    cursor: pointer;
    padding: 7px;
    border-radius: 4px;
    margin-bottom: 3px;
}
.project-id-name:hover {
    background: #0000001a;
}

</style>
