import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, combineLatest, defer, of, pipe } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})

// c r u d
export class DbService {
  constructor(public afs: AngularFirestore, public angularDb: AngularFireDatabase) {}

  createId() {
    return this.afs.createId();
  }
  collection$(path, query?) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id: id, ...data };
          });
        })
      );
  }

  doc$(path): Observable<any> {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data: any = doc.payload.data();
          const id = doc.payload.id;
          return { id: doc.payload.id, ...data };
        })
      );
  }

  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
      return this.afs.collection(path).add(data);
    } else {
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  delete(path) {
    return this.afs.doc(path).delete();
  }

  likeAddTransaction(collection, docId, itemId, check) {
    //post postId myId   false
    // check 이미 좋아요를 누르고 이제 false가 되려는 유저는 true

    this.afs.firestore.runTransaction(transaction => {
      return transaction.get(this.afs.firestore.collection(collection).doc(docId)).then(eventDoc => {
        if (check) {
          // 유저가 좋아요를 이미 눌렀던 경우
          return transaction.set(
            this.afs.firestore.collection(collection).doc(docId),
            {
              liked: firebase.default.firestore.FieldValue.arrayRemove(itemId),
              likeCount: firebase.default.firestore.FieldValue.increment(-1),
            },
            { merge: true }
          );
        } else {
          // 유저가 좋아요를 새로 누른경우
          return transaction.set(
            this.afs.firestore.collection(collection).doc(docId),
            {
              liked: firebase.default.firestore.FieldValue.arrayUnion(itemId),
              likeCount: firebase.default.firestore.FieldValue.increment(1),
            },
            { merge: true }
          );
        }
      });
    });
  }
}

/**
 * let posts = [{uid : 'test234234', content : '블라블라'},{uid : 'test1234', content : '블라블라'}] =>
 * [{ uid : {id :'test234234', age :23}, content : '블라블라'},{uid : {id :'test1234', age :29}, content : '블라블라'}]
 *  userId만 가지고있는 post들의 Array를 가져와서 post마다 각각의 userId(글쓴이)의 정보(user document)를 불러와서 엮는 경우
 * @param afs  afs
 * @param field   field
 * @param collection   collection
 */
export const listJoin = (afs: AngularFirestore, field: string, collection: string) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(field);
      return source.pipe(
        switchMap(async data => {
          // Save the parent data state
          parent = data;
          if (!parent || typeof parent == 'undefined') {
            return of([]);
          }
          let result = [];
          if (parent) {
            for (const doc of parent) {
              const reads$ = [];
              const arr = doc[field];
              for (const id of arr) {
                const docs$ = await afs
                  .doc(`${collection}/${id}`)
                  .snapshotChanges()
                  .pipe(
                    map((doc: any) => {
                      const data: any = doc.payload.data();
                      const id = doc.payload.id;
                      return { id: doc.payload.id, ...data };
                    })
                  )
                  .pipe(take(1))
                  .toPromise();

                reads$.push(docs$);
              }
              reads$.length ? reads$ : [];
              result.push({ ...doc, detailList: reads$ });
            }
          }

          return result.length ? result : [];
        }),
        map((data: any) => {
          return data;
        })
      );
    });
};
export const leftJoinDocument = (afs: AngularFirestore, field, collection) => {
  return source =>
    defer(() => {
      // Operator state
      let collectionData;
      let real: any;
      const cache = new Map();
      return source.pipe(
        switchMap(data => {
          real = data;
          // Clear mapping on each emitted val ;
          cache.clear();

          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          let i = 0;
          for (const doc of collectionData) {
            // Skip if doc field does not exist or is already in cache
            if (!doc[field] || cache.get(doc[field])) {
              continue;
            }

            // Push doc read to Array
            reads$.push(afs.collection(collection).doc(doc[field]).valueChanges());
            cache.set(doc[field], i);
            i++;
          }

          return reads$.length ? combineLatest(reads$) : of([]);
        }),
        map(joins => {
          return collectionData.map((v, i) => {
            const joinIdx = cache.get(v[field]);
            const item = real.find(e => e.id == v[field]);
            if (field && v[field]) {
              return {
                ...v,
                [field]: { ...joins[joinIdx], id: v[field] } || null,
              };
            } else {
              return v;
            }
          });
        })
      );
    });
};
export const docListJoin = (afs: AngularFirestore, field: string, collection: string) => {
  return source =>
    defer(() => {
      let parent: any;
      let form;

      const cache = new Map();
      return source.pipe(
        switchMap(async data => {
          // Save the parent data state
          parent = data;
          if (!parent || typeof parent == 'undefined') {
            return of([]);
          }
          let result = [];
          if (parent) {
            const reads$ = [];
            const arr = data[field];
            for (const id of arr) {
              const docs$ = await afs
                .doc(`${collection}/${id}`)
                .snapshotChanges()
                .pipe(
                  map((doc: any) => {
                    const data: any = doc.payload.data();
                    return data;
                  })
                )
                .pipe(take(1))
                .toPromise();

              reads$.push(docs$);
            }
            reads$.length ? reads$ : [];
            result.push({ ...parent, [field]: reads$ });
          }

          return result.length ? result : [];
        }),
        map((data: any) => {
          return data[0];
        })
      );
    });
};

