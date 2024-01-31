import { reactive, ref, computed } from "vue";

export const tags_loading = reactive(ref(false));
export const tags = reactive(ref([]));
export const searched_tags = reactive(ref([]));
export const sliced_tags = reactive(ref([]));
export const selected_tags = reactive(ref([]));
export const previously_selected_tags = reactive(ref([]));

export const hasPreviouslySelectedTags = computed(() => {
    const previously_selected_tag_ids = previously_selected_tags.value
        .reduce((obj, tag) => ({...obj, [tag?.id]: true}), {});

    return selected_tags.value.every(tag => previously_selected_tag_ids[tag?.id]);
});

export function sliceTags() {
    sliced_tags.value = searched_tags.value.slice(0, 50);
    tags_loading.value = false;
}

export function getMoreTags() {
    let length = sliced_tags.value.length;
    sliced_tags.value.push(
        ...searched_tags.value.slice(length, length + 50)
    )
}

export function searchTags(search, old_search, params) {

    let { id_key, text_key } = {
        id_key: 'id',
        text_key: 'name',
        ...params,
    };

    if (search == old_search) return;

    if (search == '') {
        searched_tags.value = tags.value.slice();
        sliceTags();
        return;
    }

    tags_loading.value = true;

    let temp_searched_tags;

    if (search.startsWith(old_search)) {
        temp_searched_tags = searched_tags.value.slice();
    }
    else {
        temp_searched_tags = tags.value.slice();
    }

    let param = id_key;
    if (Number.isNaN(Number(search))) param = text_key;

    temp_searched_tags = temp_searched_tags
        .filter(item => (item?.[param] || '').lowerIncludes(search));

    temp_searched_tags.sort((a,b) => {
        const a_index = a?.[param]?.indexOfLowerCase(search);
        const b_index = b?.[param]?.indexOfLowerCase(search);
        return a_index - b_index
    });

    searched_tags.value = temp_searched_tags;
    sliceTags();
}

export function toggleTag(project) {
    if (project.selected) {
        removeTag(selected_tags.value.indexOf(project));
    }
    else {
        addTag(project);
    }
}

export function removeTag(index) {
    selected_tags.value[index].selected = false;
    selected_tags.value.splice(index, 1);
}

export function addTag(project) {
    project.selected = true;
    if (!selected_tags.value.includes(project)) selected_tags.value.push(project);
}

export function addPreviouslySelectedTags(projects) { // tagify
    previously_selected_tags.value = [];

    projects.forEach(project => {
        project.selected = true;

        if (!selected_tags.value.includes(project)) selected_tags.value.push(project);

        if (!previously_selected_tags.value.includes(project)) previously_selected_tags.value.push(project);
    });
}

export function clearSelectedTags() {
    selected_tags.value = selected_tags.value.filter(project => {
        return (project.selected = false);
    })
    previously_selected_tags.value = previously_selected_tags.value.filter(project => {
        return (project.selected = false);
    })
}
