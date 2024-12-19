export enum Environment {
  BUILD,
  FRONTEND,
}

export enum Loglevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  NONE,
}


export const ip_address: string = "localhost:3000"
export const base_url: string = "http://" + ip_address + "/v1"
export const env: Environment = Environment.BUILD
export const logLevel: Loglevel = Loglevel.DEBUG