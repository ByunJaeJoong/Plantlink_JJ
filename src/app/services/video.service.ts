import { Injectable } from '@angular/core';
import { VideoEditor, CreateThumbnailOptions } from '@awesome-cordova-plugins/video-editor/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import * as firebase from 'firebase';
import { Platform } from '@ionic/angular';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { CommonService } from './common.service';
import { LoadingService } from './loading.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(
    private mediaCapture: MediaCapture,
    private platform: Platform,
    private file: File,
    private videoEditor: VideoEditor,
    private camera: Camera,
    private androidPermission: AndroidPermissions,
    private commonService: CommonService,
    private loadingService: LoadingService
  ) {}

  /**
   * camera video
   * 카메라로 직접 찍은 동영상을 업로드
   * @param duration 시간
   */
  cameraVideo(duration: number) {
    let sendData: any = {
      url: '',
      thumbnail: '',
      time: '',
    };

    return new Promise((resolve, reject) => {
      this.GalleryPermission().then(e => {
        if (e) {
          this.loadingService.load();
          this.getVideo(duration)
            .then(MediaFile => {
              let mediaURL: any;
              if (this.platform.is('ios') || this.platform.is('iphone')) {
                mediaURL = 'file:///' + MediaFile[0].fullPath;
              } else {
                mediaURL = MediaFile[0].fullPath;
              }

              this.uploadVideo(mediaURL, 'video')
                .then(video => {
                  this.videoEditor
                    .getVideoInfo({ fileUri: mediaURL })
                    .then(e => {
                      this.getThumbnail(mediaURL)
                        .then((image: any) => {
                          this.uploadPostImage(image, 'thumbnail')
                            .then(img => {
                              sendData.thumbnail = img;
                              sendData.url = video;

                              this.loadingService.hide();
                              resolve(sendData);
                            })
                            .catch(error => {
                              this.loadingService.hide();
                            });
                        })
                        .catch(error1 => {
                          this.loadingService.hide();
                        });
                    })
                    .catch(error2 => {
                      this.loadingService.hide();
                    });
                })
                .catch(error3 => {
                  this.loadingService.hide();
                });
            })
            .catch(error4 => {
              this.loadingService.hide();
            });
        }
      });
    });
  }

  /**
   * gallery video
   * 갤러리에 있는 동영상을 클릭할 경우 업로드
   */
  galleryVideo() {
    return new Promise((resolve, reject) => {
      this.getGallery().then(async (mediaFile: any) => {
        this.loadingService.load();
        let MediaFile: any;
        if (this.platform.is('ios') || this.platform.is('iphone')) {
          MediaFile = mediaFile;
        } else {
          MediaFile = 'file://' + mediaFile;
        }

        this.uploadVideo(MediaFile, 'gallery').then(video => {
          this.videoEditor.getVideoInfo({ fileUri: MediaFile }).then(e => {
            this.getThumbnail(MediaFile)
              .then((image: any) => {
                this.uploadPostImage(image, 'thumbnail')
                  .then(img => {
                    this.loadingService.hide();

                    resolve({
                      url: video,
                      thumbnail: img,
                    });
                  })
                  .catch(error => {
                    console.log('error', error);
                    this.loadingService.hide();
                  });
              })
              .catch(error1 => {
                console.log('error1', error1);
                this.loadingService.hide();
              });
          });
        });
      });
    });
  }

  /**
   * thumbnail
   * 동영상 썸네일 가져오기
   * 위에 명시한 함수 cameraVideo / galleryVideo 안에서 사용하며, 동영상을 가져온 후 썸네일을 만들어 저장 후 파일 경로 생성
   * @param videoData 비디오 파일
   */
  getThumbnail(videoData) {
    return new Promise((resolve, reject) => {
      let thumbnailName: string = 'Thum' + new Date().getTime();
      var file = videoData;

      var option: CreateThumbnailOptions = {
        fileUri: file,
        width: 700,
        height: 700,
        atTime: 1,
        outputFileName: thumbnailName,
        quality: 80,
      };

      this.videoEditor
        .createThumbnail(option)
        .then(result => {
          console.log('result', result);
          resolve(result);
        })
        .catch(error => {
          console.log('error', error);
          reject(error);
        });
    });
  }

  // 하단에는 서브 함수
  ///////////////////////////////////////////////////////////

  getVideo(duration: number) {
    return new Promise((resolve, reject) => {
      this.mediaCapture
        .captureVideo({ duration: duration, quality: 1, limit: 1 })
        .then(videoData => {
          resolve(videoData);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getGallery() {
    var videoOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO,
    };

    return new Promise((resolve, reject) => {
      this.camera
        .getPicture(videoOptions)
        .then(videoData => {
          resolve(videoData);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // ======= upload Video in post folder ====
  uploadVideo(value, type) {
    return new Promise((resolve, reject) => {
      var dataTmp = value;
      var reader = new FileReader();
      var pathSepTmp = dataTmp.lastIndexOf('/') + 1;
      var path = dataTmp.substring(0, pathSepTmp);
      var filename = dataTmp.substring(pathSepTmp);

      this.file
        .readAsDataURL(path, filename)
        .then(URL => {
          this.uploadFtp(URL, type)
            .then(url => {
              resolve(url);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  uploadFtp(tmpPath, type?): Promise<any> {
    return new Promise((resolve, reject) => {
      let videoName: string = 'video-' + new Date().getTime() + '.mp4';

      var storageRef = firebase.default.storage().ref();
      var file = tmpPath + '';
      var upRef = '/videos/' + videoName;
      var uploadTask = storageRef.child(upRef).putString(file, 'data_url', { contentType: 'video/mp4' });
      uploadTask.on(
        firebase.default.storage.TaskEvent.STATE_CHANGED,
        snapshot => {},
        error => {
          console.log(error);
        },
        () => {
          try {
            uploadTask.then(v => {
              let url = `https://storage.googleapis.com/${v.metadata.bucket}/${v.metadata.fullPath}`;
              resolve(url);
            });
          } catch (e) {
            resolve(e);
          }
        }
      );
    });
  }

  //접근 권한 설정
  GalleryPermission(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('android')) {
        this.androidPermission.checkPermission(this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
          value => {
            console.log('카메라 접근 권한 확인:', value.hasPermission);
            if (value.hasPermission) {
              resolve(true);
            } else {
              this.androidPermission.requestPermission(this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                value => {
                  console.log('카메라 접근 권한 설정:', value.hasPermission);
                  if (value.hasPermission) {
                    resolve(true);
                  }
                },
                e => {
                  console.log('카메라 접근 권한 설정 실패:', e.message, e);
                }
              );
            }
          },
          e => {
            console.log('카메라 접근 권한 확인 실패:', e.message, e);
          }
        );
      } else {
        resolve(true);
      }
    });
  }

  //firebase storage 에 저장
  uploadPostImage(url, option?: 'thumbnail') {
    return new Promise(resolve => {
      if (url === undefined) return url;
      let result = url;
      url = 'file:///' + url;
      var dataTmp = url;
      var pathSepTmp = dataTmp.lastIndexOf('/') + 1;

      var path = dataTmp.substring(0, pathSepTmp);
      var filename = dataTmp.substring(pathSepTmp);

      this.file.readAsDataURL(path, filename).then((base64data: string) => {
        var storageRef = firebase.default.storage().ref();
        var file = base64data + '';
        var fileName = 'image_' + moment().format('x') + '.jpg';
        var upRef = '/images/' + fileName;
        var uploadTask = storageRef.child(upRef).putString(file, 'data_url');
        uploadTask.on(
          firebase.default.storage.TaskEvent.STATE_CHANGED,
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            try {
              uploadTask.then(v => {
                let url = `https://storage.googleapis.com/${v.metadata.bucket}/${v.metadata.fullPath}`;
                resolve(url);
              });
            } catch (e) {
              resolve(e);
            }
          }
        );
      });
    });
  }
}
