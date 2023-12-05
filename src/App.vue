<template>
    <div class="p-[15px]">
        <div class="input-group h-full mb-[15px] flex items-end">
            <!-- <input class="form-control" type="url" placeholder="Введите URL-адрес новости (http://www.example.com)"> -->
            <div class="relative w-full h-[33.63px] z-10" id="chatgpt-prompt-textarea">
                <span tabindex="0" data-id="root" rows="1"
                        ref="urlsInput"
                        placeholder="Введите ссылку на публикацию"
                        class="chatgpt-textbox-scrollbar gray-scrollbar m-0 w-full resize-none border-0 focus:ring-0 focus-visible:ring-0 bg-white focus:outline-none !text-[14px] !py-[7.5px] !px-[10px] absolute top-0 left-0 right-0"
                        style="overflow-y: auto;max-height: 200px;min-height: 24px;line-height: 1.3;color: black;"
                        role="textbox" contenteditable='plaintext-only'></span>
            </div>
            <span class="input-group-btn mob-p-x-0" style="width: unset;">
                <button type="button" class="btn btn btn-primary" @click="add_urls">Добавить</button>
            </span>
        </div>
        <div class="tabs-container">
            <ul class="nav nav-tabs" role="tablist">
                <li class="active">
                    <a class="nav-link active" data-toggle="tab" href="#tab-1" aria-expanded="true">
                        <i class="fa fa-newspaper-o"></i>
                        СМИ
                    </a>
                </li>
                <li>
                    <a class="nav-link" data-toggle="tab" href="#tab-2">
                        <i class="fa fa-comments socials-icon"></i>
                        Соц. сети
                    </a>
                </li>
                <li v-if="items_manually.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-3">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/add-manually.svg" alt="add-manually icon">
                        Вручную
                    </a>
                </li>
                <li v-if="urls.invalid.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-4">
                        <i class="fa-solid fa-triangle-exclamation text-[#f2b90a]"></i>
                        Некорректные ссылки
                    </a>
                </li>
            </ul>
            <div class="tab-content bg-white pb-[15px]">
                <div role="tabpanel" id="tab-1" class="tab-pane active">
                    <NewsTable :r_type="1" :items="own_requests[0]" />
                    <template v-if="urls[1].length">
                        <h3 class="!text-[20px] mt-[10px] px-[15px] mx-[5px]">Добавить новые публикации:</h3>
                        <NewsTable :r_type="1" :items="urls[1]" :inputProject="true" :only="{link: true, project_id: true}" />
                        <div class="flex items-center gap-x-[12px] px-[15px] mx-[5px]">
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls[1].every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary ml-auto"
                                @click="add_items_manually(1)"
                            >Добавить в ручную</button>
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls[1].every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary"
                            >Поставить на парсинг</button>
                        </div>
                    </template>
                </div>
                <div role="tabpanel" id="tab-2" class="tab-pane">
                    <NewsTable :r_type="2" :items="own_requests[1]" />
                    <template v-if="urls[2].length">
                        <h3 class="!text-[20px] mt-[10px] px-[15px] mx-[5px]">Добавить новые публикации:</h3>
                        <NewsTable :r_type="2" :items="urls[2]" :inputProject="true" :only="{link: true, project_id: true}" />
                        <div class="flex items-center gap-x-[12px] px-[15px] mx-[5px]">
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls[2].every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary ml-auto"
                                @click="add_items_manually(2)"
                            >Добавить в ручную</button>
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls[2].every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary"
                            >Поставить на парсинг</button>
                        </div>
                    </template>
                </div>
                <div role="tabpanel" id="tab-3" class="tab-pane" v-if="items_manually.length">
                    <NewsTable class="invalid-table" :r_type="0" :items="items_manually" :only="{link: true, project_id: true}" />
                </div>
                <div role="tabpanel" id="tab-4" class="tab-pane" v-if="urls.invalid.length">
                    <NewsTable class="invalid-table" :r_type="0" :withoutThead="true" :copy_link="true" :items="urls[2]" :only="{link: true}" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NewsTable from './components/NewsTable.vue';

export default {
    name: 'App',
    components: {
        NewsTable,
    },
    data() {
        let own_requests = [(
            Array(50).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 13),
                link: 'https://www.tiktok.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: 10189,
                status: 'Выполнен'
            }))
        ), (
            Array(50).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 10),
                link: 'https://www.tiktok.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: 10189,
                status: 'Выполнен'
            }))
        )];

        return {
            urls: {
                invalid: [],
                1: [],
                2: []
            },
            social_hosts: ['facebook','vk.com','twitter.com','instagram.com','youtube.com','ok.ru','t.me','tiktok.com'],
            own_requests,
            items_manually: [],
        }
    },
    methods: {
        add_items_manually(r_type) {
            this.urls[r_type].filter(item => item.selected).forEach(item => {
                if (this.all_items_manually_obj[item.link]) return;
                this.items_manually.unshift(item);
            })
        },
        getEvery(num, every) {
            return num > every ? num - (every * parseInt(num / every)) || every : num
        },
        add_urls() {
            this.$refs.urlsInput.textContent.trim().split('\n').forEach(url => {

                url = url.trim();

                if (this.all_urls_obj[url] || !url) return;

                let hostname = this.validHttpUrl(url).hostname;
                
                if (!hostname) {
                    this.urls.invalid.unshift({ link: url })
                }
                else if (this.social_hosts.some(host => hostname.includes(host))) {
                    this.urls[2].unshift({ link: url })
                }
                else {
                    this.urls[1].unshift({ link: url })
                }
            });
            
            this.$refs.urlsInput.innerHTML = '';
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
                ...this.urls[1].map(item => item.link),
                ...this.urls[2].map(item => item.link),
            ])].reduce((d,n) => ({...d,[n]: true}), {})
        },
        all_items_manually_obj() {
            return this.items_manually.map(item => item.link).reduce((d,n) => ({...d,[n]: true}), {})
        },
    },
}
</script>


<style scoped>


div {
    line-height: 1;
}

#chatgpt-prompt-textarea:has(span:empty) + span button {
    background: #d1d5db !important;
    border-color: #d1d5db !important;
    pointer-events: none;
}


</style>
