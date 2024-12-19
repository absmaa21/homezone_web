export interface ResponseHandling {
  type: MessageType,
  msg: string,
  ok?: boolean,
}

export default abstract class StatusResponseHandling {

  public static login(response: Response): ResponseHandling {

    switch (response.status) {
      case 400:
        return {
          msg: 'Invalid or missing body!',
          type: 'error',
        }
      case 401:
        return {
          msg: 'Invalid credentials!',
          type: 'info'
        }
      case 200:
        return {
          msg: 'Login was successful!',
          type: 'info',
          ok: true,
        }
    }

    console.error('Error while handling Login Error: ' + response.statusText)
    return {
      msg: 'Something went wrong! Try again.',
      type: 'error',
    }
  }


  public static register(response: Response): ResponseHandling {

    switch (response.status) {
      case 400:
        return {
          msg: 'Invalid or missing body!',
          type: 'error',
        }
      case 409:
        return {
          msg: 'Email already in use!',
          type: 'warning',
        }
      case 422:
        return {
          msg: 'Invalid values!',
          type: 'warning',
        }
      case 500:
        return {
          msg: 'Internal Server error! Try again.',
          type: 'error',
        }
      case 200:
        return {
          msg: 'Register was successful!',
          type: 'info',
          ok: true,
        }
    }

    return {
      msg: 'Something went wrong! Try again.' + response.status,
      type: 'error'
    }
  }

}