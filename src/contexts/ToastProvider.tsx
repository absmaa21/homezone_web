import { ToastContext } from "./Contexts";
import {ReactNode, useEffect, useState} from "react";
import {Snackbar} from "@mui/material";
import {Log} from "../utils/Logging.ts";

export interface Message {
  type: MessageType,
  value: string,
}

function ToastProvider({children}: {children: ReactNode}) {
  const [message, setMessage] = useState<Message | null>(null)
  const [show, setShow] = useState(false)
  const [lastPushTime, setLastPushTime] = useState<number>(Date.now())

  const push = (message: string, type?: MessageType) => {
    setMessage({type: type ?? 'info', value: message})
    setLastPushTime(Date.now())
  }

  const clear = () => {
    Log.info('Cleared messages')
    if (Date.now() - lastPushTime > 5000) setShow(false)
  }

  useEffect(() => {
    if (!message) return;

    setShow(true)

    // Set a timer to clear the message after 5 seconds
    const timer = setTimeout(() => {
      clear();
    }, 5000);

    // Cleanup the timer if the message changes or the component unmounts
    return () => clearTimeout(timer);
  }, [message, lastPushTime]);

  return (
    <ToastContext.Provider
      value={{message, push, clear}}
    >
      <Snackbar
        open={show}
        onClose={clear}
        onClick={clear}
        message={message?.value ?? 'Toast Error'}
        onAnimationEnd={() => setMessage(null)}
      />
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;