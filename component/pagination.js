export default {
    props: ['pages'],
    template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
        <li :class="{ disabled: !pages.has_pre}" class="page-item">
            <a @click="$emit('get-products', pages.current_page - 1)" class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li :class="{ active: page === pages.current_page}" v-for="page in pages.total_pages" key="page+'123'" class="page-item">
            <a @click="$emit('get-products', page)" class="page-link" href="#">{{page}}</a>
        </li>
        <li :class="{ disabled: !pages.has_next}" class="page-item">
            <a  @click="$emit('get-products', pages.current_page + 1)" class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
    </nav>`
}