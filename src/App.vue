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
                        <i class="fa-solid fa-info"></i>
                        Info
                    </a>
                </li>
                <li v-if="items_manually.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-2">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/parsing.svg" alt="parsing icon">
                        Парсинг
                    </a>
                </li>
                <li>
                    <a class="nav-link" data-toggle="tab" href="#tab-3">
                        <img class="inline-block !max-w-[16px] mr-[4px]" src="./assets/svg/add-manually.svg" alt="add-manually icon">
                        Вручную
                    </a>
                </li>
                <li v-if="urls.invalid.length">
                    <a class="nav-link" data-toggle="tab" href="#tab-4">
                        <i class="fa-solid fa-triangle-exclamation text-[#f2b90a]"></i>
                    </a>
                </li>
            </ul>
            <div class="tab-content bg-white pb-[15px]">
                <div role="tabpanel" id="tab-1" class="tab-pane active">
                    <template v-if="urls.valid.length">
                        <h3 class="!text-[20px] mt-[10px] px-[15px] mx-[5px]">Добавить новые публикации:</h3>
                        <NewsTable :items="urls.valid" :inputProject="true" :only="{link: true, project_id: true}" />
                        <div class="flex items-center gap-x-[12px] px-[15px] mx-[5px]">
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls.valid.every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary ml-auto"
                                @click="add_items_manually"
                            >Добавить в ручную</button>
                            <button
                                type="button"
                                :class="{
                                    '!bg-gray-300 !border-gray-300 pointer-events-none': urls.valid.every(item => !item?.selected),
                                }"
                                class="btn btn btn-primary"
                            >Поставить на парсинг</button>
                        </div>
                    </template>
                    <div v-else>Вы не добавили ссылок</div>
                </div>
                <div role="tabpanel" id="tab-2" class="tab-pane">
                    <NewsTable :items="own_requests" />
                </div>
                <div role="tabpanel" id="tab-3" class="tab-pane" v-if="items_manually.length">
                    <NewsTable class="invalid-table" :items="items_manually" :only="{link: true, project_id: true}" />
                </div>
                <div role="tabpanel" id="tab-4" class="tab-pane" v-if="urls.invalid.length">
                    <NewsTable class="invalid-table" :withoutThead="true" :copy_link="true" :items="urls.invalid" :only="{link: true}" />
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
        let own_requests = this.shuffle([...(
            Array(25).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 13),
                r_type: 1,
                link: 'https://www.ami.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: 10189,
                status: 'Выполнен'
            }))
        ), ...(
            Array(25).fill(1).map((n,i) => ({
                type: this.getEvery(i+1, 10),
                r_type: 2,
                link: 'https://www.tiktok.com/@turarym/video/7210744343785688326',
                parsing: false,
                created_at: '2023-03-29 09:51:34',
                project_id: 10189,
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
        }
    },
    methods: {
        shuffle(array) {
            let currentIndex = array.length,  randomIndex;

            // While there remain elements to shuffle.
            while (currentIndex > 0) {

                // Pick a remaining element.
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }

            return array;
        },
        add_items_manually() {
            this.urls.valid.filter(item => item.selected).forEach(item => {
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
                    this.urls.valid.unshift({ link: url, r_type: 2 })
                }
                else {
                    this.urls.valid.unshift({ link: url, r_type: 1 })
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
                ...this.urls.valid.map(item => item.link),
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
