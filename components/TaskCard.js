export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    template: `
        <div
            class="task-card"
            draggable="true"
            @dragstart.stop="$emit('dragstart', $event)"
            @click="$emit('click')"
        >
            <p class="task-title">{{ task.title }}</p>
            <!-- ★★★ここから変更：締切日がある場合のみ表示★★★ -->
            <div v-if="task.deadline" class="task-deadline">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ task.deadline }}</span>
            </div>
            <!-- ★★★ここまで変更★★★ -->
        </div>
    `,
};

