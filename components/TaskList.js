// TaskList.js: 各リスト（TODO, In Progressなど）を表すコンポーネント

export default {
    // 親コンポーネントから受け取るデータ (プロパティ)
    props: {
        list: {
            type: Object,
            required: true,
        },
    },
    template: `
        <div
            class="task-list"
            @dragover.prevent="handleDragOver"
            @drop="handleDrop"
            :class="{ 'drag-over': isDragOver }"
        >
            <div class="task-list-header">
                <h2>{{ list.title }}</h2>
                <button class="delete-button">×</button>
            </div>

            <!-- task-cardコンポーネントをタスクの数だけ繰り返し表示 -->
            <div class="task-cards">
                <task-card
                    v-for="task in list.tasks"
                    :key="task.id"
                    :task="task"
                    @dragstart="handleDragStart($event, task)"
                ></task-card>
            </div>

            <!-- タスク追加フォーム -->
            <form @submit.prevent="addTask" class="add-task-form">
                <input type="text" v-model="newTaskTitle" placeholder="新しいタスクを追加..." required>
                <button type="submit" class="button-solid">追加</button>
            </form>
        </div>
    `,
    data() {
        return {
            newTaskTitle: '', // フォーム入力用のデータ
            isDragOver: false, // ドラッグ中かどうかを示すフラグ
        }
    },
    methods: {
        // タスク追加フォームが送信されたときの処理
        addTask() {
            if (this.newTaskTitle.trim() === '') return;

            // 親コンポーネントに 'add-task' イベントを通知 (emit)
            this.$emit('add-task', {
                title: this.newTaskTitle,
                listId: this.list.id,
            });

            this.newTaskTitle = ''; // フォームをクリア
        },

        // --- ドラッグ＆ドロップ関連のメソッド ---

        // タスクのドラッグが開始されたとき
        handleDragStart(event, task) {
            // ドラッグするデータの種類と値を設定
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('task-id', task.id);
            event.dataTransfer.setData('from-list-id', this.list.id);
        },

        // 要素がドロップゾーン上にあるとき
        handleDragOver(event) {
            this.isDragOver = true;
        },

        // 要素がドロップされたとき
        handleDrop(event) {
            this.isDragOver = false;
            const taskId = parseInt(event.dataTransfer.getData('task-id'));
            const fromListId = parseInt(event.dataTransfer.getData('from-list-id'));

            // 親にタスク移動イベントを通知
            this.$emit('move-task', {
                taskId: taskId,
                fromListId: fromListId,
                toListId: this.list.id,
            });
        },
    }
};

