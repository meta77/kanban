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
            // ★ドラッグ中のカードがどのカードの上にあるかを保持
            draggedOverTaskId: null,
        };
    },
    methods: {
        handleDragStart(event, task) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', JSON.stringify({
                taskId: task.id,
                fromListId: this.list.id,
            }));
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        // ★ドロップ時の処理を更新
        handleDrop(event) {
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const toListId = this.list.id;

            // 同じリスト内でのドロップかを判定
            if (data.fromListId === toListId) {
                // 同じリストなら「並び替え」イベントを発生させる
                // ドロップ先のカードがあり、かつ自分自身の上ではない場合
                if (this.draggedOverTaskId && this.draggedOverTaskId !== data.taskId) {
                    this.$emit('reorder-task', {
                        listId: toListId,
                        draggedTaskId: data.taskId,
                        targetTaskId: this.draggedOverTaskId,
                    });
                }
            } else {
                // 違うリストなら、これまで通り「移動」イベントを発生させる
                this.$emit('move-task', { ...data, toListId });
            }

            // 状態をリセット
            this.isDragOver = false;
            this.draggedOverTaskId = null;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        // ★ドラッグ中の要素が他のカードの上に入ったときの処理
        handleDragEnterTask(targetTask) {
            if (this.draggedOverTaskId !== targetTask.id) {
                this.draggedOverTaskId = targetTask.id;
            }
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
                    @dragenter-task="handleDragEnterTask(task)"
                ></task-card>
            </div>
        </div>
    `,
};


//  @click="$emit('open-edit-task-modal', task)"
// イベント（$emit）で渡されているのは、taskオブジェクトを指し示すメモリアドレス（鍵の情報）のコピー。
