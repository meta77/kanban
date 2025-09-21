// KanbanBoard.js: カンバンボード全体を管理するコンポーネント

export default {
    // ` ` JavaScriptファイルの中にHTMLを書くための特別な書き方.
    // データと見た目を連動させ、さらに親子間のデータのやり取りを宣言的に書けるのが、Vue.jsの大きな特徴
    template: `
        <div class="kanban-board-container">
            <h1>Task</h1>
            <div class="kanban-board">
                <!-- task-listコンポーネントをリストの数だけ繰り返し表示 -->
                <task-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                    @add-task="handleAddTask"
                    @move-task="handleMoveTask"
                ></task-list>
            </div>


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
    // コンポーネントが持つデータ
    data() {
        return {
            lists: [
                {
                    id: 1,
                    title: 'TODO',
                    tasks: [
                        { id: 1, title: 'デザインを作成する', description: 'Figmaでワイヤーフレームを準備' },
                        { id: 2, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 3, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 4, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 5, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 6, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 7, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 8, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                        { id: 9, title: 'コンポーネント設計', description: 'Vueコンポーネントの親子関係を定義' },
                    ]
                },
                {
                    id: 2,
                    title: 'In Progress',
                    tasks: [
                        { id: 10, title: 'HTML/CSSコーディング', description: '静的なページを作成' },
                    ]
                },
                {
                    id: 3,
                    title: 'Done',
                    tasks: []
                },
                {
                    id: 4,
                    title: 'Hold',
                    tasks: [
                        { id: 11, title: 'HTML/CSSコーディング', description: '静的なページを作成' },
                        { id: 12, title: 'HTML/CSSコーディング', description: '静的なページを作成' },
                    ]
                }
            ],
            nextTaskId: 13,  // 次に追加するタスクのID →タスクが何を指すのか、勘違いしていたかも？
            // nextTaskId: this.lists.length + 1　という書き方はエラー。computedを使う必要がある。
            isModalOpen: false, // ★モーダルの表示状態
            newTaskTitle: '',   // ★モーダル内の新しいタスクのタイトル
            newTaskDescription: '', // ★今後を見越して説明も追加
            listIdForNewTask: null, // ★どのリストに追加するかを保持
        }
    },
    computed: {
        nextTaskIdC() { // data()の中に、nextTaskIdを置く形でいいことに気がついた。
            return this.lists.length;
        }
    },
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
        /*
        この handleMoveTask 関数の処理の流れは、まさに引越し作業そのものです。

        依頼書を受け取る ({ taskId, fromListId, toListId })

        元の部屋を探す (find fromList)

        部屋の中の荷物の位置を探す (findIndex taskIndex)

        荷物を部屋から抜き取って手に持つ (splice と movedTask)

        新しい部屋を探して、そこに荷物を置く (find toList と push)

        この一連の処理によって、親コンポーネントが管理している大元のデータ (this.lists) が正確に更新され、画面の表示も自動的に正しく変更されるのです。
        */
    }
};

