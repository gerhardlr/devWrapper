
export class LogItem {
  constructor(text){
    this.text = text;
    this.time = new Date();
  }
}

export function makeMessage(message,source){
	return {text : message, time : (new Date()).toLocaleTimeString(), Source : source}
}

