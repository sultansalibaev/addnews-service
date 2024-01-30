import axios from "axios";
import { tags, searched_tags, sliceTags } from "../data/tags";

export function initProjects() {
    axios.get('/project-search/getallprojects')
            .then(response => {
                searched_tags.value = tags.value = response.data;
                sliceTags();
            })
            .catch(error => console.log(error))
}