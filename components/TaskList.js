// TaskList.js: 各リスト（TODO, In Progressなど）を表すコンポーネント

export default {
    // 親コンポーネントから受け取るデータ (プロパティ)
    props: {
        list: {
            type: Object, // オブジェクトしか受け付けない。{ id: 1, title: 'TODO', tasks: [...] }という形式のみ。
            required: true,
        },
    },

    /*
    普段は task-list として静かに表示されている。
    タスクが上空に飛んでくると (@dragover)、「着陸OK！」の合図を出し (.prevent)、歓迎のライトアップ（:classで見た目を変更）の準備を始める (handleDragOver)。
    タスクが無事に着陸した瞬間 (@drop)、司令室（親コンポーネント）に報告するための処理 (handleDrop) を実行する。
    */

    /*
    <task-card>
    陳列棚(div)を用意し、
    注文リスト(list.tasks)を上から順に見て (v-for)、
    注文の数だけパンの型(<task-card>)を使ってパンを作り、
    各パンに管理番号(:key)と注文内容(:task)を正確に刻印し、
    それぞれのパンに「つかまれたら知らせる」という合図(@dragstart)を仕込んでおく。

    @dragstart: ユーザーがマウスでこの<task-card>をつかんで、ドラッグを開始した瞬間に発動する合図です。
    $event: ドラッグ操作に関するブラウザの専門的な情報。これを渡すことで、ドラッグに関する細かい設定（例えば、移動中であることを示すなど）が可能になります。
    */

    template: `
        <div
            class="task-list"
            @dragover.prevent="handleDragOver"
            @drop="handleDrop"
            :class="{ 'drag-over': isDragOver }"
        >
            <div class="task-list-header">
                <h2>{{ list.title }}</h2>
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

