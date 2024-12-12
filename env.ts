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
}


export const ip_address: string = "10.151.6.225:3001"
export const base_url: string = "http://" + ip_address + "/v1"
export const env: Environment = Environment.BUILD