/**
 *  한개의 post안에 userId 아이디를 가지고 있고 userId(글쓴이)의 정보(user document)를 불러와서 엮는 경우
 *  userId(field)가 default값이 되어야합니다.
 * @param afs
 * @param field
 * @param collection
 */
export const docJoin = (afs: AngularFirestore, field: string, collection: string) => {
  return source =>
    defer(() => {
      let parent;
      return source.pipe(
        switchMap(data => {
          parent = data;

          const id = data[field];

          return afs
            .doc(`${collection}/${id}`)
            .snapshotChanges()
            .pipe(
              map(doc => {
                return doc.payload.data();
              })
            );
        }),
        map(fieldData => {
          delete parent[field];
          return { [field]: fieldData, ...parent };
        })
      );
    });
};

/**
 * {uid : 'test21343242', favoriteUsers : ['test2232','test4453543','sdfwe234234']}
 * user 안에 즐겨찾기한 user id를 Array로 가지고 있고 각각의 유저 정보를 찾아와 이를 엮는 경우
 * @param afs
 * @param field
 */

export const ArrayJoin = (afs: AngularFirestore, field: string, collection: string) => {
  return source =>
    defer(() => {
      let docData;
      let arr;
      const cache = new Map();

      return source.pipe(
        switchMap(data => {
          cache.clear();

          docData = data; // user(object)

          arr = data[field]; // user.favoriteUsers(array)

          const reads$ = [];
          let i = 0;
          if (arr && arr.length > 0) {
            for (const id of arr) {
              reads$.push(afs.collection(collection).doc(id).valueChanges());

              cache.set(id, i);
              i++;
            }
          }

          return combineLatest(reads$);
        }),

        map(joins => {
          return {
            ...docData,
            [field]: arr.map(v => {
              const joinIdx = cache.get(v); // 고유ID

              return joins[joinIdx] || v;
            }),
          };
        })
      );
    });
};

/**
 * {uid : 'test21343242', favoriteUsers : ['test2232','test4453543','sdfwe234234']}
 * user 안에 즐겨찾기한 user id를 Array로 가지고 있고 각각의 유저 정보를 찾아와 이를 엮는 경우와 같으나 처음에 받아올때 Array!
 * [{uid : 'test21343242', favoriteUsers : ['test2232','test4453543','sdfwe234234']}, {uid : 'test2232', favoriteUsers : ['test21343242','test4453543','sdfwe234234']}]
 * @param afs
 * @param field
 * @param collection
 */
export const ArrayleftJoinDocument = (afs: AngularFirestore, field, collection) => {
  return source =>
    defer(() => {
      // Operator state
      let collectionData;
      let real: any;
      const cache = new Map();
      return source.pipe(
        switchMap(data => {
          real = data;
          // Clear mapping on each emitted val ;
          cache.clear();

          // Save the parent data state
          collectionData = data as any[];
          const reads$ = [];
          let i = 0;
          for (const doc of collectionData) {
            // Skip if doc field does not exist or is already in cache
            if (!doc[field]) {
              continue;
            }
            for (const item of doc[field]) {
              if (cache.get(item)) {
                continue;
              }
              // Push doc read to Array
              reads$.push(afs.collection(collection).doc(item).valueChanges());
              cache.set(item, i);
              i++;
            }
          }

          return reads$.length ? combineLatest(reads$) : of([]);
        }),
        map(joins => {
          return collectionData.map(v => {
            const array = [];
            for (const item2 of v[field]) {
              const joinIdx = cache.get(item2);
              array.push({ ...joins[joinIdx], id: item2 });
            }
            if (field) {
              return {
                ...v,
                [field]: array || [],
              };
            } else {
              return v;
            }
          });
        })
      );
    });
};

/**
 *  favoriteUsers 엮는 다른방법
 *
 * post$.pipe(
 *  withLatestFrom(this.db.collection(`comment`,ref=> ref.where("postId","==",this.postId).where("deleteSwtcih","==",false)),
 *  map(([post, comment]) => ({ comment, ...post })),
).subscribe(restaurant => { })
*/
