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
                        { id: 3, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                        { id: 4, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                        { id: 5, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                        { id: 6, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                        { id: 7, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                        { id: 8, title: 'APIエンドポイントの設計', description: 'タスク管理に必要なAPIの仕様を決定する。' },
                    ],
                },
                {
                    id: 2,
                    title: '進行中',
                    tasks: [
                        { id: 9, title: '開発環境のセットアップ', description: 'Vue.jsプロジェクトの基本的な設定とライブラリの導入を行う。' },
                    ],
                },
                {
                    id: 3,
                    title: '完了',
                    tasks: [
                        { id: 10, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。' },
                    ],
                },
                {
                    id: 4,
                    title: 'Hold',
                    tasks: [
                        { id: 11, title: 'プロジェクトの要件定義', description: 'クライアントと打ち合わせを行い、要件をまとめた。' },
                    ],
                },
            ],
            nextTaskId: 12,
            isModalOpen: false, // ★モーダルの表示状態
            newTaskTitle: '',   // ★モーダル内の新しいタスクのタイトル
            newTaskDescription: '', // ★今後を見越して説明も追加
            listIdForNewTask: null, // ★どのリストに追加するかを保持
        };
    },
    // コンポーネントが持つメソッド
    methods: {
        // ★モーダルからタスクを追加する処理に変更
        handleAddTask() {
            // タイトルが空か、空白のみの場合は処理しない
            if (this.newTaskTitle.trim() === '') return;

            // 対象のリストを見つける
            const targetList = this.lists.find(list => list.id === this.listIdForNewTask);
            if (targetList) {
                // 新しいタスクを追加
                targetList.tasks.push({
                    id: this.nextTaskId++,
                    title: this.newTaskTitle,
                    description: this.newTaskDescription,
                });
            }
            // モーダルを閉じる
            this.handleCloseModal();
        },
        // タスクを別のリストに移動する
        handleMoveTask({ taskId, fromListId, toListId }) {
            // 移動元のリストを探す
            const fromList = this.lists.find(list => list.id === fromListId);
            if (!fromList) return;

            // 移動対象のタスクのインデックスを探す
            const taskIndex = fromList.tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) return;

            // タスクを移動元リストから削除し、変数に保持
            const [movedTask] = fromList.tasks.splice(taskIndex, 1);

            // 移動先のリストを探してタスクを追加
            const toList = this.lists.find(list => list.id === toListId);
            if (toList) {
                toList.tasks.push(movedTask);
            }
        },
        // ★モーダルを開くメソッド
        handleOpenModal(listId) {
            this.listIdForNewTask = listId;
            this.isModalOpen = true;
        },
        // ★モーダルを閉じるメソッド
        handleCloseModal() {
            this.isModalOpen = false;
            this.newTaskTitle = '';
            this.newTaskDescription = '';
            this.listIdForNewTask = null;
        },
    },
    // コンポーネントのテンプレート (HTML)
    template: `
        <div class="kanban-board-container">
            <h1>Vue.js カンバンボード</h1>
            <div class="kanban-board">
                <!-- task-listコンポーネントをリストの数だけ繰り返し表示 -->
                <task-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @open-add-task-modal="handleOpenModal"
                    @move-task="handleMoveTask"
                ></task-list>
            </div>

            <!-- ★★★ここから追加：タスク追加モーダル★★★ -->
            <div v-if="isModalOpen" class="modal-overlay" @click.self="handleCloseModal">
                <div class="modal-content">
                    <h2>新しいタスクを追加</h2>
                    <form @submit.prevent="handleAddTask" class="modal-form">
                        <div class="form-group">
                            <label for="task-title">タスクのタイトル</label>
                            <textarea id="task-title" v-model="newTaskTitle" required placeholder="タスクのタイトルを入力..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="task-description">説明</label>
                            <textarea id="task-description" v-model="newTaskDescription" placeholder="タスクの詳細を入力..."></textarea>
                        </div>
                        <div class="form-actions-modal">
                            <button type="button" @click="handleCloseModal" class="button-cancel">キャンセル</button>
                            <button type="submit" class="button-solid">タスクを追加</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
};

