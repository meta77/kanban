export default {
    // コンポーネントが受け取るデータ
    props: {},
    // コンポーネントが持つデータ
    data() {
        return {
            lists: [
                {
                    id: 1,
                    title: 'TODO',
                    tasks: [
                        { id: 1, title: 'デザインの初期案を作成', description: 'メインページのワイヤーフレームとモックアップを作成する。' },
                        { id: 2, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                    ],
                },
                {
                    id: 2,
                    title: '進行中',
                    tasks: [
                        { id: 3, title: '開発環境のセットアップ', description: 'Vue.jsプロジェクトの基本的な設定とライブラリの導入を行う。' },
                    ],
                },
                {
                    id: 3,
                    title: '完了',
                    tasks: [
                        { id: 4, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。' },
                    ],
                },
            ],
            nextTaskId: 5,
            isModalOpen: false,      // モーダルの表示状態
            taskToEdit: null,        // ★編集対象のタスクを保持 (nullの場合は新規追加モード)
            listIdForNewTask: null,  // どのリストに追加するかを保持

            // ★モーダル内のフォームと連携するデータ
            modalTitle: '',
            modalDescription: '',
        };
    },
    // コンポーネントが持つメソッド
    methods: {
        // ★タスクの保存処理（新規・編集を兼ねる）
        handleSaveTask() {
            if (this.modalTitle.trim() === '') return;

            if (this.taskToEdit) {
                // 編集モードの場合
                this.taskToEdit.title = this.modalTitle;
                this.taskToEdit.description = this.modalDescription;
            } else {
                // 新規追加モードの場合
                const targetList = this.lists.find(list => list.id === this.listIdForNewTask);
                if (targetList) {
                    targetList.tasks.push({
                        id: this.nextTaskId++,
                        title: this.modalTitle,
                        description: this.modalDescription,
                    });
                }
            }
            this.handleCloseModal();
        },
        // タスクを別のリストに移動する
        handleMoveTask({ taskId, fromListId, toListId }) {
            const fromList = this.lists.find(list => list.id === fromListId);
            if (!fromList) return;
            const taskIndex = fromList.tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) return;
            const [movedTask] = fromList.tasks.splice(taskIndex, 1);
            const toList = this.lists.find(list => list.id === toListId);
            if (toList) {
                toList.tasks.push(movedTask);
            }
        },
        // ★「新規追加」モーダルを開くメソッド
        handleOpenAddModal(listId) {
            this.taskToEdit = null;
            this.listIdForNewTask = listId;
            this.modalTitle = '';
            this.modalDescription = '';
            this.isModalOpen = true;
        },
        // ★「編集」モーダルを開くメソッド
        handleOpenEditModal(task) {
            this.taskToEdit = task;
            this.modalTitle = task.title;
            this.modalDescription = task.description;
            this.isModalOpen = true;
        },
        // モーダルを閉じるメソッド
        handleCloseModal() {
            this.isModalOpen = false;
            this.taskToEdit = null;
            this.listIdForNewTask = null;
            this.modalTitle = '';
            this.modalDescription = '';
        },
    },
    // コンポーネントのテンプレート (HTML)
    template: `
        <div class="kanban-board-container">
            <h1>Vue.js カンバンボード</h1>
            <div class="kanban-board">
                <task-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @open-add-task-modal="handleOpenAddModal"
                    @open-edit-task-modal="handleOpenEditModal"
                    @move-task="handleMoveTask"
                ></task-list>
            </div>

            <!-- ★★★タスク追加・編集モーダル★★★ -->
            <div v-if="isModalOpen" class="modal-overlay" @click.self="handleCloseModal">
                <div class="modal-content">
                    <!-- モードに応じてタイトルを動的に変更 -->
                    <h2>{{ taskToEdit ? 'タスクを編集' : '新しいタスクを追加' }}</h2>
                    <form @submit.prevent="handleSaveTask" class="modal-form">
                        <div class="form-group">
                            <label for="task-title">タスクのタイトル</label>
                            <textarea id="task-title" v-model="modalTitle" required placeholder="タスクのタイトルを入力..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="task-description">説明</label>
                            <textarea id="task-description" v-model="modalDescription" placeholder="タスクの詳細を入力..."></textarea>
                        </div>
                        <div class="form-actions-modal">
                            <button type="button" @click="handleCloseModal" class="button-cancel">キャンセル</button>
                            <!-- モードに応じてボタンテキストを動的に変更 -->
                            <button type="submit" class="button-solid">{{ taskToEdit ? '保存' : 'タスクを追加' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
};

