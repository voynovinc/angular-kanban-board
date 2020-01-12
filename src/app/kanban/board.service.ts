import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { Board, Task } from "./board.model";
import { switchMap, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Create a new board in Firestore database based
   * for the current user.
   *
   * @param data Board data based on `board.model`
   */
  async createBoard(data: Board) {
    const user = await this.afAuth.auth.currentUser;
    return this.db.collection("boards").add({
      ...data,
      uid: user.uid,
      tasks: [{ description: "Hello!", label: "yellow" }]
    });
  }

  /**
   * Delete a specific board for this user.
   *
   * @param boardId id of the board to delete
   */
  deleteBoard(boardId: string) {
    return this.db
      .collection("boards")
      .doc(boardId)
      .delete();
  }

  /**
   * Update the tasks on a given board after
   * changes have been made.
   *
   * @param boardId id of the board to update
   * @param tasks list of tasks associated with the board of type `Task`
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return this.db
      .collection("boards")
      .doc("boardId")
      .update({ tasks });
  }

  /**
   * Remove a specific task from the given board.
   *
   * @param boardId current board id
   * @param task task to remove
   */
  removeTask(boardId: string, task: Task) {
    return this.db
      .collection("boards")
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }

  /**
   * Get all boards owned by current user
   * ordered by priority and if he owns
   * nothing, then return empty array.
   */
  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>("boards", ref =>
              ref.where("uid", "==", user.uid).orderBy("priority")
            )
            .valueChanges({ idField: "id" });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Sort user's boards.
   *
   * @param boards list of boards
   */
  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection("boards").doc(b.id));
    refs.forEach((ref, index) => batch.update(ref, { priority: index }));
    batch.commit();
  }
}
