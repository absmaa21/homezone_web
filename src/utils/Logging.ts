import {logLevel, Loglevel} from "../../env.ts";

export abstract class Log {

    private static log(msg: string) {
        const now = new Date()
        console.log(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds() + msg)
    }

    public static info(msg: string) {
        if (logLevel <= Loglevel.INFO)
            this.log(' [INFO] ' + msg)
    }

    public static warn(msg: string) {
        if (logLevel <= Loglevel.WARN)
            this.log(' [WARN] ' + msg)
    }

    public static error(msg: string) {
        if (logLevel <= Loglevel.ERROR)
            this.log(' [ERROR] ' + msg)
    }

    public static debug(msg: string) {
        if (logLevel <= Loglevel.DEBUG)
            this.log(' [DEBUG] ' + msg)
    }

    public static trace(msg: string) {
        if (logLevel <= Loglevel.TRACE)
            this.log(' [TRACE] ' + msg)
    }

}