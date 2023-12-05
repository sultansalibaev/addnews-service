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
                <tbody class="scrollbar max-h-[500px]">
                    <tr class="h-[10px] pointer-events-none"></tr>
                    <tr v-for="(item, index) in items" :key="index" @click="item.selected = !item.selected">
                        <td v-if="columns.type" class="type-icon flex justify-center">
                            <img
                                :src="
                                    [5,1].includes(item.type)
                                        ? '/media/img/resource_logo/no-image.png'
                                        : `/media/img/resource_logo/smi/${item.type}.${item.type == 2 ? 'png' : 'svg'}`
                                "
                                style="width: 24px;"
                                v-if="r_type == 1"
                            />
                            <img
                                :src="`/media/img/resource_logo/${item.type}.png`"
                                style="width: 24px;"
                                v-else-if="r_type == 2"
                            />
                        </td>
                        <td
                            class="!text-left truncate body-url"
                            :class="{
                                'relative !pr-[40px]': copy_link
                            }"
                        >
                            <input v-if="inputProject" type="checkbox" class="!mr-[10px]" v-model="item.selected" />
                            <!-- text-[#4e94d0] text-[#529ddd] -->
                            <a
                                class="truncate"
                                :class="{
                                    'transition-all hover:underline hover:text-[#337ab7]': !inputProject
                                }"
                                target="_blank"
                                :href="inputProject ? undefined : item.link"
                                :title="item.link"
                            >{{ item.link }}</a>
                            <i v-if="copy_link" class="fa fa-copy absolute right-[16px] cursor-pointer" @click="copyLink(item.link)"></i>
                        </td>
                        <td v-if="columns.parsing">{{ item.parsing ? 'Да' : 'Нет' }}</td>
                        <td v-if="columns.created_at">{{ item.created_at }}</td>
                        <td v-if="inputProject">
                            <input
                                type="text"
                                class="w-[100px] rounded-[4px] p-[3px] text-center focus:outline-none"
                                style="box-shadow: 0 0 7px rgb(0 0 0 / 20%);"
                                v-model="item.project_id"
                                @click.stop
                            />
                        </td>
                        <td v-else-if="columns.project_id">{{ item.project_id }}</td>
                        <td v-if="columns.status">{{ item.status }}</td>
                    </tr>
                    <tr class="h-[10px] pointer-events-none"></tr>
                </tbody>
            </table>
        </div>
        <div class="absolute top-[15px] right-[20px] left-[20px]" style="box-shadow: white 0px 0px 8px 8px;"></div>
        <div class="absolute bottom-[15px] right-[20px] left-[20px]" style="box-shadow: white 0px 0px 8px 8px;"></div>
    </div>
</template>

<script>

export default {
    props: {
        r_type: {
            type: Number,
            required: true
        },
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
        inputProject: {
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

        if (Object.keys(this.only).length) columns = this.only;

        return {
            columns: columns
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

.type-icon img {
    transition: .35s all;
}
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