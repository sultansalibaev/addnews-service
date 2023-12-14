<template>
    <div class="p-[15px]" @click="project_list_modal = false">
        <div class="input-group h-full mb-[15px] flex items-end">
            <!-- <input class="form-control" type="url" placeholder="Введите URL-адрес новости (http://www.example.com)"> -->
            <div class="relative w-full h-[33.63px] z-10" id="chatgpt-prompt-textarea">
                <ResizableField
                    :ref="'urlsInput'"
                    :placeholder="'Введите ссылку на публикацию'"
                    class="max-h-[200px] min-h-[24px] [&:not(:focus)]:!max-h-[39.86px]"
                ></ResizableField>
            </div>
            <span class="input-group-btn mob-p-x-0" style="width: unset;">
                <button type="button" class="btn btn-primary" @click="add_urls">Добавить</button>
            </span>
        </div>
        <div class="tabs-container">
            <ul class="nav nav-tabs" role="tablist">
                <li class="active">
                    <a class="nav-link active" data-toggle="tab" href="#tab-1" aria-expanded="true">
                        <i class="fa-solid fa-info"></i>
                        Инфо
                    </a>
                </li>
                <li v-if="own_requests.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-2">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/parsing.svg" alt="parsing icon">
                        Парсинг
                    </a>
                </li>
                <li v-if="items_manually.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-3">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/add-manually.svg" alt="add-manually icon">
                        Вручную
                    </a>
                </li>
                <li v-if="urls.invalid.length" class="!float-right">
                    <a class="nav-link" data-toggle="tab" href="#tab-4">
                        <i class="fa-solid fa-triangle-exclamation text-[#f2b90a] !scale-[1.4]"></i>
                    </a>
                </li>
            </ul>
            <div class="tab-content bg-white pb-[15px]">
                <div role="tabpanel" id="tab-1" class="tab-pane active" v-show="urls.valid.length">
                    <div class="flex justify-between items-center mt-[18px] px-[15px] mx-[5px] h-[33.63px]">
                        <h3 class="!text-[20px]">Добавить новые публикации:</h3>
                        <div
                            v-show="selectedUrls.some(item => !item?.project_id?.length)"
                            class="flex flex-grow-[1] items-center justify-end gap-[12px]"
                        >
                            <div
                                class="relative h-[33.19px] z-[9] max-w-[270px] w-full projects-container"
                                @click.stop="project_list_modal = true"
                            >
                                <ResizableField
                                    :ref="'projects'"
                                    :contenteditable="true"
                                    :placeholder="'Введите название либо ID-проекта'"
                                    @input="inputProject"
                                    class="h-[100px] projects"
                                    :class="{
                                        '!h-[33.19px]': !project_list_modal,
                                    }"
                                >
                                    <!-- [&:not(:empty)]:!pt-0 -->
                                    <TransitionGroup name="tags" tag="span" contenteditable="false" class="tags select-none">
                                        <span v-for="(p_id, index) in selected_project_ids" :key="p_id" class="inline-block">
                                            <span
                                                class="project-tag bg-gray-400 text-white rounded-[5px] px-[5px] inline-flex h-[18px] mb-px items-center relative z-[8]"
                                            >{{p_id}}<i
                                                class="
                                                    fa-solid fa-xmark scale-[.7] absolute top-[-8px] right-[-8px]
                                                    transition-all bg-[#ec5e5e] text-white text-[14px] cursor-pointer pt-[2px]
                                                    flex w-[1.35em] h-[1.35em] items-center justify-center rounded-full
                                                "
                                                @click="removeSelectedProject(index)"
                                            ></i></span>
                                            <span class="font-bold text-[18px]">,</span>&nbsp;
                                        </span>
                                    </TransitionGroup>
                                </ResizableField>
                                <div
                                    id="project-list"
                                    class="absolute top-[100px] h-[200px] ring-0 chatgpt-textbox-scrollbar gray-scrollbar"
                                    :class="{
                                        'hidden': !project_list_modal,
                                    }"
                                    @scroll="onScroll"
                                >
                                    <div
                                        v-for="project in temp_project_ids"
                                        :key="project.id"
                                        class="project-id-name"
                                        @click.stop="addProject(project.name);project_list_modal = false"
                                    ><b v-if="isNumber(inputProject)">{{ project.id }}:&nbsp;</b>{{ project.name }}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                class="btn btn-default"
                                @click="input_project = ''"
                            >Отмена</button>
                            <button
                                type="button"
                                class="btn btn-primary"
                                @click="input_project = ''"
                            >Применить</button>
                        </div>
                    </div>
                    <NewsTable @select-item="selectItem" @remove-item="removeItem" :items="urls.valid" :selectable="true" :only="['link', 'project_id', 'status']" />
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
                        >Поставить на парсинг</button>
                    </div>
                </div>
                <div role="tabpanel" id="tab-1" class="tab-pane active" v-show="!urls.valid.length">
                    <div>Вы не добавили ссылок</div>
                </div>
                <div role="tabpanel" id="tab-2" class="tab-pane">
                    <NewsTable :items="own_requests" />
                </div>
                <div role="tabpanel" id="tab-3" class="tab-pane" v-if="items_manually.length">
                    <NewsTable class="invalid-table" @remove-item="removeManuallyItem" :items="items_manually" :only="['link', 'project_id']" />
                </div>
                <div role="tabpanel" id="tab-4" class="tab-pane" v-if="urls.invalid.length">
                    <NewsTable class="invalid-table" :withoutThead="true" :copy_link="true" :items="urls.invalid" :only="['link']" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NewsTable from './components/NewsTable.vue';
