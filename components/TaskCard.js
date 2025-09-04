// TaskCard.js: 個々のタスクカードを表すコンポーネント

export default {
    // 親コンポーネントから受け取るデータ
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    // コンポーネントのテンプレート (HTML)
    template: `
        <div class="task-card" draggable="true">
            <h3>{{ task.title }}</h3>
            <p v-if="task.description">{{ task.description }}</p>
        </div>
    `
};
