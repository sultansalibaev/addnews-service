<template>
    <div class="bg-white py-[15px] relative">
        <div class="panel-body !border-none !pt-[2px] !pb-0 !px-[15px] mx-[5px] scrollbar max-h-[300px] overflow-y-scroll overflow-x-hidden">
            <table>
                <thead :class="{
                    withoutThead: withoutThead
                }">
                    <tr>
                        <th v-if="columns.type">Тип</th>
                        <th v-if="columns.link" class="!text-left head-url">URL</th>
                        <th v-if="columns.parsing" class="min-w-[123.19px]">На парсинге</th>
                        <th v-if="columns.created_at" class="min-w-[174.57px]">Дата создания</th>
                        <th v-if="columns.project_id" class="min-w-[110.17px]">ID-проекта</th>
                        <th v-if="columns.status">Статус</th>
                    </tr>
                </thead>
                <TransitionGroup name="list" tag="tbody" class="scrollbar max-h-[500px] select-none">
                    <tr class="h-[10px] pointer-events-none"></tr>
                    <tr
                        v-for="(item, index) in items"
                        :key="item.link"
                        @click="$emit('select-item', $event, index)"
                        :class="{
                            relative: selectable || copy_link
                        }"
                    >
                        <td v-if="columns.type" class="type-icon flex justify-center">
                            <i class="fa fa-newspaper-o text-[19px] pt-[3px]" v-if="item.r_type == 1"></i>
                            <img
                                :src="`/media/img/resource_logo/${item.type}.png`"
                                style="width: 24px;"
                                v-else-if="item.r_type == 2"
                            />
                        </td>
                        <td
                            class="!text-left truncate body-url"
                            :class="{
                                'relative !pr-[40px]': copy_link
                            }"
                        >
                            <input
                                v-if="selectable"
                                type="checkbox"
                                class="!mr-[10px] !mt-[-3px] align-middle"
                                v-model="item.selected"
                            />
                            <!-- text-[#4e94d0] text-[#529ddd] -->
                            <a
                                class="truncate"
                                :class="{
                                    'transition-all hover:underline hover:text-[#337ab7]': !selectable
                                }"
                                target="_blank"
                                :href="selectable ? undefined : item.link"
                                :title="item.link"
                            >{{ item.link }}</a>
                            <i
                                v-if="copy_link"
                                class="fa fa-copy absolute right-[16px] cursor-pointer"
                                @click="copyLink(item.link)"
                            ></i>
                        </td>
                        <td v-if="columns.parsing">{{ item.parsing ? 'Да' : 'Нет' }}</td>
                        <td v-if="columns.created_at">{{ item.created_at }}</td>
                        <td
                            v-if="columns.project_id"
                            :title="item.project_id"
                            class="truncate max-w-[110px]"
                        >{{ (item?.project_id?.join(', ') ?? 'Не указан') }}</td>
                        <td v-if="columns.status" class="whitespace-nowrap">{{ item.status ?? 'Не найден' }}</td>
                        <i
                            v-if="selectable || copy_link"
                            class="fa-solid fa-xmark
                                absolute top-[-5px] right-[-5px] transition-all
                                bg-[#ec5e5e] text-white text-[14px] cursor-pointer pt-[2px]
                                flex w-[1.35em] h-[1.35em] items-center justify-center rounded-full"
                            @click.stop="$emit('remove-item', index)"></i>
                    </tr>
                    <tr class="h-[10px] pointer-events-none"></tr>
                </TransitionGroup>
            </table>
        </div>
        <div class="absolute top-[15px] right-[20px] left-[20px]" style="box-shadow: white 0px 0px 8px 8px;"></div>
        <div class="absolute bottom-[15px] right-[20px] left-[20px]" style="box-shadow: white 0px 0px 8px 8px;"></div>
    </div>
</template>

<script>

export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        only: {
            type: Object,
            required: false,
            default() {
                return {}
            },
        },
        setColumns: {
            type: Object,
            required: false,
            default() {
                return {}
            },
        },
        withoutThead: {
            type: Boolean,
            required: false,
            default: false
        },
        selectable: {
            type: Boolean,
            required: false,
            default: false
        },
        copy_link: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data() {
        let columns = {
            type: true,
            link: true,
            parsing: true,
            created_at: true,
            project_id: true,
            status: true
        };

        if (Object.keys(this.setColumns).length) {
            for (const key in this.setColumns) {
                columns[key] = this.setColumns[key];
            }
        }

        if (this.only.length) columns = this.only.reduce((d,key) => ({...d, [key]: true}), {});

        return {
            columns: columns,
            lastSelectedIndex: undefined,
        }
    },
    methods: {
        getEvery(num, every) {
            return num > every ? num - (every * parseInt(num / every)) || every : num
        },
        copyLink(link) {
            let tmp = document.createElement("INPUT");
            tmp.value = link;

            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand("copy");
            document.body.removeChild(tmp);
        },
        sortBy() {
            // let counter = 0;

            // '0123456789'.split('').reverse().sort((a, b) => {
            //     console.log(++counter)
            //     return a - b
            // })

            let counter = 0;

            let arr = '0123456789'.split('').map(n => ({i:+n, hide: false}));

            console.log('default arr is', arr.map(obj => obj.i))

            function sortBy(field) {
                return function(a, b) {

                    console.log(++counter)

                    a.hide = ((a[field] % 2) == 0);
                    b.hide = ((b[field] % 2) == 0);

                    if (a[field] > b[field]) {
                    return -1;
                    } else if (a[field] < b[field]) {
                    return 1;
                    }
                    return 0;
                };
            }

            arr.sort(sortBy('i'))
        },
    }
}
</script>

<style scoped>

td, th {
    padding: 7px 26px 7px 0;
    text-align: center;
}
th {
    padding-top: 13px;
    padding-bottom: 12px;
    font-size: 14px;
}
td {
    height: 38px;
    font-size: 13px;
}
tr:not(:hover) .fa-xmark {
    opacity: .2;
    transform: scale(.7);
}
thead {
    box-shadow: 0px 2px 6px 0px #b4b3b3;
    position: sticky;
    top: 0;
    z-index: 1;
    background: white;
    border-radius: 8px;
}

th:nth-child(2) ~ th {
    width: 12%;
}

tbody tr:nth-child(even) td {
    background: #e7eaec8a;
}
tbody tr:first-child td {
    overflow: hidden;
}
thead tr th:first-child,
tbody tr td:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    padding-left: 15px;
}
thead tr th:last-child,
tbody tr td:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}
tbody tr:hover td {
    background: #e7eaec;
}
.head-url {
    max-width: clamp(200px, 930px, 930px);
}
.body-url {
    width: 100%;
    max-width: clamp(200px, 200px, 930px);
}

.type-icon i,
.type-icon img {
    transition: .35s all !important;
}
.type-icon:hover i,
.type-icon:hover img {
    transform: scale(1.4);
}

.withoutThead tr th {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    overflow: hidden;
    line-height: 0px !important;
}

</style>