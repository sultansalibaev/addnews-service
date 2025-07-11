import axios from "axios"

const service = axios.create({
    baseURL: process.env.VUE_APP_SERVICE,
    // mode: 'no-cors',
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
    },
});

const user_id = (() => {
    let input = document.querySelector('#user_id'), value;

    value = input.value;
    input.remove();

    return value;
})();

export const getInfoItems = (items_links = []) => {
    if (items_links.length == 0) return;
    return service.get(`/addnews-service/item?items_links=${items_links.join(',')}`)
}

export const getItems = (page_index = 0, item_count = false) => {
    return service.get(`/addnews-service/item-by_log?user_id=${user_id}&page_index=${page_index}&item_count=${item_count}`)
}

export const addToProjects = (items) => {

    let data = [];

    items.forEach(item => {

        if (item.selected && item.projects.length == 0) return;

        data.push({
            item_id: item.item.id,
            project_id: item.projects.map(project => project?.id),
            type: item.item.type,
        });
    });

    console.log('addToProjects', data);

    // return service.post(`/project_item?user_id=${user_id}`, data)
}