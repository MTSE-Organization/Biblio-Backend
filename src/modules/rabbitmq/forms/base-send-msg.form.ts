export class BaseSendMsgForm {
  app: string;
  cmd: string;
  subCmd: string | null;
  data: string;

  constructor(app: string, cmd: string, subCmd: string | null, data: string) {
    this.app = app;
    this.cmd = cmd;
    this.subCmd = subCmd;
    this.data = data;
  }
}
