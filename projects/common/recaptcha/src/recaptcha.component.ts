import { Component, OnInit, Renderer2, Output, Input,EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecaptchaDataService } from './recaptcha-data.service';

@Component({
  selector: 'common-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.css']
})
export class RecaptchaComponent implements OnInit {

  @Input('apiBaseUrl') apiBaseUrl: string;
  @Input('nonce') nonce: string;
  @Input('publicKey') publicKey: string;
  @Input('language') language: string = 'en';

  @Output() onValidToken = new EventEmitter<string>();

  errorVerifyAnswer = null;
  state: CAPTCHA_STATE;

  constructor( private dataService: RecaptchaDataService, private _renderer: Renderer2, private _http: HttpClient ) { }

  ngOnInit():void {
    let script = this._renderer.createElement('script');
    script.defer = true;
    script.async = true;
    script.src = "https://www.google.com/recaptcha/api.js";
    this._renderer.appendChild(document.body, script);
  }

  resolved(token:string){
    console.log(token);
    this.state = CAPTCHA_STATE.VERIFYING_TOKEN;
    this.dataService.verifyRecaptcha(this.apiBaseUrl, this.nonce, token).subscribe(response => {
      const payload:any = response.body;
      if (this.isValidPayload(payload)) {
        this.state = CAPTCHA_STATE.SUCCESS_VERIFY_ANSWER_CORRECT;
        this.onValidToken.emit(payload.jwt);
      } else {
        this.state = CAPTCHA_STATE.ERROR_VERIFY;
        this.errorVerifyAnswer = this.createErrorTextLine(response);
      }
    });
  }

  /**
   * Case where HTTP 200 response code is received by the payload is incorrect or corrupt.
   * The occurance of this type of case should be rare.
   * @param payload
   */
  private isValidPayload(payload) {
    if (!payload) {
      console.error('payload cannot be null or undefined or 0');
      return false;
    } else {
      const hasValueProp = payload.hasOwnProperty('valid');
      if (!hasValueProp || payload.valid === false) {
        console.error('Error verifying captcha');
        return false;
      } else {
        return true;
      }
    }
  }

  private createErrorTextLine(error) {
    let line = 'Error status: ' + error.status;
    if (error.statusText) {
      line = line + ', status text: ' + error.statusText;
    }
    return line;
  }
  /***************************
  **    Translated Messages **
  **    *UPDATE REQUIRED*   **
  ****************************/
  public translatedMessages = {
    playAudio: {
      en: 'Play Audio',
      zh: '播放声音',
      fr: 'Lecture audio',
      pa: 'ਆਡੀਓ ਚਲਾਓ',
    },
    tryAnotherImg: {
      en: 'Try another image',
      zh: '换个图像',
      fr: 'Essayez une autre image',
      pa: 'ਕੋਈ ਹੋਰ ਚਿੱਤਰ ਅਜ਼ਮਾਓ',
    },
    userPromptMessage: {
      en: 'Enter the text you either see in the box or you hear in the audio',
      zh: '请输入看到或听到的文字',
      fr: 'Entrez le texte que vous voyez dans la case ou que vous entendez dans le son',
      pa: 'ਉਹ ਟੈਕਸਟ ਦਾਖਲ ਕਰੋ ਜੋ ਤੁਸੀਂ ਬਕਸੇ ਵਿੱਚ ਦੇਖਦੇ ਹੋ ਜਾਂ ਤੁਸੀਂ ਆਡੀਓ ਵਿੱਚ ਸੁਣਦੇ ਹੋ',
    },
    incorrectAnswer: {
      en: 'Incorrect answer, please try again.',
      zh: '答案不对。请重试。',
      fr: 'Mauvaise réponse, veuillez réessayer.',
      pa: 'ਗਲਤ ਜਵਾਬ, ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
    },
    successMessage: {
      en: 'You can submit your application now.',
      zh: '你现在可以提交申请了。',
      fr: 'Vous pouvez soumettre votre candidature maintenant.',
      pa: 'ਤੁਸੀਂ ਆਪਣੀ ਅਰਜ਼ੀ ਹੁਣੇ ਪੇਸ਼ ਕਰ ਸਕਦੇ ਹੋ',
    },
    correct: {
      en: 'Correct.',
      zh: '正确。',
      fr: 'Correct.',
      pa: 'ਸਹੀ ਕਰੋ',
    },
    loadingImage: {
      en: 'Loading CAPTCHA image',
      zh: '正在下载验证码',
      fr: 'Chargement de l\'image CAPTCHA',
      pa: 'ਕੈਪਟਚਾ ਚਿੱਤਰ ਲੋਡ ਕਰ ਰਿਹਾ ਹੈ',
    },
    browserNotSupportAudio: {
      en: 'Your browser does not support the audio element.',
      zh: '你的浏览器不支持播音',
      fr: 'Votre navigateur ne supporte pas l\'élément audio.',
      pa: 'ਤੁਹਾਡਾ ਬ੍ਰਾਉਜ਼ਰ ਆਡੀਓ ਐਲੀਮੈਂਟ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ.',
    },
    verifyingAnswer: {
      en: 'Verifying your answer...',
      zh: '正在验证答案...',
      fr: 'Vérification de votre réponse ...',
      pa: 'ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰ ਰਿਹਾ ਹੈ ...',
    },
    errorRetrievingImg: {
      en: 'Error happened while retrieving CAPTCHA image. Please {{Click Here}} to try again',
      zh: '验证码下载错误。请{{点击这里}}重试',
      fr: 'Une erreur s\'est produite lors de la récupération de l\'image CAPTCHA. S\'il vous plaît {{Cliquez Ici}} pour réessayer',
      pa: 'ਕੈਪਟਚਾ ਚਿੱਤਰ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰਦੇ ਸਮੇਂ ਤਰੁੱਟੀ ਉਤਪੰਨ ਹੋਈ. ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}',
    },
    errorVerifyingAnswer: {
      en: 'Error happened while verifying your answer. Please {{Click Here}} to try again',
      zh: '验证答案过程发生错误。请{{点击这里}}重试',
      fr: 'Une erreur s\'est produite lors de la vérification de votre réponse. S\'il vous plaît {{Cliquez Ici}} pour réessayer',
      pa: 'ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰਨ ਵੇਲੇ ਗਲਤੀ ਆਈ ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}',
    },
  };
}

enum CAPTCHA_STATE {
  VERIFYING_TOKEN = 1,
  SUCCESS_VERIFY_ANSWER_CORRECT = 2,
  ERROR_VERIFY = 3,
}
