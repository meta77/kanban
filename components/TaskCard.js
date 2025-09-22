export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    // ★ @click="$emit('click')" で親にクリックイベントを通知
    template: `
        <div
            class="task-card"
            draggable="true"
            @dragstart.stop="$emit('dragstart', $event)"
            @click="$emit('click')"
        >
            <p class="task-title">{{ task.title }}</p>
            <!-- 説明文がある場合のみ表示 -->
            <p v-if="task.description" class="task-description">{{ task.description }}</p>
        </div>
    `,
};