import ResizableField from './components/ui/ResizableField.vue';
import axios from 'axios'
import '@/use/utils'

export default {
    name: 'App',
    components: {
        NewsTable,
        ResizableField,
    },
    data() {
        function randomInt(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        function randomProjects() {
            return Array(randomInt(1,3)).fill(''+randomInt(10116,10189))
        }
        let own_requests = this.shuffle([...(
            Array(25).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 13),
                r_type: 1,
                link: 'https://www.ami.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: randomProjects(),
                status: 'Выполнен'
            }))
        ), ...(
            Array(25).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 10),
                r_type: 2,
                link: 'https://www.tiktok.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: randomProjects(),
                status: 'Выполнен'
            }))
        )]);

        return {
            urls: {
                invalid: [],
                valid: [],
            },
            social_hosts: ['facebook','vk.com','twitter.com','instagram.com','youtube.com','ok.ru','t.me','tiktok.com'],
            own_requests,
            items_manually: [],
            selectProjects: false,
            project_ids: [],
            sorted_project_ids: [],
            temp_project_ids: [],
            project_list_modal: false,
            selected_project_ids: [6816,6871,45348,2964,578694],
            input_project: '',
            toUndo: {
                historyRedo: true,
                deleteWordBackward: true,
                deleteWordForward: true,
                deleteContentBackward: true,
                deleteContentForward: true
            },
            typingTimer: 0,
            doneTypingInterval: 1000,
        }
    },
    methods: {
        addProject(project) {
            console.log('project', project);
            this.input_project = '';
            this.selected_project_ids.push(project);
        },
        isInteger(value) {
            return /^\d+$/.test(value);
        },
        isNumber(value) {
            return !Number.isNaN(Number(value));
        },
        inputInteger(event) {
            // this.isInteger(event.data)
            if (event.data === null && event.inputType === 'deleteContentBackward') {
                this.input_project = this.input_project.slice(0, -1);
            }
            else if (event.inputType === 'insertText') {
                this.input_project += event.data;
            }
        },
        removeSelectedProject(index) {
            this.selected_project_ids.splice(index, 1);
            if (this.selected_project_ids.length === 0) {
                let projects = this.$refs.projects;
                projects.innerHTML = this.input_project;
            }
        },
        inputProject(event) {
            if (
                this.input_project === '' &&
                event.type === "input" &&
                this.toUndo[event.inputType]
            ) {
                document.execCommand('undo', false, null);
                return;
            }
            let project = this.$refs.projects.textContent.trim();
            this.selected_project_ids.forEach(p_id => {
                project = project.replace(`${p_id},`, '');
            });

            project = project.trim();
            if (project.at(0) === ',') project = project.slice(1).trim();

            let old_input_project = this.input_project;
            this.input_project = project;

            clearTimeout(this.typingTimer);
			this.typingTimer = setTimeout(() => {
                this.sort_project_ids(old_input_project)
            }, this.doneTypingInterval);
        },
        sort_project_ids(old_input_project) {

            if (this.input_project == old_input_project) return;

            if (this.input_project == '') {
                this.sorted_project_ids = this.project_ids.slice();
                this.update_temp_project_ids();
                return;
            }

            let temp_sorted_projects;

            if (this.input_project.startsWith(old_input_project)) {
                temp_sorted_projects = this.sorted_project_ids.slice();
            }
            else {
                temp_sorted_projects = this.project_ids.slice();
            }

            let param = 'id';
            if (Number.isNaN(Number(this.input_project))) param = 'name';

            this.sorted_project_ids = temp_sorted_projects
                .filter(item => (item?.[param] || '').lowerIncludes(this.input_project))
                .sort((a,b) => {
                    const a_index = a?.[param]?.indexOf(this.input_project);
                    const b_index = b?.[param]?.indexOf(this.input_project);
                    return a_index < b_index ? -1 : 0
                });
            this.update_temp_project_ids();
        },
        update_temp_project_ids() {
            this.temp_project_ids = this.sorted_project_ids.slice(0, 50)
        },
        isInViewport(el) {
            const rect = el.getBoundingClientRect();

            var isinview = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)

            );

            return isinview;
        },
        onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (scrollTop + clientHeight >= scrollHeight-32) {
                this.get_more_temp_project_ids()
            }
        },
        get_more_temp_project_ids() {
            let temp_projects_length = this.temp_project_ids.length;
            console.log('before', this.temp_project_ids);
            this.temp_project_ids.push(...this.sorted_project_ids.slice(temp_projects_length, temp_projects_length + 50))
            console.log('after', this.temp_project_ids, this.sorted_project_ids.slice(temp_projects_length, temp_projects_length + 50));
            console.log('lengths', this.temp_project_ids.length, this.sorted_project_ids.length);
        },
        selectItem(event, index) {
            if (!event.shiftKey) this.urls.valid[index].selected = !this.urls.valid[index].selected;

            let start = this.lastSelectedIndex, end = index;

            if (event.shiftKey && this.lastSelectedIndex > index) {
                start = index;
                end = this.lastSelectedIndex;
            }

            const bool = this.urls.valid.slice(start, end+1).some(temp => !temp.selected);

            if (this.lastSelectedIndex != undefined && event.shiftKey) {
                for (let i = start; i <= end; i++) {
                    this.urls.valid[i].selected = bool;
                }
            }

            if (!event.shiftKey) this.lastSelectedIndex = index;
        },
        removeItem(itemIndex) {
            if (itemIndex > -1) this.urls.valid.splice(itemIndex, 1)
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
            this.urls.valid.filter(item => item.selected).forEach(item => {
                if (this.all_items_manually_obj[item.link]) return;
                this.items_manually.unshift(item);
            })
            this.urls.valid = this.urls.valid.filter(item => !item.selected)
        },
        getEvery(num, every) {
            return num > every ? num - (every * parseInt(num / every)) || every : num
        },
        add_urls() {
            let urlsInput = this.$refs.urlsInput;
            urlsInput.textContent.trim().split('\n').forEach(url => {

                url = url.trim();

                if (this.all_urls_obj[url] || !url) return;

                let hostname = this.validHttpUrl(url).hostname;
                
                if (!hostname) {
                    this.urls.invalid.unshift({ link: url })
                }
                else if (this.social_hosts.some(host => hostname.includes(host))) {
                    this.urls.valid.unshift({ link: url, r_type: 2 })
                }
                else {
                    this.urls.valid.unshift({ link: url, r_type: 1 })
                }
            });
            
            urlsInput.innerHTML = '';
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
                ...this.urls.valid.map(item => item.link),
            ])].reduce((d,n) => ({...d,[n]: true}), {})
        },
        all_items_manually_obj() {
            return this.items_manually.map(item => item.link).reduce((d,n) => ({...d,[n]: true}), {})
        },
        selectedUrls() {
            return this.urls.valid.filter(item => item?.selected)
        },
        // show_selected_project_ids() {
        //     let removeIcon = `<i
        //         class="
        //             fa-solid fa-xmark scale-[.7] absolute top-[-8px] right-[-8px]
        //             transition-all bg-[#ec5e5e] text-white text-[14px] cursor-pointer pt-[2px]
        //             flex w-[1.35em] h-[1.35em] items-center justify-center rounded-full
        //         "
        //         onclick="event.target.parentElement.parentElement.remove()"
        //     ></i>`;
        //     return this.selected_project_ids.map(p_id => (
        //         `<span class="project-tag" contenteditable="false"><span
        //             class="bg-gray-400 text-white rounded-[5px] px-[5px] inline-flex h-[18px] mb-px items-center relative z-[8]"
        //         >${p_id}${removeIcon}</span><span class="font-bold text-[18px]">,</span>&nbsp;</span>`
        //     )).join('');
        // },
    },
    mounted() {
        axios.get('/ru/project-search/getallprojects')
            .then(response => {
                this.sorted_project_ids = this.project_ids = response.data;
                this.update_temp_project_ids();

                // console.log('project-list', document.querySelector('#project-list'));

                // let options = {
                //     root: document.querySelector('#project-list'),
                //     rootMargin: "0px",
                //     threshold: 1.0,
                // };
                
                // const callback = (entries, observer) => {
                //     console.log(entries);
                //     console.log(observer);
                //     if (entries[0].isIntersecting || Object.values(entries[0].intersectionRect).every(n => n == 0)) {
                //         this.get_more_temp_project_ids();
                //     }
                // }
        
                // let observer = new IntersectionObserver(callback, options);
                // console.log('observer', observer);
                // observer.observe(this.$refs.observer)
            })
            .catch(error => console.log(error))
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

.projects:has( > .tags) {
    padding-top: 0 !important;
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
}
.project-id-name:hover {
    background: #0000001a;
}

</style>
