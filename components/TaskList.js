export default {
    props: {
        list: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isDragOver: false,
        };
    },
    methods: {
        // ドラッグ開始時の処理
        handleDragStart(event, task) {
            event.dataTransfer.effectAllowed = 'move';
            // ドラッグするタスクの情報をセット
            event.dataTransfer.setData('text/plain', JSON.stringify({
                taskId: task.id,
                fromListId: this.list.id,
            }));
        },
        // 要素がドロップゾーン上にある間の処理
        handleDragOver() {
            this.isDragOver = true;
        },
        // ドロップ時の処理
        handleDrop(event) {
            this.isDragOver = false;
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            // 親コンポーネントに 'move-task' イベントを送信
            this.$emit('move-task', {
                ...data,
                toListId: this.list.id,
            });
        },
        // ドラッグ中の要素がドロップゾーンから離れたときの処理
        handleDragLeave() {
            this.isDragOver = false;
        },
    },
    template: `
        <div class="task-list">
            <div class="task-list-header">
                 <h2>{{ list.title }}</h2>
                 <span class="task-count">{{ list.tasks.length }}</span>
            </div>
            <div class="task-cards"
                @dragover.prevent="handleDragOver"
                @drop="handleDrop"
                @dragleave="handleDragLeave"
                :class="{ 'drag-over': isDragOver }"
            >
                <task-card
                    v-for="task in list.tasks"
                    :key="task.id"
                    :task="task"
                    @dragstart="handleDragStart($event, task)"
                    @click="$emit('open-edit-task-modal', task)"
                ></task-card>
            </div>

        </div>
    `,
};

//  @click="$emit('open-edit-task-modal', task)"
// イベント（$emit）で渡されているのは、taskオブジェクトを指し示すメモリアドレス（鍵の情報）のコピーなのです。
