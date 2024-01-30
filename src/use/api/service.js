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
    return service.get(`/item?items_links=${items_links.join(',')}`)
}

export const getItems = (page_index = 0, item_count = false) => {
    return service.get(`/item/by_log?user_id=${user_id}&page_index=${page_index}&item_count=${item_count}`)
}

export const addToProjects = (items) => {

    let data = [];

    items.forEach(item => {

        if (item.selected && item.projects.length == 0) return;

        data.push(...item.projects
            .map(p_id => ({
                item_id: item.item.id,
                project_id: p_id,
                type: item.item.type,
            }))
        )
    });

    return service.post(`/project_item?user_id=${user_id}`, data)
}