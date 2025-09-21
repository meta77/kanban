export default {
    props: {
        list: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            newTaskTitle: '',
            isAddingTask: false, // ★フォームの表示状態を管理するフラグ
            isDragOver: false,
        };
    },
    methods: {
        // 新しいタスクを追加する
        addTask() {
            // タイトルが空か、空白のみの場合は処理しない
            if (this.newTaskTitle.trim() === '') return;

            // 親コンポーネントに 'add-task' イベントを送信
            this.$emit('add-task', {
                listId: this.list.id,
                title: this.newTaskTitle,
            });

            // フォームの状態をリセットして閉じる
            this.newTaskTitle = '';
            this.isAddingTask = false;
        },
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
                 <!-- リスト内のタスク数を表示 -->
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
                ></task-card>
            </div>

            <!-- ★★★ここから変更：タスク追加UIエリア★★★ -->
            <!-- v-if を使って、'TODO'リストの時だけこのエリアを表示 -->
            <div class="add-task-area" v-if="list.title === 'TODO'">

                <!-- isAddingTaskがfalseの時（普段の状態） -->
                <div v-if="!isAddingTask" @click="isAddingTask = true" class="add-task-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>カードを追加</span>
                </div>

                <!-- isAddingTaskがtrueの時（追加ボタンクリック後） -->
                <form v-else @submit.prevent="addTask" class="add-task-form-new">
                    <textarea v-model="newTaskTitle" placeholder="このカードのタイトルを入力..." required class="task-textarea"></textarea>
                    <div class="form-actions">
                        <button type="submit" class="button-solid">カードを追加</button>
                        <button type="button" @click="isAddingTask = false" class="cancel-button">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
};

