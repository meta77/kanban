export default {
    props: {},
    // コンポーネントが持つデータ
    data() {
        return {
            lists: [
                {
                    id: 1,
                    title: 'TODO',
                    tasks: [
                        { id: 1, title: 'デザインの初期案を作成', description: 'メインページのワイヤーフレームとモックアップを作成する。', deadline: '2025-10-05' },
                        { id: 2, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 3, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 4, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 5, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 6, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 7, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 10, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 11, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 12, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 13, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 14, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 15, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 16, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                        { id: 17, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。', deadline: null },
                    ],
                },
                {
                    id: 2,
                    title: '目的・目標定義',
                    tasks: [
                        { id: 8, title: '開発環境のセットアップ', description: 'Vue.jsプロジェクトの基本的な設定とライブラリの導入を行う。', deadline: '2025-09-30' },
                    ],
                },
                {
                    id: 3,
                    title: '進行中',
                    tasks: [
                        { id: 9, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。', deadline: null },
                    ],
                },
                {
                    id: 4,
                    title: 'Hold',
                    tasks: [
                        { id: 18, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。', deadline: null },
                    ],
                },
                {
                    id: 5,
                    title: '完了',
                    tasks: [
                        { id: 19, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。', deadline: null },
                    ],
                },
            ],
            nextTaskId: 20,
            isModalOpen: false,      // モーダルの表示状態
            taskToEdit: null,        // 編集対象のタスクを保持 (nullの場合は新規追加モード)
            listIdForNewTask: null,  // どのリストに追加するかを保持

            // モーダル内のフォームと連携するデータ
            modalTitle: '',
            modalDescription: '',
            modalDeadline: '', // ★締切日用のデータを追加
        };
    },
    // コンポーネントが持つメソッド
    methods: {
        // タスクの保存処理（新規・編集を兼ねる）
        handleSaveTask() {
            if (this.modalTitle.trim() === '') return;

            if (this.taskToEdit) {
                // 編集モードの場合
                this.taskToEdit.title = this.modalTitle;
                this.taskToEdit.description = this.modalDescription;
                this.taskToEdit.deadline = this.modalDeadline || null; // ★締切日を更新
            } else {
                // 新規追加モードの場合
                const targetList = this.lists.find(list => list.id === this.listIdForNewTask);
                if (targetList) {
                    targetList.tasks.push({
                        id: this.nextTaskId++,
                        title: this.modalTitle,
                        description: this.modalDescription,
                        deadline: this.modalDeadline || null, // ★締切日を追加
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
        handleReorderTask({ listId, draggedTaskId, targetTaskId }) {
            // 対象のリストを見つける
            const list = this.lists.find(l => l.id === listId);
            if (!list) return;

            // ドラッグしたタスクとその元の位置(index)を見つける
            const draggedItemIndex = list.tasks.findIndex(t => t.id === draggedTaskId);
            if (draggedItemIndex === -1) return;

            // 1. ドラッグしたタスクを一度リストから削除
            const [draggedItem] = list.tasks.splice(draggedItemIndex, 1);

            // ドロップ先のタスクの位置(index)を見つける
            const targetItemIndex = list.tasks.findIndex(t => t.id === targetTaskId);
            if (targetItemIndex === -1) {
                // 万が一ドロップ先が見つからなければ、元の位置に戻す
                list.tasks.splice(draggedItemIndex, 0, draggedItem);
                return;
            }

            // 2. ドロップ先のタスクの前に、ドラッグしたタスクを挿入
            list.tasks.splice(targetItemIndex, 0, draggedItem);
        },


        // 「新規追加」モーダルを開くメソッド
        handleOpenAddModal(listId) {
            this.taskToEdit = null;
            this.listIdForNewTask = listId;
            this.modalTitle = '';
            this.modalDescription = '';
            this.modalDeadline = ''; // ★リセット
            this.isModalOpen = true;
        },
        // 「編集」モーダルを開くメソッド
        handleOpenEditModal(task) {
            this.taskToEdit = task;
            this.modalTitle = task.title;
            this.modalDescription = task.description;
            this.modalDeadline = task.deadline; // ★既存の締切日をセット
            this.isModalOpen = true;
        },
        // モーダルを閉じるメソッド
        handleCloseModal() {
            this.isModalOpen = false;
            this.taskToEdit = null;
            this.listIdForNewTask = null;
            this.modalTitle = '';
            this.modalDescription = '';
            this.modalDeadline = ''; // ★リセット
        },
    },
    // コンポーネントのテンプレート (HTML)
    template: `
        <div class="kanban-board-container">
            <div class="main-header">
                <h1>Vue.js カンバンボード</h1>
                <button @click="handleOpenAddModal(1)" class="global-add-button">追加</button>
            </div>

            <div class="kanban-board">
                <task-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @open-add-task-modal="handleOpenAddModal"
                    @open-edit-task-modal="handleOpenEditModal"
                    @move-task="handleMoveTask"
                    @reorder-task="handleReorderTask"
                ></task-list>
            </div>

            <!-- タスク追加・編集モーダル -->
            <div v-if="isModalOpen" class="modal-overlay" @click.self="handleCloseModal">
                <div class="modal-content">
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
                        <!-- ★★★ここから追加：締切日入力フォーム★★★ -->
                        <div class="form-group">
                            <label for="task-deadline">締切日</label>
                            <input type="date" id="task-deadline" v-model="modalDeadline" class="date-input">
                        </div>
                        <!-- ★★★ここまで追加★★★ -->
                        <div class="form-actions-modal">
                            <button type="button" @click="handleCloseModal" class="button-cancel">キャンセル</button>
                            <button type="submit" class="button-solid">{{ taskToEdit ? '保存' : 'タスクを追加' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
};

